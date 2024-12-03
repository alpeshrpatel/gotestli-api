const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const CommentsForQuestions = require("../controller/commentsforquestions.controller");
  
    var router = require("express").Router();
  
  

    // Create a new CommentsForQuestions
    router.post("/", CommentsForQuestions.create);
  


   
  
    app.use('/api/comments', router);
  };
  