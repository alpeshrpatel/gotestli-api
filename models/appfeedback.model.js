const connection = require("../config/mysql.db.config");

// constructor
const AppFeedback = function (appFeedback) {
  // this.id = appFeedback.id;
  this.emoji_rating = appFeedback.emoji_rating;
  this.visit_purpose = appFeedback.visit_purpose;
  this.feedback = appFeedback.feedback;
  this.created_by = appFeedback.created_by;
  // this.created_date = appFeedback.created_date;
  this.modified_by = appFeedback.modified_by;
  // this.modified_date = appFeedback.modified_date;
};

AppFeedback.create = (feedback, result) => {
  const query = `INSERT INTO app_feedback (emoji_rating, visit_purpose, feedback, created_by, modified_by) VALUES (?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [
      feedback.emoji_rating,
      feedback.visit_purpose,
      feedback.feedback,
      feedback.userId,
      feedback.userId,
    ],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { id: res.insertId });
    }
  );
};

module.exports = AppFeedback;
