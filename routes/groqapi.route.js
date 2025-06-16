const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    
  
    var router = require("express").Router();
    var GroqApi = require("../controller/groqapi.controller");
  
  
    router.post("/analyze/question/topics", GroqApi.analyzeQuestionTopics);

    // router.get('/type/:type/question/:id',CronJob);
  
    app.use('/api/groq/', router);
  };
  