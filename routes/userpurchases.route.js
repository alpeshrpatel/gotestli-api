const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const UserPurchases = require("../controller/userpurchases.controller");
  
    var router = require("express").Router();
    


    router.post("/", UserPurchases.create);

    router.get("/purchases/user/:userId", UserPurchases.getMyPurchases);


   
  
    app.use('/api/users/purchases', router);
  };
  