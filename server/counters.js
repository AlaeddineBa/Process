Meteor.methods({
    'counters.invoices.method': function () {
        if (this.userId) {
            let n = Counters.findOne({});
            return n.INVOICES_NUMBER;
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    }
});
//Retourner le numero du compteur des factures
Meteor.publish('counters.invoices', function () {
    if (this.userId) {
        return Counters.find({});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});