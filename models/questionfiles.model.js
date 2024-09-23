const connection = require("../config/mysql.db.config");

// constructor
const QuestionFiles = function (questionFiles) {
  // this.id = QuestionFiles.id;
  this.file_name = questionFiles.file_name;
  this.file_path = questionFiles.file_path;
  this.user_id = questionFiles.user_id;
  this.status = questionFiles.status;
  this.created_by = questionFiles.created_by;
  // this.created_date = QuestionFiles.created_date;
  this.modified_by = questionFiles.modified_by;
  // this.modified_date = QuestionFiles.modified_date;
};

// QuestionFiles.create = (newQuestionFiles, result) => {
//   const query = " INSERT INTO users_preferences (user_id, category_id, created_by, created_date, modified_by, modified_date) VALUES ?";
//   connection.query(query, [newQuestionFiles], (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     console.log("created QuestionFiles: ", { id: res.insertId, ...newQuestionFiles });
//     result(null, { id: res.insertId, ...newQuestionFiles });
//   });
// };

QuestionFiles.create = (newQuestionFiles, createdDate, result) => {
  const query =
    "INSERT INTO question_files (file_name,file_path,user_id,status,created_by,created_date,modified_by,modified_date) values (? , ? , ?, ? , ?, ?, ?, ?); ";
  connection.query(
    query,
    [newQuestionFiles.file_name, newQuestionFiles.file_path,newQuestionFiles.user_id,newQuestionFiles.status,newQuestionFiles.user_id, createdDate,newQuestionFiles.user_id,createdDate],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }

      console.log("created entry in QuestionFiles: ", {
        id: res.insertId,
        ...newQuestionFiles,
      });
      result(null, { id: res.insertId, ...newQuestionFiles });
    }
  );
};

QuestionFiles.insertyQuestions = async (user_id, result) => {
    connection.query(
      `select * from followers_list where follower_id = ${user_id}`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
  
        if (res.length) {
          console.log("found user: ", res);
          result(null, res);
          return;
        }
  
        // not found user with the id
        result({ kind: "not_found" }, null);
      }
    );
  };

QuestionFiles.getCategoriesByUserId = async (user_id, result) => {
  connection.query(
    `select category_id from users_preferences where user_id = ${user_id}`,
    (err, res) => {
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
    }
  );
};

QuestionFiles.findById = async (user_id, result) => {
  connection.query(
    `select * from followers_list where follower_id = ${user_id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found user: ", res);
        result(null, res);
        return;
      }

      // not found user with the id
      result({ kind: "not_found" }, null);
    }
  );
};

QuestionFiles.remove = (instructor_id, follower_id, result) => {
  connection.query(
    `DELETE FROM followers_list WHERE instructor_id= ${instructor_id} and follower_id = ${follower_id};`,

    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionFiles with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted QuestionFiles ");
      result(null, res);
    }
  );
};

QuestionFiles.removeAll = (result) => {
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

module.exports = QuestionFiles;
