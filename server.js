var braintree = require("braintree");
var express = require('express');
var cors = require('cors');
var app = express();
bodyParser = require('body-parser');

var aCustomerId = '';
var localPaymentMethodToken = '';
var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'jvjyvmmwfp5c5hgj',
    publicKey:    'c44rhmp858bcq7cy',
    privateKey:   'a4245b4c19edf3f04973b03262b0cfe4'
});

gateway.transaction.sale({
    // amount: "10.00",
    paymentMethodNonce: this.nonceFromTheClient,
    options: {
        submitForSettlement: true
    }
}, function (err, result) {
});
app.use(cors());
app.use(bodyParser.json())
app.post("/checkout", function (req, res) {
    // var nonceFromTheClient = req.body.nonce;
    // Use payment method nonce here

    //--------------------------------------------for one time payment------------------
    // gateway.transaction.sale({
    //     amount: "10.00",
    //     paymentMethodNonce: req.body.data,
    //     options: {
    //         submitForSettlement: true
    //     }
    // }, function (err, result) {
    //     res.send(result);
    // });
    //--------------------------------------------for one time payment------------------
    //--------------------------------------------for Subscription----------------------

    gateway.paymentMethod.create({
        customerId: this.aCustomerId,
        paymentMethodNonce: req.body.data
    }, function (err, result) {
            // res.send(result);
        
        gateway.subscription.create({
            paymentMethodToken: result.paymentMethod.token,
            planId: 'fqcb'
        }, function (err, resu) {
            res.send(resu);
        });
    });


    

    //--------------------------------------------for Subscription-----------------------

});


app.get("/client_token", function (req, res) {
    //-------------

    gateway.customer.create({
        firstName: "nipun",
        lastName: "kumar",
        company: "Braintree demo",
        email: "asd@bcd.com",
        phone: "312.555.1234",
        fax: "614.555.5678",
        website: "www.example.com" 
      }, function (err, result) {
          this.aCustomerId = result.customer.id;
      });
    //-------------
    gateway.clientToken.generate({customerId: this.aCustomerId}, function (err, response) {
        res.send({data: response.clientToken});
    });
});

app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});