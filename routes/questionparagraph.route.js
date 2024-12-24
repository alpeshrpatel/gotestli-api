const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const QuestionParagraph = require("../controller/questionparagraph.controller");
  
    var router = require("express").Router();
  

    // Create a new WaitingList
    router.post("/", QuestionParagraph.create);

    router.delete('/:id',QuestionParagraph.delete);

    router.put('./:id',QuestionParagraph.update)
  

   
  
    app.use('/api/question/paragraph', router);
  };
  