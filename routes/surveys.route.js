module.exports = app => {
    const Surveys = require("../controller/surveys.controller");
  
    var router = require("express").Router();
  
    // Create a new Surveys
    router.post("/", Surveys.create);

     //rating calculation of one questionset
     router.get('/rating/qset/:id',Surveys.getRating);
  
  
    app.use('/api/surveys', router);
  };
  