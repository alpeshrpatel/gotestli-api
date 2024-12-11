const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const Comments = require("../controller/comments.controller");
  
    var router = require("express").Router();
  
  

    // Create a new Comments
    router.post("/", Comments.create);

    router.get('/type/:type/question/:id',Comments.getCommentsOfQuestion);
  


   
  
    app.use('/api/comments', router);
  };
  