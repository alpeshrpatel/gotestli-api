module.exports = app => {
    const QuestionSetCategory = require("../controller/questionsetcategory.controller");
  
    var router = require("express").Router();
  
    // Create a new QuestionSetCategory
    router.post("/", QuestionSetCategory.create);
  
  
    // Delete a QuestionSetCategory with id
    router.delete("/:id", QuestionSetCategory.delete);
  
    // Delete all QuestionSetCategorys
    router.delete("/", QuestionSetCategory.deleteAll);

    // Retrieve a categories with question_id
    router.get("/questionset/:id", QuestionSetCategory.getCategoriesByQuestionSetId);
  
    app.use('/api/questionset/category', router);
  };
  