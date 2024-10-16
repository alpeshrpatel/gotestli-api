module.exports = app => {
    const WaitingList = require("../controller/waitinglist.controller");
  
    var router = require("express").Router();
  
    // Create a new WaitingList
    router.post("/", WaitingList.create);
  
    router.get("/:id",WaitingList.findById);
  
    // Delete all WaitingLists
    router.delete("/", WaitingList.deleteAll);

   
  
    app.use('/api/waitinglist', router);
  };
  