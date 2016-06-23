let bodyParser = require('body-parser');

import {Picker} from 'meteor/meteorhacks:picker';

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({extended: false}));

var POST = Picker.filter(function (request, response) {
    return request.method == "POST";
});

POST.route('/v1/facture/download/factureall', function (params, request, response) {

    let res = HTTP.call("POST", "http://192.168.1.38:8888/facturesAll.php", {
        data: {
            data: JSON.stringify(request.body)
        }
    });
    if (res) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.statusCode = 200;
        response.content = res.content;
        response.end(res.content);
    } else {
        response.statusCode = 404;
        response.end(JSON.stringify({error: 404, message: "Document not found "}));
    }


});

POST.route('/v1/facture/download/facturesingle', function (params, request, response) {

    let res = HTTP.call("POST", "http://192.168.1.38:8888/", {
        data: {
            data: JSON.stringify(request.body)
        }
    });
    if (res) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.statusCode = 200;
        response.content = res.content;
        response.end(res.content);
    } else {
        response.statusCode = 404;
        response.end(JSON.stringify({error: 404, message: "Document not found "}));
    }


});

POST.route('/v1/facture/add/', function (params, request, response) {
    let invoice = request.body;
    Meteor.call('insertInvoice', invoice, function (err, data) {
        if (err)
            console.log(err);
        else {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.statusCode = 200;
            response.end(JSON.stringify({message: "Facture ajouté"}));
        }
    });
});

POST.route('/v1/facture/delete/', function (params, request, response) {
    let id = request.body;
    Meteor.call('deleteInvoice', id, function (err, data) {
        if (err)
            console.log(err);
        else {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.statusCode = 200;
            response.end(JSON.stringify({message: "Facture supprimée"}));
        }
    });
});

POST.route('/v1/facture/update/', function (params, request, response) {
    let invoice = request.body;
    Meteor.call('updateInvoice', invoice, function (err, data) {
        if (err)
            console.log(err);
        else {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.statusCode = 200;
            response.end(JSON.stringify({message: "Facture modifiée"}));
        }
    });
});

POST.route('/v1/number/', function (params, request, response) {
    console.log('number');
    Meteor.call('returnNumber', function (err, data) {
        if (err)
            console.log(err);
        else {
            let n = data;

            if (n) {
                response.statusCode = 200;
                response.content = String(n);
                response.end(String(n));
            } else {
                response.statusCode = 404;
                response.end(JSON.stringify({error: 404, message: "Document not found "}));
            }
        }
    });
});
