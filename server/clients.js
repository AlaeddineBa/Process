Meteor.publish('clients.all', function () {
    if (this.userId) {
        return Clients.find({user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});

Meteor.publish('clients.single', function (id) {
    if (this.userId) {
        check(id, String);
        return Clients.find({_id: id, user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }

});

Meteor.methods({
    'client.create': function (client) {
        if (this.userId) {
            client.user_id = this.userId;
            Clients.insert(client);
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    },
    'client.remove': function (idUser) {
        if (this.userId) {
            check(idUser, String);
            Clients.remove({_id: idUser});
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    },
    'client.update': function (idClient, client) {
        if (this.userId) {
            check(idClient, String);
            Clients.update({_id: idClient}, client);
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    }
});