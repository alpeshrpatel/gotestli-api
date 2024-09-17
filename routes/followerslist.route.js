module.exports = app => {
    const FollowersList = require("../controller/followerslist.controller");
  
    var router = require("express").Router();
  
    // Create a new FollowersList
    router.post("/", FollowersList.create);
  
    router.get("/:id",FollowersList.findById);
    
    // Delete a FollowersList with id
    router.delete("/instructor/:instructor_id/follower/:follower_id", FollowersList.delete);
  
    // Delete all FollowersLists
    router.delete("/", FollowersList.deleteAll);

   
  
    app.use('/api/followers/list', router);
  };
  