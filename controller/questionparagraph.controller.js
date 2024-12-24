const { cache } = require("../middleware/cacheMiddleware");
const QuestionParagraph = require("../models/questionparagraph.model");
const generateDateTime = require("../utils/util");

// Create and Save a new QuestionParagraph
exports.create = (req, res) => {
      // Validate request
     
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }

    //   const createdDate = generateDateTime();
      // Save QuestionParagraph in the database
      QuestionParagraph.create(req.body , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the QuestionParagraph."
          });
        else res.send(data);
      });
};

exports.delete = (req, res) => {
  QuestionParagraph.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found option with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete option with id " + req.params.id
        });
      }
    } else res.send({ message: `option was deleted successfully!` });
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  

  QuestionParagraph.updateById(
    req.params.id,
    req.body.paragraph,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found paragraph with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating paragraph with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};