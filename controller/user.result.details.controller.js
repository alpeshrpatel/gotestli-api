const UserResultDetail = require("../models/user.result.detail.model");

const { usertestresult } = require("../queries");
const util = require("../utils/util");

// Create and Save a new UserResultDetail
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a UserResultDetail
  const userresultdetail = new UserResultDetail({
    // id : req.body.id,
    user_test_result_id: req.body.user_test_result_id,
    question_set_question_id: req.body.question_set_question_id,
    // question_type : req.body.question_type,
    // answer : req.body.answer,
    correct_answer: req.body.correct_answer,
    status: req.body.status,
    // created_by:req.body.created_by,
    // created_date:req.body.created_date,
    // modified_by:req.body.modified_by,
    // modified_date:req.body.modified_date
  });

  // Save UserResultDetail in the database
  UserResultDetail.create(userresultdetail, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the UserResultDetail.",
      });
    else res.send(data);
  });
};


exports.addQuestionsOnStartQuiz= (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const createdDate = new Date()
  .toISOString()
  .replace("T", " ")
  .substring(0, 19);

  UserResultDetail.addQuestionsOnStartQuiz(
    req.body.userId,
    req.body.questionSetId,
    req.body.userResultId, 
    createdDate,
    (err, data) => {
      if (err) {
        return res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating the UserResultDetail.",
        });
      } else {
        return res.send(data);
      }
    });      
};

exports.addAllQuestionForQuestionSet = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let dataSet = [];
console.log(req.body)
  req.body.forEach((item, index) => {
    if (item !== null) {
      UserResultDetail.getAnswers(
        item.question_set_question_id,
        (err, result) => {
          if (err) {
            return res.status(500).send({
              message: "Error occurred while retrieving correct answers.",
            });
          }

          const correctAnswer =
            result.length > 0 ? result[0].correctAnswer : null;
          const createdDate = new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19);
          const data = [
            item.user_test_result_id,
            item.question_set_question_id,
            2,
            null,
            correctAnswer,
            10,
            createdDate,
            null,
            createdDate,
            item.status,
          ];

          dataSet.push(data);

          
          if (index === req.body.length - 1) {           
            UserResultDetail.addAllQuestionForQuestionSet(
              dataSet,
              (err, data) => {
                if (err) {
                  return res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while creating the UserResultDetail.",
                  });
                } else {
                  return res.send(data);
                }
              }
            );
          }
        }
      );
    }
  });
};

// Retrieve all UserResultDetail from the database (with condition).
exports.findAll = (req, res) => {
  const title = req.query.title;

  UserResultDetail.findAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving userresultdetails.",
      });
    else res.send(data);
  });
};

// Find a single UserResultDetail by Id
exports.findOne = (req, res) => {
  console.log("req.params.id : " + req.params.id);
  UserResultDetail.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserResultDetail with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving UserResultDetail with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Find a single UserResultDetail by Id
exports.findUserResultDetailsByUserResultId = (req, res) => {
  UserResultDetail.findUserResultDetailsByUserResultId(
    req.params.userresultid,
    (err, data) => {
      console.log("response :" + res.status);
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            // console.log("404");
            message: `Not found UserResultDetail with id ${req.params.userresultid}.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error retrieving UserResultDetail with id " +
              req.params.userresultid,
          });
        }
      } else res.send(data);
    }
  );
};

exports.getUserResultAnswers = (req, res) => {
  UserResultDetail.getUserResultAnswers(
    req.params.userResultId,
    req.params.questionSetLength,
    (err, data) => {
      console.log("response :" + res.status);
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found selected options with id ${req.params.userResultId}.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error retrieving selected options with id " +
              req.params.userResultId,
          });
        }
      } else res.send(data);
    }
  );
};

exports.getStatus = (req, res) => {
  UserResultDetail.getStatus(
    req.params.userResultId,
    req.params.questionId,
    (err, data) => {
      console.log("response :" + res.status);
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found status with id ${req.params.userResultId}.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error retrieving status with id " +
              req.params.userResultId,
          });
        }
      } else res.send(data);
    }
  );
};

// Update a UserResultDetail identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const userDetails = new UserResultDetail(req.body);

  UserResultDetail.updateById( userDetails, (err, data) => {
    // console.log("req.body " + JSON.stringify(req.body));
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserResultDetail `,
        });
      } else {
        res.status(500).send({
          message: "Error updating UserResultDetail  ",
        });
      }
    } else res.send(data);
  });
};

// Delete a UserResultDetail with the specified id in the request
exports.delete = (req, res) => {
  UserResultDetail.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserResultDetail with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete UserResultDetail with id " + req.params.id,
        });
      }
    } else res.send({ message: `UserResultDetail was deleted successfully!` });
  });
};

// Delete all UserResultDetails from the database.
exports.deleteAll = (req, res) => {
  UserResultDetail.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all userresultdetails.",
      });
    else
      res.send({ message: `All UserResultDetails were deleted successfully!` });
  });
};