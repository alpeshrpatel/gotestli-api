const Reviews = require("../models/reviews.model");
const generateDateTime = require("../utils/util");

// Create and Save a new Reviews
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Reviews
  const Reviews = new Reviews({
    questionset_id: req.body.questionset_id,
    satisfaction: req.body.satisfaction,
    difficulty: req.body.difficulty,
    content_quality: req.body.content_quality,
    review: req.body.review,
    created_by: req.body.created_by,
    // created_date : req.body.created_date,
    modified_by: req.body.modified_by,
    // modified_date : req.body.modified_date,
  });

  // Save Reviews in the database
  Reviews.create(Reviews, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Reviews.",
      });
    else res.send(data);
  });
};

exports.getRating = (req, res) => {
  Reviews.getRating(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found rating with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving rating with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.getUserReview = (req, res) => {
  Reviews.getUserReview(req.params.qsetid, req.params.userid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found review.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving review. ",
        });
      }
    } else res.send(data);
  });
};

exports.updateReview = (req, res) => {
  const data = {
    satisfaction: req.body.satisfaction,
    difficulty: req.body.difficulty,
    content_quality: req.body.content_quality,
    review: req.body.review,
  };
  Reviews.updateReview(
    req.params.qsetid,
    req.params.userid,
    data,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found review.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating review. ",
          });
        }
      } else res.send(data);
    }
  );
};
