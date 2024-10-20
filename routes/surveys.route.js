module.exports = app => {
    const Surveys = require("../controller/surveys.controller");
  
    var router = require("express").Router();
  
    // Create a new Surveys
    router.post("/", Surveys.create);
  
  
    app.use('/api/surveys', router);
  };
  