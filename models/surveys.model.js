const connection = require("../config/mysql.db.config");
const { logger } = require("../logger");

// constructor
const Surveys = function (Surveys) {
  this.questionset_id = Surveys.questionset_id;
  this.satisfaction = Surveys.satisfaction;
  this.difficulty = Surveys.difficulty;
  this.content_quality = Surveys.content_quality;
  this.review = Surveys.review;
  this.created_by = Surveys.created_by;
  this.modified_by = Surveys.modified_by;
};

Surveys.create = (newSurveys, result) => {
  connection.query("INSERT INTO surveys SET ?", newSurveys, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Surveys: ", {
      id: res.insertId,
      ...newSurveys,
    });
    result(null, { id: res.insertId, ...newSurveys });
  });
};

module.exports = Surveys;
