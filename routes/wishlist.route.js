module.exports = app => {
    const WishList = require("../controller/wishList.controller");
  
    var router = require("express").Router();
  
    // Create a new WishList
    router.post("/", WishList.create);
  
    router.get("/:id",WishList.findById);
  
    // Delete WishLists
    router.delete("/qset/:questionSetId/user/:userId", WishList.deleteOne);

   
  
    app.use('/api/wishlist', router);
  };
  