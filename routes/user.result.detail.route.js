module.exports = app => {
    const userresultdetails = require("../controller/user.result.details.controller");
  
    var router = require("express").Router();
  
    // Create a new UserResultDetails
    router.post("/", userresultdetails.create);

    // Create a new UserResultDetails
    router.post("/add/questions", userresultdetails.addAllQuestionForQuestionSet);

    // Create a new UserResultDetails
    router.post("/add/user/questions", userresultdetails.addQuestionsOnStartQuiz);
  
    // Retrieve a single UserResultDetails with id
    router.get("/:id", userresultdetails.findOne);

    // Retrieve a single UserResultDetails with id
    router.get("/userresult/:userresultid", userresultdetails.findUserResultDetailsByUserResultId);

    // Retrieve selected options from test_result_dtl
    router.get("/get/answers/userresult/:userResultId/length/:questionSetLength",userresultdetails.getUserResultAnswers);

    // Retrieve updated status of  test_result_dtl
    router.get("/status/userresult/:userResultId/questionid/:questionId",userresultdetails.getStatus);
  
    // Update a UserResultDetails with id
    router.put("/", userresultdetails.update);

    // Delete a UserResultDetails with id
    router.delete("/:id", userresultdetails.delete);
  
    // Delete all UserResultDetails
    router.delete("/", userresultdetails.deleteAll);
  
    app.use('/api/userresultdetails', router);
  };
  