const { cache } = require("../middleware/cacheMiddleware");
const Comments = require("../models/comments.model");
const generateDateTime = require("../utils/util");

// Create and Save a new Comments
exports.create = (req, res) => {
      // Validate request
      
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
     
    //   const createdDate = generateDateTime();
      // Save Comments in the database
      Comments.create(req.body , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Comments."
          });
        else res.send(data);
      });
};

//getCommentsOfQuestion

exports.getCommentsOfQuestion =  (req, res) => {
  console.log(req.params)
  Comments.getCommentsById(req.params.type,req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found comments for question with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving comments for question with id "+ err + req.params.id
        });
      }
    } else{
      // cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
};
