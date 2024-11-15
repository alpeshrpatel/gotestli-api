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
    [
      newQuestionFiles.file_name,
      newQuestionFiles.file_path,
      newQuestionFiles.user_id,
      newQuestionFiles.status,
      newQuestionFiles.user_id,
      createdDate,
      newQuestionFiles.user_id,
      createdDate,
      0,
      0,
    ],
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

QuestionFiles.insertQuestions = async (
  fileId,
  errorRows,
  dataSet,
  userId,
  date,
  result
) => {
  let size = Object.keys(dataSet).length;
  for (let i = 7; i < 7 + size; i++) {
    if (!errorRows.includes(i)) {
      console.log("dataset: ", dataSet[i]);
      const data = dataSet[i];
      const question_type = data[3].includes(':') ? 7 : 2
      const query = `INSERT INTO question_master (org_id, question, description, question_type_id, status_id, complexity,marks, is_negative, negative_marks, created_by, created_date, modified_by, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        0,
        data[0],
        data[1],
        2,
        1,
        data[4],
        data[5],
        data[6],
        data[7],
        userId,
        date,
        userId,
        date,
      ];
      try {
        connection.query(query, values, async (err, res) => {
          if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
          }
          console.log("insert id:", res.insertId);
          const optionInsertResult = await insertQuestionOptions(
            res.insertId,
            data,
            userId,
            date
          );

          if (optionInsertResult) {
            console.log(
              `Question and options inserted with ID: ${res.insertId}`
            );
          }
        });
      } catch (error) {
        console.log("Error inserting question:", error);
        result(error, null);
        return;
      }
    }
  }

  const globalArray = Array.from({ length: size }, (_, index) => index + 1);
  const erroredArray = errorRows.map((row) => row-6);
  const correctedArray = globalArray.filter((num) => !erroredArray.includes(num));
  const correct = correctedArray.join(',');
  const errored = erroredArray.join(",");
  // update file data in question_files
  const res =  await updateFilesData(fileId,correct,errored,date)
    if(res){
      console.log('updated successfully!');
    }else{
      console.log('some error')
    }
  if (errorRows.length > 0) {
    result(null, { message: "Questions of this Rows are not inserted: ", errored });
  } else {
    result(null, {
      message: "All questions and options inserted successfully",
    });
  }
};

const updateFilesData = async (fileId,correct,errored,date) => {
  const query = `UPDATE question_files SET status = 1, modified_date = ?, correct_rows = ?, error_rows = ? WHERE id = ?`;
    connection.query(query, [date, correct, errored, fileId], (err, res) => {
      if (err) {
        console.error("Error updating files:", err);
        return false;
      }
     return true;
    });
}

const insertQuestionOptions = async (questionId, data, userId, date) => {
  const query = `
    INSERT INTO question_options (question_id, question_option, is_correct_answer, created_by, created_date, modified_by, modified_date) 
    VALUES ?`;
  const question_options = data[2].split(":");
  console.log("data3", data[3]);
  const correct_answer = question_options.map((option) => {
    if (typeof data[3] === "string" && data[3].includes(':')) {
      return data[3].toLowerCase().includes(option.toLowerCase()) ? 1 : 0;
    } else {
      return typeof data[3] === "string"
        ? data[3].toLowerCase() === option.toLowerCase()
          ? 1
          : 0
        : data[3] === option
        ? 1
        : 0;
    }
  });
  const options = [
    [
      questionId,
      question_options[0],
      correct_answer[0],
      userId,
      date,
      userId,
      date,
    ], // Option 1
    [
      questionId,
      question_options[1],
      correct_answer[1],
      userId,
      date,
      userId,
      date,
    ], // Option 2
    [
      questionId,
      question_options[2],
      correct_answer[2],
      userId,
      date,
      userId,
      date,
    ], // Option 3
    [
      questionId,
      question_options[3],
      correct_answer[3],
      userId,
      date,
      userId,
      date,
    ], // Option 4
  ];

  try {
    // Insert options for each question
    connection.query(query, [options]);
    return true;
  } catch (error) {
    console.error("Error inserting options:", error);
    return false;
  }
};

QuestionFiles.findById = async (user_id, result) => {
  connection.query(
    `select * from question_files where user_id = ${user_id}`,
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

QuestionFiles.findByFileName = async (filename, result) => {
  connection.query(
    `select * from question_files where file_name = '${filename}'`,
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
// QuestionFiles.remove = (instructor_id, follower_id, result) => {
//   connection.query(
//     `DELETE FROM followers_list WHERE instructor_id= ${instructor_id} and follower_id = ${follower_id};`,

//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found QuestionFiles with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("deleted QuestionFiles ");
//       result(null, res);
//     }
//   );
// };

QuestionFiles.removeAll = (result) => {
  connection.query("DELETE FROM question_files", (err, res) => {
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
