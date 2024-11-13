module.exports = app => {
    const RazorPay = require('../controller/razorpay.controller')
  
    var router = require("express").Router();
  
    router.post('/create-order',RazorPay.createOrder)

    router.post('/verify-payment',RazorPay.verifyPayment)
  
    app.use('/api/payment', router);
  };
  