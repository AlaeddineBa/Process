import Faker from 'faker';
Meteor.startup(function () {
    if (!Meteor.users.findOne({})) {
        var userID = Accounts.createUser({
            email: 'alaeddine.baghdadi@outlook.com',
            password: '290592++aA',
            profile: {
                last_name: 'Alaeddine',
                first_name: 'BAGHDADI'
            }
        });
    }
    if (Clients.find().count() === 0) {
        for (let i = 0; i < 5; i++) {

            let rand = Math.floor((Math.random() * 2) + 1);

            const clientId = Clients.insert({
                user_id: userID,
                type: 'PERSON',
                civility: (rand == 1) ? 'Monsieur' : 'Madame',
                first_name: Faker.name.firstName(),
                last_name: Faker.name.lastName(),
                addresses: [{
                    label: 'home',
                    address: Faker.address.streetAddress(),
                    zip_code: Faker.address.zipCode(),
                    city: Faker.address.city(),
                    invoice_ready: true
                }],
                phones: [
                    {
                        label: 'mobile',
                        phone: Faker.phone.phoneNumber()
                    },
                    {
                        label: 'bureau',
                        phone: Faker.phone.phoneNumber()
                    }
                ],
                emails: [
                    {
                        label: 'pro',
                        email: Faker.internet.email()
                    },
                    {
                        label: 'perso',
                        email: Faker.internet.email()
                    }
                ]
            });
        }
    }
    if (!Settings.findOne({})) {
        Settings.insert({
            user_id: userID,
            label_id: '_SOCIETY_',
            name: 'ACCEL PROCESS',
            address: '290 chemin de Saint Dionisy',
            address_2: 'Bâtiment A, Jardin des entreprises',
            zip_code: '30980',
            city: 'Langlade',
            phone: '09 81 87 41 04',
            tva: 'FR 04 804 144 418',
            siret: '804 144 418',
            share_capital: 10000,
            website: 'www.accelgerancia.fr',
            type: 'S.A.S',
            rcs: 'Nîmes'
        })
    }
});