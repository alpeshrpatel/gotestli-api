module.exports = app => {
    const userresult = require("../controller/user.result.controller");
  
    var router = require("express").Router();
  
    // Create a new QuestionSet
    router.post("/", userresult.create);
  
    // Retrieve a single QuestionSet with id
    router.get("/:id", userresult.findOne);

    // Retrieve a single QuestionSet with id
    router.get("/user/:userid", userresult.findByUserId);

    // Retrieve a single QuestionSet with id
    router.get("/user/:userid/questionset/:questionsetid", userresult.findQuestionSetByUserId);

    // Retrieve a history of results of user
    router.get("/history/user/:userid/questionset/:questionsetid", userresult.getHistoryOfUser);

    // Retrieve users list who attempted quiz
    router.get("/students/list/:questionSetId", userresult.getStudentsList);

     // Update a QuestionSet with id
    //  router.put("/calculate/finalresult", userresult.calculate);
  
    // Update a QuestionSet with id
    router.put("/:id", userresult.update);
  
    // Update a QuestionSet with id
    router.put("/calculate/finalresult", userresult.calculate);

    // Delete a QuestionSet with id
    router.delete("/:id", userresult.delete);
  
    // Delete all QuestionSets
    router.delete("/", userresult.deleteAll);
  
    app.use('/api/userresult', router);
  };
  