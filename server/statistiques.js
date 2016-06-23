Meteor.methods({
    'stats.expenses': function () {
        let aggregateStatsExpenses = [

            {
                $group: {
                    _id: {
                        $concat: [
                            {"$substr": [{"$month": "$date"}, 0, 2]},
                            " - ",
                            {"$substr": [{"$year": "$date"}, 0, 4]}
                        ]
                    },
                    totalTTC: {$sum: "$amount_TTC"},
                    totalTVA: {$sum: "$amount_TVA"},
                    countExpenses: {"$sum": 1},
                    //Ajout de la date pour qu'on puisse les trier
                    date: {$min: "$date"}
                }
            },
            {$sort: {date: 1}}
        ];
        return Expenses.aggregate(aggregateStatsExpenses);
    }
});