const { cache } = require("../middleware/cacheMiddleware");
const UserResult = require("../models/user.result.model");

// Retrieve all UserResult by UserId (with condition).
exports.findByUserId = (req, res) => {
  const {orgid} = req.query;
  const userId = req.params.userid;
  UserResult.findByUserId(userId,orgid, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userresults.",
      });
      else{
        cache.set(req.originalUrl, data);
        res.send(data);
      };
  });
};

exports.findByUserIdForTable = (req, res) => {
  const {start,end, search} = req.query
  const {orgid} = req.query;
  const userId = req.params.userid;
  UserResult.findByUserIdForTable(userId,start,end,search,orgid, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userresults.",
      });
      else{
        cache.set(req.originalUrl, data);
        res.send(data);
      };
  });
};

// Retrieve all UserResult by UserId (with condition).
exports.findQuestionSetByUserId = (req, res) => {
  const {orgid} = req.query;
  const userid = req.params.userid;
  const questionsetid = req.params.questionsetid; // query = {questionset:1}

  UserResult.findQuestionSetByUserId(userid, questionsetid,orgid, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userresults.",
      });
      else{
        cache.set(req.originalUrl, data);
        res.send(data);
      };
  });
};

// Retrieve UserResult by UserId and questionId (with condition).
exports.getHistoryOfUser = (req, res) => {
  const {orgid} = req.query;
  const userId = req.params.userid;
  const questionsetid = req.params.questionsetid;

  UserResult.getHistoryOfUser(userId, questionsetid,orgid, (err, data) => {
    if (err)
      res.send({
        message:
          err.message || "Some error occurred while retrieving userresults.",
      });
      else{
        cache.set(req.originalUrl, data);
        res.send(data);
      };
  });
};

exports.getStudentsList = (req, res) => {
  
  const {orgid} = req.query;
  const questionSetId = req.params.questionSetId;
  const {start,end,search} = req.query;

  UserResult.getStudentsList(questionSetId,start,end,search,orgid, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving students list.",
      });
      else{
        cache.set(req.originalUrl, data);
        res.send(data);
      }
  });
};

//getDshbDataAnalysis
exports.getDshbDataAnalysis = (req, res) => {
  const { orgid } = req.query;
  const { userId } = req.params;

  if (!orgid || !userId) {
    return res.status(400).send({
      message: "Missing required parameters: orgid or userId",
    });
  }
  
  UserResult.getDshbDataAnalysis(userId,orgid, (err, data) => {
  
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data.",
      });
      else{
        cache.set(req.originalUrl, data);
        res.send(data);
      }
  });
};

//getTotalAttemptCount
exports.getTotalAttemptCount = (req, res) => {
  const {orgid} = req.query;
  UserResult.getTotalAttemptCount(req.params.userId,orgid, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data.",
      });
      else{
        // cache.set(req.originalUrl, data);
        res.send(data);
      }
  });
};


exports.getAll = (req, res) => {
  UserResult.getAll(req.params.orgid, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data.",
      });
      else{
        // cache.set(req.originalUrl, data);
        res.send(data);
      }
  });
};

exports.calculate = (req, res) => {
  // Validate request
 
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
    modified_by:req.body.userId
  });

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
    org_id: req.body.org_id,
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
  const {orgid} = req.query;
  UserResult.findAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userresults.",
      });
      else{
        cache.set(req.originalUrl, data);
        res.send(data);
      };
  });
};

// Find a single UserResult by Id
exports.findOne = (req, res) => {
  const {orgid} = req.query;
  UserResult.findById(req.params.id,orgid, (err, data) => {
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
    } else{
      cache.set(req.originalUrl, data);
      res.send(data);
    };
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
      } else{
        cache.set(req.originalUrl, data);
        res.send(data);
      };
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