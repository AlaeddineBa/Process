Meteor.publish('invoices.all', function () {
    if (this.userId) {
        return Invoices.find({user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});

Meteor.publish('invoices.single', function (id) {
    if (this.userId) {

        check(id, String);
        return Invoices.find({_id: id, user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});

Meteor.publish('invoices.list', function (clientId) {
    if (this.userId) {

        check(ownerId, String);
        return Invoices.find({'client.client_id': clientId, user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});

Meteor.methods({
    'invoice.create': function (invoice) {

        if (this.userId) {
            //Recuperer les informations du client concerné
            let user = Clients.findOne({'_id': invoice.clientId});
            let addresses = user.addresses;
            for (let i = 0; i < addresses.length; i++) {
                if (addresses[i].invoice_ready) {
                    var addressReady = addresses[i];
                    break;
                }
            }
            //Recuperer les informations de la societe
            let society = Settings.findOne({label_id: '_SOCIETY_'});
            //Faire le total des items
            let totalHT = 0;
            let totalTTC = 0;
            for (let i = 0; i < invoice.items.length; i++) {
                totalHT += invoice.items[i].amount_HT * invoice.items[i].quantity;
                totalTTC += (invoice.items[i].amount_HT * invoice.items[i].quantity) * (1 + invoice.items[i].TVA / 100);
            }
            Invoices.insert({
                user_id: this.userId,
                number: Counters.findOne({}).INVOICES_NUMBER,
                label: invoice.label,
                total_HT: totalHT.toFixed(2),
                total_TTC: totalTTC.toFixed(2),
                total_TVA: (totalTTC - totalHT).toFixed(2),
                client: {
                    client_id: invoice.clientId,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    address: addressReady.address,
                    zip_code: addressReady.zip_code,
                    city: addressReady.city
                },
                society: {
                    name: society.name,
                    address: society.address,
                    address_2: society.address_2,
                    zip_code: society.zip_code,
                    city: society.city,
                    phone: society.phone,
                    tva: society.tva,
                    siret: society.siret,
                    share_capital: society.share_capital,
                    website: society.website,
                    type: society.type,
                    rcs: society.rcs
                },
                items: invoice.items,
                reglements: [],
                total_reglements: 0,
                created_at: new Date(),
                date: invoice.date,
                done: false

            });
            //Recuperer le compteur du numero des factures
            let n = Counters.findOne({});
            Counters.update({_id: n._id}, {
                $inc: {INVOICES_NUMBER: 1}
            });
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }

    },

    'invoice.remove': function (idInvoice) {
        if (this.userId) {
            check(idInvoice, String);

            Invoices.remove({_id: idInvoice});
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }

    },
    'invoice.update': function (invoice) {
        check(invoice._id, String);
        if (this.userId) {
            Invoices.update({_id: invoice._id}, invoice);
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    },
    'invoice.addReglement': function (id, reglement) {

        if (this.userId) {
            //Ajouter un acompte a un devis
            Invoices.update({_id: id}, {
                $addToSet: {reglements: reglement},
                $inc: {total_reglements: parseFloat(reglement.amount)}
            });
            //Si le montant payé est superieur ou egale au montant de la facture on met done a true
            let invoice = Invoices.findOne({_id: id});
            if (invoice.total_reglements >= invoice.total_TTC) {
                Invoices.update({_id: id}, {
                    $set: {
                        done: true
                    }
                });
            }
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    },
    'invoice.download': function (invoice) {
        if (this.userId) {
            let user = Clients.findOne({});
            let datas = {
                ref: user.last_name.toUpperCase(),
                last_name: user.last_name,
                first_name: user.first_name,
                address: user.address,
                zip_code: user.zip_code,
                city: user.city,
                amount: invoice.amount,
                items: invoice.items,
                number: invoice.number,
                date: moment(invoice.created_at).format('L')
            };
            var response = HTTP.call("POST", 'http://192.168.1.38:8888/', {
                data: {
                    data: JSON.stringify(datas)
                }
            });

            if (response.error) {
                console.log(response.error);
            }
            console.log(response.content);
            return response.content;
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    }
});