const Surveys = require("../models/surveys.model");
const generateDateTime = require("../utils/util");

// Create and Save a new Surveys
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Surveys
  const surveys = new Surveys({
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

  // Save Surveys in the database
  Surveys.create(surveys, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Surveys.",
      });
    else res.send(data);
  });
};
