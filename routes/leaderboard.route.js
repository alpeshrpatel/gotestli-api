const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const Leaderboard = require("../controller/leaderboard.controller");
  
    var router = require("express").Router();
    


    router.post("/", Leaderboard.create);

    router.get("/quiz/:id", Leaderboard.findById);

  


   
  
    app.use('/api/leaderboard', router); 
  };
  