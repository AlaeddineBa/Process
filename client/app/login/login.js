import Faker from 'faker';
(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$reactive', '$scope'];

    function loginController($reactive, $scope) {
        console.log('TEST');
        $reactive(this).attach($scope);


        let vm = this;

        vm.addClient = addClient;
        vm.addDevis = addDevis;
        vm.addInvoice = addInvoice;
        vm.login = login;
        vm.numberPost = numberPost;
        vm.downloadFacture = downloadFacture;
        vm.addInvoicePost = addInvoicePost;
        vm.transfertInvoice = transfertInvoice;
        vm.addReglements = addReglements;
        vm.addDeposit = addDeposit;
        vm.addExpenses = addExpenses;
        vm.stats = stats;


        vm.subscribe('clients.all');
        vm.subscribe('prospects');
        vm.subscribe('invoices.all');
        vm.subscribe('estimates.all');
        vm.helpers({
            clients: () => Clients.find({}),
            prospects: () => Prospects.find({}),
            invoices: () => Invoices.find({}),
            estimates: () =>Estimates.find({})
        });

        function stats() {

            Meteor.call("stats.expenses", function (err, data) {
                if (err)
                    console.log(err);
                else {
                    console.log(data);
                }

            });

        }

        function addExpenses() {
            let expense = {
                label: Faker.lorem.words(),
                date: Faker.date.future(),
                recurrence: 'Mensuel',
                TVA: '20',
                amount_HT: '100',
                notes: Faker.lorem.words()
            };
            Meteor.call("expense.create", expense, function (err, data) {
                if (err)
                    console.log(err);
                else {
                    console.log('Charge crée ');
                }

            });

        }

        function transfertInvoice(estimate) {

            Meteor.call("estimate.transfert", estimate, function (err, data) {
                if (err)
                    console.log(err);
                else {
                    console.log('Tranfert fait ');
                }

            });
        }

        function addDeposit(id) {
            let deposit = {
                date: new Date(),
                type: 'paiment',
                amount: '4.5',
                by: 'Carte',
                detail: 'test',
                created_at: new Date()
            };

            Meteor.call("estimate.addDeposit", id, deposit, function (err, data) {
                if (err)
                    console.log(err);
                else {
                    console.log('Deposit ajouté ');
                }

            });
        }

        function addReglements(id) {
            let reglement = {
                date: new Date(),
                type: 'paiment',
                amount: '4.5',
                by: 'Carte',
                detail: 'test',
                created_at: new Date()
            };

            Meteor.call("invoice.addReglement", id, reglement, function (err, data) {
                if (err)
                    console.log(err);
                else {
                    console.log('Reglement ajouté ');
                }

            });
        }


        function addClient() {
            let client = {
                civility: 'Monsieur',
                first_name: 'test1',
                last_name: 'test1',
                address: 'adresse1',
                address_2: 'adresse2',
                zip_code: '50000',
                mobile: '0505050505',
                city: 'Nimes',
                email: 'test@test.com'
            };
            Meteor.call("client.create", client, function (err, data) {
                if (err)
                    console.log(err);
                else {
                    console.log('Client ajouté ');
                }

            });
        }

        function addDevis(idClient) {
            console.log(idClient);
            let devis = {
                clientId: idClient,
                date: Faker.date.future(),
                label: Faker.lorem.words(),
                items: [
                    {
                        label: Faker.lorem.words(),
                        quantity: 1,
                        amount_HT: '50',
                        TVA: '20'
                    },
                    {
                        label: Faker.lorem.words(),
                        quantity: 2,
                        amount_HT: '100.5',
                        TVA: '20'
                    },
                    {
                        label: Faker.lorem.words(),
                        quantity: 1,
                        amount_HT: '60',
                        TVA: '20'
                    }, {
                        label: Faker.lorem.words(),
                        quantity: 2,
                        amount_HT: '100',
                        TVA: '20'
                    }
                ]

            };
            Meteor.call("estimate.create", devis, function (err, data) {
                if (err)
                    console.log(err);
                else {
                    console.log('Devis ajouté ');
                }

            });
        }

        function addInvoice(idClient) {
            let facture = {
                clientId: idClient,
                date: Faker.date.future(),
                label: Faker.lorem.words(),
                items: [
                    {
                        label: Faker.lorem.words(),
                        quantity: 1,
                        amount_HT: '50',
                        TVA: '20'
                    },
                    {
                        label: Faker.lorem.words(),
                        quantity: 2,
                        amount_HT: '100.5',
                        TVA: '20'
                    },
                    {
                        label: Faker.lorem.words(),
                        quantity: 1,
                        amount_HT: '60',
                        TVA: '20'
                    }, {
                        label: Faker.lorem.words(),
                        quantity: 2,
                        amount_HT: '100',
                        TVA: '20'
                    }
                ]

            };
            Meteor.call("invoice.create", facture, function (err, data) {
                if (err)
                    console.log(err);
                else {
                    console.log('Facture ajouté ');
                }

            });
        }

        function login() {
            Meteor.loginWithPassword(this.user.email, this.user.password, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('LOGIN');
                }
            });
        }

        function downloadFacture(invoice) {
            Meteor.call('downloadInvoice', invoice, function (err, data) {
                if (err)
                    console.log(err);
                else {
                    var link = document.createElement("a");
                    link.href = data;
                    link.download = "facture.pdf";
                    link.click();
                }
            });
        }

        function numberPost() {
            console.log('TEST');
            HTTP.call('POST', '/v1/number/', {}, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response.content);
                }
            });
        }

        function addInvoicePost() {
            let invoice = {
                owner_id: this.clients[0]._id,
                amount: 40,
                created_at: new Date(),
                number: 15,
                items: [
                    {
                        label: "POST",
                        quantity: 1,
                        amount: 40
                    }]
            };

            HTTP.call('POST', '/v1/facture/add/', {data: invoice}, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response.content);
                }
            });
        }

    }
})();
