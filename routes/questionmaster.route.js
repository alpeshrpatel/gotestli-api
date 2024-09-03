module.exports = app => {
    const questionmaster = require("../controller/questionmaster.controller");
  
    var router = require("express").Router();
  
    // Create a new QuestionSet
    router.post("/", questionmaster.create);
  
    // Retrieve a single QuestionSet with id
    router.get("/:id", questionmaster.findOne);
  
    // Retrieve a single QuestionSet with id
    router.get("/", questionmaster.findAll);
    
    // Update a QuestionSet with id
    router.put("/:id", questionmaster.update);
  
    // Delete a QuestionSet with id
    router.delete("/:id", questionmaster.delete);
  
    // Delete all QuestionSets
    router.delete("/", questionmaster.deleteAll);
  
    app.use('/api/questionmaster', router);
  };
  