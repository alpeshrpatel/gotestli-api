const QuestionSet = require("../models/questionset.model");

// Create and Save a new QuestionSet
exports.create = (req, res) => {
      // Validate request
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }

      // Create a QuestionSet
      const questionset = new QuestionSet({
        id:req.body.id,
        org_id:req.body.org_id,
        title:req.body.title,
        question_set_url:req.body.question_set_url,
        image:req.body.image,
        author:req.body.author,
        short_desc:req.body.short_desc,
        description:req.body.description,
        start_time:req.body.start_time,
        end_time:req.body.end_time,
        start_date:req.body.start_date,
        end_date:req.body.end_date,
        time_duration:req.body.time_duration,
        no_of_question:req.body.no_of_question,
        status_id:req.body.status_id,
        is_demo:req.body.is_demo,
        // created_by:req.body.created_by,
        // created_date:req.body.created_date,
        // modified_by:req.body.modified_by,
        // modified_date:req.body.modified_date
        totalmarks:req.body.totalmarks,
        pass_percentage:req.body.pass_percentage
      });

      // Save QuestionSet in the database
      QuestionSet.create(questionset, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the QuestionSet."
          });
        else res.send(data);
      });
};



  // Find a single QuestionSet by Id
exports.getQuestionSetIdByCategoryId =  (req, res) => {
    QuestionSet.getQuestionSetIdByCategoryId(req.params.id, (err, data) => {
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

  // Get a Questions of QuestionSet by Id
exports.getQuestionSet =  (req, res) => {
  QuestionSet.getQuestionSet(req.params.id, (err, data) => {
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

 // Get a Questionset of author by Id
 exports.getQuestionSetsOfInstructor =  (req, res) => {
  console.log(req.params.author)
  QuestionSet.getQuestionSetsOfInstructor (req.params.author, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found QuestionSet of Instructor ${req.params.author}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving QuestionSet of Instructor " + req.params.author
        });
      }
    } else res.send(data);
  });
};

// Retrieve all QuestionSets from the database (with condition).
exports.findAll = (req, res) => {
    // const title = req.query.title;

    QuestionSet.getAll( (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving questionsets."
        });
      else res.send(data);
    });
};

// Find a single QuestionSet by Id
exports.findOne = (req, res) => {
  QuestionSet.findById(req.params.id, (err, data) => {
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

exports.findAll = async(req, res) => {
  QuestionSet.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving question sets."
      });
    else res.send(data);
  });
};

// Update a QuestionSet identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  QuestionSet.updateById(
    req.params.id,
    new QuestionSet(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found QuestionSet with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating QuestionSet with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a QuestionSet with the specified id in the request
exports.delete = (req, res) => {
  QuestionSet.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found QuestionSet with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete QuestionSet with id " + req.params.id
        });
      }
    } else res.send({ message: `QuestionSet was deleted successfully!` });
  });
};

// Delete all QuestionSets from the database.
exports.deleteAll = (req, res) => {
  QuestionSet.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all questionsets."
      });
    else res.send({ message: `All QuestionSets were deleted successfully!` });
  });
};
