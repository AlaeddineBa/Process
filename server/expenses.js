Meteor.publish('expenses.all', function () {
    if (this.userId) {
        return Expenses.find({user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});

Meteor.publish('expenses.single', function (id) {
    if (this.userId) {
        check(id, String);
        return Expenses.find({_id: id, user_id: this.userId});
    } else {
        throw new Meteor.Error('403', 'Opération non authorisée.');
    }
});

Meteor.methods({
    'expense.create': function (expense) {
        if (this.userId) {

            check(expense.label, String);
            check(expense.recurrence, String);

            expense.amount_TTC = parseFloat((expense.amount_HT * (1 + (expense.TVA / 100)))).toFixed(2);
            expense.amount_TVA = parseFloat((expense.amount_HT * (expense.TVA / 100))).toFixed(2);
            expense.amount_HT = parseFloat(expense.amount_HT).toFixed(2);
            expense.user_id = this.userId;
            expense.created_at = new Date();
            Expenses.insert(expense);
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    },
    'expense.remove': function (idExpense) {
        if (this.userId) {
            check(idExpense, String);
            Expenses.remove({_id: idExpense});
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    },
    'expense.update': function (expense) {
        if (this.userId) {
            check(expense._id, String);
            Clients.update({_id: expense._id}, expense);
        } else {
            throw new Meteor.Error('403', 'Opération non authorisée.');
        }
    }
});