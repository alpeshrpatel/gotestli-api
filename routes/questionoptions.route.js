module.exports = app => {
    const options = require("../controller/questionoptions.controller");
  
    var router = require("express").Router();
  
  
    // Retrieve a single options with id
    router.get("/:id", options.findOne);

    // Retrieve all the options
    router.get("/", options.findAll);

  
    // Delete a options with id
    router.delete("/:id", options.delete);
  
    // Delete all optionss
    router.delete("/", options.deleteAll);
 
    app.use('/api/options', router);
  };
  