module.exports = app => {
    const QuestionSetQuestion = require("../controller/questionsetquestion.controller");
  
    var router = require("express").Router();
  

    // Retrieve last questionset id to insert into qs
    router.get("/questionsetid", QuestionSetQuestion.findOne);

    // Create a new QuestionSetQuestion
    router.post("/", QuestionSetQuestion.create);
  
  
    // Delete a QuestionSetQuestion with id
    router.delete("/:id", QuestionSetQuestion.delete);
  
    // Delete all QuestionSetQuestions
    router.delete("/", QuestionSetQuestion.deleteAll);

   
  
    app.use('/api/questionset/question', router);
  };
  