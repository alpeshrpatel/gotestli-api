const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const WhiteListedQSet = require("../controller/whitelistedquestionset.controller");
  
    var router = require("express").Router();
    


    router.post("/", WhiteListedQSet.create);

    router.get("/purchases/user/:userId", WhiteListedQSet.getMyPurchases);


   
  
    app.use('/api/whitelisted/questionset', router);
  };
  