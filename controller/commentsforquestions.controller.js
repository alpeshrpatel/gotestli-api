const { cache } = require("../middleware/cacheMiddleware");
const CommentsForQuestions = require("../models/commentsforquestions.model");
const generateDateTime = require("../utils/util");

// Create and Save a new CommentsForQuestions
exports.create = (req, res) => {
      // Validate request
      
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
     
    //   const createdDate = generateDateTime();
      // Save CommentsForQuestions in the database
      CommentsForQuestions.create(req.body , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the CommentsForQuestions."
          });
        else res.send(data);
      });
};