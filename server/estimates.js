Meteor.publish('estimates.all', function () {
    if (this.userId) {
        return Estimates.find({user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});

Meteor.publish('estimate.single', function (id) {
    if (this.userId) {
        check(id, String);
        return Estimates.find({_id: id, user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});
Meteor.publish('estimate.list', function (clientId) {
    if (this.userId) {
        check(clientId, String);
        return Estimates.find({'client.client_id': clientId, user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});


Meteor.methods({
    'estimate.create': function (estimate) {
        if (this.userId) {
            check(estimate.clientId, String);
            check(estimate.date, Date);
            check(estimate.label, String);
            //Recuperer les informations du client concerné
            let user = Clients.findOne({_id: estimate.clientId});

            //Chercher la bonne adresse
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
            for (let i = 0; i < estimate.items.length; i++) {
                totalHT += parseFloat(estimate.items[i].amount_HT) * estimate.items[i].quantity;
                totalTTC += (parseFloat(estimate.items[i].amount_HT) * estimate.items[i].quantity) * (1 + estimate.items[i].TVA / 100);
            }

            Estimates.insert({
                user_id: this.userId,
                label: estimate.label,
                total_HT: totalHT.toFixed(2),
                total_TTC: totalTTC.toFixed(2),
                total_TVA: (totalTTC - totalHT).toFixed(2),
                client: {
                    client_id: estimate.clientId,
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
                items: estimate.items,
                deposit_amount: [],
                transfert: false,
                created_at: new Date(),
                date: estimate.date

            });
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    },
    'estimate.update': function (estimate) {
        if (this.userId) {
            check(estimate._id, String);
            check(estimate.clientId, String);
            check(estimate.date, Date);
            check(estimate.label, String);
            Estimates.update({_id: estimate._id}, estimate);
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    },
    'estimate.addDeposit': function (id, deposit) {
        if (this.userId) {
            //id du devis
            check(id, String);
            //Ajouter un acompte a un devis
            Estimates.update({_id: id}, {
                $addToSet: {deposit_amount: deposit},
                $inc: {total_deposit: parseFloat(deposit.amount)}
            });
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    },
    'estimate.transfert': function (estimate) {
        if (this.userId) {
            //Inserer le devis dans la table factures
            Invoices.insert({
                user_id: this.userId,
                label: estimate.label,
                total_HT: estimate.total_HT,
                total_TTC: estimate.total_TTC,
                total_TVA: estimate.total_TVA,
                number: Counters.findOne({}).INVOICES_NUMBER,
                client: estimate.client,
                society: estimate.society,
                total_reglements: estimate.total_deposit,
                items: estimate.items,
                reglements: estimate.deposit_amount,
                done: false,
                created_at: new Date()

            });
            //Mettre le champ transfert de la table Estimates a true
            Estimates.update({_id: estimate._id}, {
                $set: {'transfert': true}
            });

            //Incrementer le compteur du numero des factures
            let n = Counters.findOne({});
            Counters.update({_id: n._id}, {
                $inc: {INVOICES_NUMBER: 1}
            });
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    }


});