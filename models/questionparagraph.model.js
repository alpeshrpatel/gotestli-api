const connection = require("../config/mysql.db.config");

const QuestionParagraph = function(questionParagraph){
    // this.id = questionParagraph.id;
    this.paragraph = questionParagraph.paragraph;
    // this.created_by = questionParagraph.created_by;
    // this.created_date = questionParagraph.created_date;
    // this.modified_by = questionParagraph.modified_by;
    // this.modified_date = questionParagraph.modified_date;
    }


QuestionParagraph.create = (newQuestionParagraph, result) => {
  const query =
    `INSERT INTO question_paragraph (paragraph, created_by, modified_by) VALUES (?,?,?); `;
  connection.query(
    query,
    [newQuestionParagraph.paragraph,newQuestionParagraph.userId,newQuestionParagraph.userId],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

       // console.log("created QuestionParagraph: ", {
      //   id: res.insertId,
      //   ...newQuestionParagraph,
      // });
      result(null, { id: res.insertId });
    }
  );
};

QuestionParagraph.remove = (id, result) => {
  connection.execute(
    "DELETE FROM question_paragraph WHERE id = ?",
    id,
    (err, res) => {
      if (err) {
         
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Options with the id
        result({ kind: "not_found" }, null);
        return;
      }

       // console.log("deleted Options with id: ", id);
      result(null, res);
    }
  );
};

QuestionParagraph.updateById = (id, paragraph, result) => {
  connection.execute(
    "UPDATE question_paragraph SET " +
      "org_id = ?, question = ?, description = ?, explanation = ?, " +
      "paragraph_id = ?, question_type_id = ?, status_id = ?, complexity = ?, " +
      "marks = ?, is_negative = ?, negative_marks = ? " +
      "WHERE id = ?",
    [
      questionmaster.org_id,
      questionmaster.question,
      questionmaster.description,
      questionmaster.explanation,
      questionmaster.paragraph_id,
      questionmaster.question_type_id,
      questionmaster.status_id,
      questionmaster.complexity,
      questionmaster.marks,
      questionmaster.is_negative,
      questionmaster.negative_marks,
      id, 
    ],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionMaster with the id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated questionmaster: ", { id: id, ...questionmaster });
      result(null, { id: id, ...questionmaster });
    }
  );
};




module.exports = QuestionParagraph;
