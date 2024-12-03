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