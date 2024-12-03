const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const Comments = require("../controller/comments.controller");
  
    var router = require("express").Router();
  
  

    // Create a new Comments
    router.post("/", Comments.create);
  


   
  
    app.use('/api/comments', router);
  };
  