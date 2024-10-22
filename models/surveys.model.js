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


Surveys.getRating = async (id, result) => {
  const query = `SELECT 
  -- Calculate overall average rating across the three parameters
  (difficulty_rating + content_quality_rating + satisfaction_rating) / 3 AS rating
FROM (
  SELECT
    -- Calculate weighted average rating for difficulty using the correct formula
    (
      (5 * SUM(CASE WHEN difficulty = 5 THEN 1 ELSE 0 END) +
       4 * SUM(CASE WHEN difficulty = 4 THEN 1 ELSE 0 END) +
       3 * SUM(CASE WHEN difficulty = 3 THEN 1 ELSE 0 END) +
       2 * SUM(CASE WHEN difficulty = 2 THEN 1 ELSE 0 END) +
       1 * SUM(CASE WHEN difficulty = 1 THEN 1 ELSE 0 END)
      ) / 
      (SUM(CASE WHEN difficulty = 5 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN difficulty = 4 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN difficulty = 3 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN difficulty = 2 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN difficulty = 1 THEN 1 ELSE 0 END))
    ) AS difficulty_rating,

    -- Calculate weighted average rating for content_quality using the correct formula
    (
      (5 * SUM(CASE WHEN content_quality = 5 THEN 1 ELSE 0 END) +
       4 * SUM(CASE WHEN content_quality = 4 THEN 1 ELSE 0 END) +
       3 * SUM(CASE WHEN content_quality = 3 THEN 1 ELSE 0 END) +
       2 * SUM(CASE WHEN content_quality = 2 THEN 1 ELSE 0 END) +
       1 * SUM(CASE WHEN content_quality = 1 THEN 1 ELSE 0 END)
      ) / 
      (SUM(CASE WHEN content_quality = 5 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN content_quality = 4 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN content_quality = 3 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN content_quality = 2 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN content_quality = 1 THEN 1 ELSE 0 END))
    ) AS content_quality_rating,

    -- Calculate weighted average rating for satisfaction using the correct formula
    (
      (5 * SUM(CASE WHEN satisfaction = 5 THEN 1 ELSE 0 END) +
       4 * SUM(CASE WHEN satisfaction = 4 THEN 1 ELSE 0 END) +
       3 * SUM(CASE WHEN satisfaction = 3 THEN 1 ELSE 0 END) +
       2 * SUM(CASE WHEN satisfaction = 2 THEN 1 ELSE 0 END) +
       1 * SUM(CASE WHEN satisfaction = 1 THEN 1 ELSE 0 END)
      ) / 
      (SUM(CASE WHEN satisfaction = 5 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN satisfaction = 4 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN satisfaction = 3 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN satisfaction = 2 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN satisfaction = 1 THEN 1 ELSE 0 END))
    ) AS satisfaction_rating
  FROM surveys
  WHERE questionset_id = ${id}
) AS ratings;`
  connection.query(
    query,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found rating: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found user with the id
      result({ kind: "not_found" }, null);
    }
  );
};

module.exports = Surveys;
