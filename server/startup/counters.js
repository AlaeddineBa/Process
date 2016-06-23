
Meteor.startup(function () {
    if (!Counters.findOne({})) {
        Counters.insert({
            INVOICES_NUMBER: 2965
        });
    }
});