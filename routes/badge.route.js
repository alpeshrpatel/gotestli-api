module.exports = app => {
    const Badge = require("../controller/badge.controller");
  
    var router = require("express").Router();
  
    // Create a new Badge
    router.put("/qsetid/:id/userid/:userId", Badge.create);

    //get a badges of a user
    router.get("/:id", Badge.getBadges);
  
  
   
  
    app.use('/api/badge', router);
  };
  