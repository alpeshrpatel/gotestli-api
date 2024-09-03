module.exports = app => {
    const questionset = require("../controller/questionset.controller");
  
    var router = require("express").Router();
  
    // Create a new QuestionSet
    router.post("/", questionset.create);
  
    // Retrieve a single QuestionSet with id
    router.get("/:id", questionset.findOne);

    //Retrieve all question sets
    router.get("/", questionset.findAll)

    // Retrieve a single QuestionSet with id
    router.get("/category/:id", questionset.getQuestionSetIdByCategoryId);

    //Retrieve questions of questionset
    router.get("/questions/:id", questionset.getQuestionSet);

    // Retrieve question sets of instructor
    router.get("/instructor/:author", questionset.getQuestionSetsOfInstructor)
    
    // Update a QuestionSet with id
    router.put("/:id", questionset.update);
  
    // Delete a QuestionSet with id
    router.delete("/:id", questionset.delete);
  
    // Delete all QuestionSets
    router.delete("/", questionset.deleteAll);

  
    app.use('/api/questionset', router);
  };
  