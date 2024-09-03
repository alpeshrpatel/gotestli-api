const connection = require("../config/mysql.db.config");

// constructor
const QuestionSetQuestion = function(questionSetQuestion){
    // this.id = QuestionSetQuestion.id;
    this.question_set_id = questionSetQuestion.question_set_id;
    this.question_id = questionSetQuestion.question_id;
    // this.created_by = QuestionSetQuestion.created_by;
    // this.created_date = QuestionSetQuestion.created_date;
    // this.modified_by = QuestionSetQuestion.modified_by;
    // this.modified_date = QuestionSetQuestion.modified_date;
    }

    QuestionSetQuestion.findById = (result) => {
      connection.query(`SELECT id FROM question_set ORDER BY id DESC LIMIT 1`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    
        if (res.length) {
          console.log("found questionsetId: ", res[0]);
          result(null, res[0]);
          return;
        }
    
        // not found QuestionSet with the id
        result({ kind: "not_found" }, null);
      });
    };

QuestionSetQuestion.create = (newQuestionSetQuestion, result) => {
    console.log(newQuestionSetQuestion)
    const query = " INSERT INTO question_set_questions (question_set_id, question_id, created_by, created_date, modified_by, modified_date) VALUES ?";
  connection.query(query, [newQuestionSetQuestion], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created QuestionSetQuestion: ", { ...newQuestionSetQuestion });
    result(null, { ...newQuestionSetQuestion });
  });
};




QuestionSetQuestion.remove = (id, result) => {
  connection.query("DELETE FROM question_set_questions WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found QuestionSetQuestion with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted QuestionSetQuestion with id: ", id);
    result(null, res);
  });
};

QuestionSetQuestion.removeAll = result => {
  connection.query("DELETE FROM question_set_questions", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} question_set`);
    result(null, res);
  });
};

module.exports = QuestionSetQuestion;
