Meteor.publish('settings.all', function () {
    if (this.userId) {
        return Settings.find({user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});
Meteor.methods({

    'settings.update': function (settings) {

        if (this.userId) {
            Settings.update({_id: settings._id, user_id: this.userId}, settings);
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }

    }
});
