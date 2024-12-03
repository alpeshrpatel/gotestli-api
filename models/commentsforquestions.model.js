const connection = require("../config/mysql.db.config");

// constructor
const CommentsForQuestions = function (commentsForQuestions) {
  this.question_id = commentsForQuestions.question_id;
  this.user_id = commentsForQuestions.user_id;
  this.comment = commentsForQuestions.comment;
};

CommentsForQuestions.create = (newCommentsForQuestions, result) => {
  const query =
    "INSERT INTO comments_for_questions (question_id,user_id,comment,created_by,modified_by) values (?,?,?,?,?); ";
  connection.query(
    query,
    [newCommentsForQuestions.question_id,newCommentsForQuestions.user_id,newCommentsForQuestions.comment,newCommentsForQuestions.user_id,newCommentsForQuestions.user_id],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

       // console.log("created CommentsForQuestions: ", {
      //   id: res.insertId,
      //   ...newCommentsForQuestions,
      // });
      result(null, { id: res.insertId, ...newCommentsForQuestions });
    }
  );
};


module.exports = CommentsForQuestions;