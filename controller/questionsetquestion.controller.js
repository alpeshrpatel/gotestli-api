const QuestionSetQuestion = require("../models/questionsetquestion.model");

// Find a last questionsetid
exports.findOne = (req, res) => {
  QuestionSetQuestion.findById((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found QuestionSetId.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving QuestionSetId. "
        });
      }
    } else res.send(data);
  });
};

// Create and Save a new QuestionSetQuestion
exports.create = (req, res) => {
  // Validate request
  
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Save QuestionSetQuestion in the database
  let dataSet = [];
 
  req.body.forEach((item, index) => {
    if (item !== null) {
      const createdDate = new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);
      const data = [
        item.question_set_id,
        item.question_id,
        10,
        createdDate,
        null,
        createdDate,
      ];

      dataSet.push(data);

      if (index === req.body.length - 1) {
        QuestionSetQuestion.create(dataSet, (err, data) => {
          if (err) {
            return res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the question set questions.",
            });
          } else {
            return res.send(data);
          }
        });
      }
    }
  });
};

// Delete a QuestionSetQuestion with the specified id in the request
exports.delete = (req, res) => {
  QuestionSetQuestion.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found QuestionSetQuestion with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Could not delete QuestionSetQuestion with id " + req.params.id,
        });
      }
    } else
      res.send({ message: `QuestionSetQuestion was deleted successfully!` });
  });
};

// Delete all QuestionSetQuestions from the database.
exports.deleteAll = (req, res) => {
  QuestionSetQuestion.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all QuestionSetQuestions.",
      });
    else
      res.send({
        message: `All QuestionSetQuestions were deleted successfully!`,
      });
  });
};
