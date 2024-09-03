const connection = require("../config/mysql.db.config");

// constructor
const QuestionSetCategory = function(questionSetCategory){
    // this.id = questionSetCategory.id;
    this.question_set_id = questionSetCategory.question_set_id;
    this.category_id = questionSetCategory.category_id;
    // this.created_by = questionSetCategory.created_by;
    // this.created_date = questionSetCategory.created_date;
    // this.modified_by = questionSetCategory.modified_by;
    // this.modified_date = questionSetCategory.modified_date;
    }

QuestionSetCategory.create = (newQuestionSetCategory, result) => {
  connection.query("INSERT INTO question_set_categories SET ?", newQuestionSetCategory, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created QuestionSetCategory: ", { id: res.insertId, ...newQuestionSetCategory });
    result(null, { id: res.insertId, ...newQuestionSetCategory });
  });
};

QuestionSetCategory.getCategoriesByQuestionSetId = async (question_set_id, result) => {
    connection.execute(`select category_id from question_set_categories where question_set_id = ${question_set_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found categories: ", res);
        result(null, res);
        return;
      }
  
      // not found QuestionSet with the id
      result({ kind: "not_found" }, null);
    });
   
  };


QuestionSetCategory.remove = (id, result) => {
  connection.query("DELETE FROM question_set_categories WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found QuestionSetCategory with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted QuestionSetCategory with id: ", id);
    result(null, res);
  });
};

QuestionSetCategory.removeAll = result => {
  connection.query("DELETE FROM question_set_categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} question_set`);
    result(null, res);
  });
};

module.exports = QuestionSetCategory;
