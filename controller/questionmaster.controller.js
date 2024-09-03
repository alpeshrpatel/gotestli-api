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
  const questionmaster = new QuestionMaster({
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
  });

  // Save QuestionMaster in the database
  QuestionMaster.create(questionmaster, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the QuestionMaster."
      });
    else res.send(data);
  });
};

// Retrieve all QuestionMaster from the database (with condition).
exports.findAll = (req, res) => {
  // const title = req.query.title;

  QuestionMaster.findAll( (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questionmasters."
      });
    else res.send(data);
  });
};

// Find a single QuestionMaster by Id
exports.findOne = (req, res) => {
  console.log("req.params.id : " + req.params.id)
  QuestionMaster.findById(req.params.id, (err, data) => {
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
    } else res.send(data);
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

  //console.log(req.body);

  QuestionMaster.updateById(
    req.params.id,
    new QuestionMaster(req.body),
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
