const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const Transactions = require("../controller/transactions.controller");
  
    var router = require("express").Router();
    


    router.post("/", Transactions.create);

    router.get("/getall/payments/:userid", Transactions.getAllPayments);

    router.get("/payments/:userid", Transactions.getMyPayments);

    router.get('/receipt/:paymentIntentId', Transactions.getReceipt);

    router.put('/refund/:paymentIntentId', Transactions.refundPaymentUpdate);


   
  
    app.use('/api/transactions', router); 
  };
  