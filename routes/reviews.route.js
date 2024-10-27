module.exports = app => {
    const Reviews = require("../controller/reviews.controller");
  
    var router = require("express").Router();
  
    // Create a new Reviews
    router.post("/", Reviews.create);

     //rating calculation of one questionset
     router.get('/rating/qset/:id',Reviews.getRating);

     // get rating of user using userId,questionset_id
     router.get('/qset/:qsetid/user/:userid',Reviews.getUserReview)

     // update review
     router.put('/update/qset/:qsetid/user/:userid',Reviews.updateReview)
  
  
    app.use('/api/reviews', router);
  };
  