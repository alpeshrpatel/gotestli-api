const UserResult = require("../models/user.result.model");

// Retrieve all UserResult by UserId (with condition).
exports.findByUserId = (req, res) => {
  // console.log("req.params.id : " + req.params.id)
  const userId = req.params.userid;
  UserResult.findByUserId(userId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userresults.",
      });
    else res.send(data);
  });
};

// Retrieve all UserResult by UserId (with condition).
exports.findQuestionSetByUserId = (req, res) => {
  console.log("req.params.id : " + req.params.userid);
  console.log("req.params.id : " + req.params.questionsetid);
  const userid = req.params.userid;
  const questionsetid = req.params.questionsetid; // query = {questionset:1}

  UserResult.findQuestionSetByUserId(userid, questionsetid, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userresults.",
      });
    else res.send(data);
  });
};

// Retrieve UserResult by UserId and questionId (with condition).
exports.getHistoryOfUser = (req, res) => {
  console.log("req.params.id : " + req.params.userid);
  console.log("req.params.id : " + req.params.questionsetid);
  const userId = req.params.userid;
  const questionsetid = req.params.questionsetid;

  UserResult.getHistoryOfUser(userId, questionsetid, (err, data) => {
    if (err)
      res.send({
        message:
          err.message || "Some error occurred while retrieving userresults.",
      });
    else res.send(data);
  });
};

exports.getStudentsList = (req, res) => {
  console.log("req.params.id : " + req.params.questionSetId);

  const questionSetId = req.params.questionSetId;

  UserResult.getStudentsList(questionSetId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving students list.",
      });
    else res.send(data);
  });
};

exports.calculate = (req, res) => {
  // Validate request
  console.log("requset body"+req.body)
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  let userresult = new UserResult({
    id: req.body.userResultId,
    question_set_id: req.body.questionSetId,
    total_question: req.body.totalQuestions,
    total_answered: req.body.totalAnswered,
    total_not_answered: req.body.skippedQuestion,
    total_reviewed: req.body.totalReviewed,
  });


  console.log("-----userresult : " + JSON.stringify(userresult));

  // Save UserResult in the database
  UserResult.calculateResult(userresult, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the UserResult.",
      });
    else res.send(data);
  });
};

// Create and Save a new UserResult
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a UserResult
  
  const date = new Date().toISOString().slice(0, 10);
  const userresult = new UserResult({
    // id : req.body.id,
    org_id: 10,
    user_id: req.body.user_id,
    question_set_id: req.body.question_set_id,
    total_question: req.body.total_question,
    total_answered: req.body.total_answered,
    total_not_answered: req.body.total_not_answered,
    total_reviewed: req.body.total_reviewed,
    total_not_visited: req.body.total_not_visited,
    percentage: req.body.percentage,
    marks_obtained: req.body.marks_obtained,
    date: date,
    flag: null,
    created_by: req.body.created_by,
    // created_date: req.body.created_date,
    modified_by: req.body.modified_by,
    // modified_date: req.body.modified_date,
    status: req.body.status,
  });

  // Save UserResult in the database
  UserResult.create(userresult, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the UserResult.",
      });
    else res.send(data);
  });
};

// Retrieve all UserResult from the database (with condition).
exports.findAll = (req, res) => {
  const title = req.query.title;

  UserResult.findAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userresults.",
      });
    else res.send(data);
  });
};

// Find a single UserResult by Id
exports.findOne = (req, res) => {
  console.log("req.params.id : " + req.params.id);
  UserResult.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserResult with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving UserResult with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Update a UserResult identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  UserResult.updateById(
    req.params.id,
    new UserResult(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found UserResult with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating UserResult with id " + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a UserResult with the specified id in the request
exports.delete = (req, res) => {
  UserResult.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserResult with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete UserResult with id " + req.params.id,
        });
      }
    } else res.send({ message: `UserResult was deleted successfully!` });
  });
};

// Delete all UserResults from the database.
exports.deleteAll = (req, res) => {
  UserResult.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all userresults.",
      });
    else res.send({ message: `All UserResults were deleted successfully!` });
  });
};