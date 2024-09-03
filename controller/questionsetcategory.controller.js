const QuestionSetCategory = require("../models/questionsetcategory.model");

// Create and Save a new QuestionSetCategory
exports.create = (req, res) => {
      // Validate request
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }

      // Create a QuestionSetCategory
      const questionSetCategory = new QuestionSetCategory({
        // id : req.body.id,
        question_set_id : req.body.question_set_id,
        category_id : req.body.category_id,
        // created_by : req.body.created_by,
        // created_date : req.body.created_date,
        // modified_by : req.body.modified_by,
        // modified_date : req.body.modified_date,
        });

      // Save QuestionSetCategory in the database
      QuestionSetCategory.create(questionSetCategory, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the QuestionSetCategory."
          });
        else res.send(data);
      });
};


exports.getCategoriesByQuestionSetId =  (req, res) => {
    QuestionSetCategory.getCategoriesByQuestionSetId(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found QuestionSet with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving QuestionSet with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };
 


// // Update a QuestionSetCategory identified by the id in the request
// exports.update = (req, res) => {
//   // Validate Request
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//   }

//   console.log(req.body);

//   QuestionSetCategory.updateById(
//     req.params.id,
//     new QuestionSetCategory(req.body),
//     (err, data) => {
//       if (err) {
//         if (err.kind === "not_found") {
//           res.status(404).send({
//             message: `Not found QuestionSetCategory with id ${req.params.id}.`
//           });
//         } else {
//           res.status(500).send({
//             message: "Error updating QuestionSetCategory with id " + req.params.id
//           });
//         }
//       } else res.send(data);
//     }
//   );
// };

// Delete a QuestionSetCategory with the specified id in the request
exports.delete = (req, res) => {
  QuestionSetCategory.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found QuestionSetCategory with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete QuestionSetCategory with id " + req.params.id
        });
      }
    } else res.send({ message: `QuestionSetCategory was deleted successfully!` });
  });
};

// Delete all QuestionSetCategorys from the database.
exports.deleteAll = (req, res) => {
  QuestionSetCategory.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all QuestionSetCategorys."
      });
    else res.send({ message: `All QuestionSetCategorys were deleted successfully!` });
  });
};
