const { cache } = require("../middleware/cacheMiddleware");
const QuestionMaster = require("../models/questionmaster.model");

// Create and Save a new QuestionMaster
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a QuestionMaster
  // const questionmaster = new QuestionMaster({
  //   org_id: req.body.org_id,
  //   question: req.body.question,
  //   description: req.body.description,
  //   explanation: req.body.explanation, 
  //   paragraph_id:req.body.paragraph_id,
  //   question_type_id: req.body.question_type_id,
  //   status_id: req.body.status_id,
  //   complexity: req.body.complexity,
  //   marks: req.body.marks,
  //   is_negative: req.body.is_negative,
  //   negative_marks: req.body.negative_marks,
  // });
  const questionmaster = new QuestionMaster({
    org_id: req.body.org_id || 0,
    question: req.body.question || null,
    description: req.body.description || null,
    explanation: req.body.explanation || null,
    paragraph_id: req.body.paragraph_id || null,
    question_type_id: req.body.question_type_id || null,
    status_id: req.body.status_id || 1,
    complexity: req.body.complexity || null,
    marks: req.body.marks || 0,
    is_negative: req.body.is_negative || 0,
    negative_marks: req.body.negative_marks || 0,
  });
  
  // Save QuestionMaster in the database
  QuestionMaster.create(questionmaster,req.body.userId, (err, data) => {
    if (err){
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Duplicate question detected' });
      }
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the QuestionMaster."
      });
    }
    else res.send(data);
  });
};

// Retrieve all QuestionMaster from the database (with condition).
exports.findAll = (req, res) => {
  // const title = req.query.title;
  const userid = req.params.userId
  const { start, end, search, complexity, status, categoryId,orgid } = req.query;
  QuestionMaster.findAll(userid,start, end, search, complexity, status, categoryId,orgid, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questionmasters."
      });
      else{
        cache.set(req.originalUrl, data);
        res.send(data);
      };
  });
};

// Find a single QuestionMaster by Id
exports.findOne = (req, res) => {
  const {orgid} = req.query;
  QuestionMaster.findById(req.params.id,orgid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found QuestionMaster with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving QuestionMaster with id " + req.params.id
        });
      }
    } else{
      cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
};

//find a paragraph
exports.findParagraph = (req, res) => {
  const {orgid} = req.query;
  QuestionMaster.findParagraph(req.params.id,orgid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found paragraph with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving paragraph with id " + req.params.id
        });
      }
    } else{
      cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
};

//findDetailedQuestion
exports.findDetailedQuestion = (req, res) => {
  const { userId } = req.params; 
    const { start, end, orgid } = req.query; 
  QuestionMaster.findDetailedQuestion(userId,start,end,orgid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found question with id ${userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving question with id " + err + userId
        });
      }
    } else{
      // cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
};

// Update a QuestionMaster identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const {orgid} = req.query;

  QuestionMaster.updateById(
    req.params.id,
    new QuestionMaster(req.body), orgid,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found QuestionMaster with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating QuestionMaster with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.updateStatus = (req, res) => {
  const {orgid} = req.query;
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  QuestionMaster.updateStatusById(
    req.params.id,
    req.body.statusId, orgid,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found QuestionMaster with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating QuestionMaster with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a QuestionMaster with the specified id in the request
exports.delete = (req, res) => {
  QuestionMaster.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found QuestionMaster with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete QuestionMaster with id " + req.params.id
        });
      }
    } else res.send({ message: `QuestionMaster was deleted successfully!` });
  });
};

// Delete all QuestionMasters from the database.
exports.deleteAll = (req, res) => {
  QuestionMaster.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all questionmasters."
      });
    else res.send({ message: `All QuestionMasters were deleted successfully!` });
  });
};
