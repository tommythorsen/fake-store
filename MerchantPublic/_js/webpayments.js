'use strict';

var supportedMethods = [
  "braintree",
  "visa checkout"
];

var details = { // PaymentDetails
  "items" : [
    { // PaymentItem
      "id" : "foo",
      "label" : "24 hour subscription for only $2.99!",
      "amount" : { // CurrencyAmount
        "currencyCode" : "USD",
        "value" : "2.99"
      }
    }
  ],
  "shippingOptions" : [
    { // ShippingOption
      "id" : "bar",
      "label" : "Online purchase.",
      "amount" : { // CurrencyAmount
        "currencyCode" : "USD",
        "value" : "0.00"
      }
    }
  ]
};

var options = { // PaymentOptions
  "requestShipping" : false
};

var data = {
  "braintree" : {
    "token" : "",
  },
  "visa checkout" : {
  }
}

function runPayments() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var token = xhttp.responseText;
      data.braintree.token = token;
      runPaymentRequest();
    }
  }
  xhttp.open("GET", "/client_token", true);
  xhttp.send();
}

function runCheckout(nonce, amount) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // The user should now be authenticated
      window.top.location.reload();
    }
  }
  var params = "payment_method_nonce=" + nonce + "&full_amount=" + amount;
  xhttp.open("post", "/checkout?" + params, true);
  xhttp.send();
}

function runPaymentRequest() {
  var request = new PaymentRequest(supportedMethods, details, options, data);
  request.show().then(function(paymentResponse) {
    runCheckout(paymentResponse.details.nonce, details.items[0].amount.value);
  }).catch(function(err) {
    alert("Uh oh, something bad happened", err.message);
  });
}
