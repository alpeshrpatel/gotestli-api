const connection = require("../config/mysql.db.config");
const separator = require("../constants");
const queries = require("../queries");
const util = require("../utils/util");
// constructor
const UserResultDetails = function (userresultdetails) {
  this.id = userresultdetails.id;
  this.user_test_result_id = userresultdetails.user_test_result_id;
  this.question_set_question_id = userresultdetails.question_set_question_id;
  this.question_type = userresultdetails.question_type;
  this.answer = userresultdetails.answer;
  this.correct_answer = userresultdetails.correct_answer;
  this.status = userresultdetails.status;
  this.created_by = userresultdetails.created_by;
  this.created_date = userresultdetails.created_date;
  this.modified_by = userresultdetails.modified_by;
  this.modified_date = userresultdetails.modified_date;
};

UserResultDetails.getAnswers = (questionId, result) => {
  connection.query(
    "SELECT question_option AS correctAnswer FROM question_options WHERE is_correct_answer = 1 AND question_id = ?",
    [questionId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return result(err, null);
      }
      result(null, rows);
    }
  );
};

// UserResultDetails.create = (newUserResultDetails, result) => {

//   const query = "INSERT INTO user_test_result_dtl(user_test_result_id,question_set_question_id, question_type,answer,created_by, modified_by,status) values  ?";
//   connection.query(query, [newUserResultDetails], (err, res) => {
//     if (err) {
//        
//       result(err, null);
//       return;
//     }

//      // console.log("created userresultdetails: ", { id: res.insertId, ...newUserResultDetails });
//     result(null, { id: res.insertId, ...newUserResultDetails });
//   });
// };

UserResultDetails.create = (newUserResultDetails, result) => {
  // Ensure `newUserResultDetails` has the properties in the same order as the columns in the table
  const query = `
    INSERT INTO user_test_result_dtl
      (user_test_result_id, question_set_question_id, correct_answer, created_by, modified_by, status)
    VALUES
      (?, ?, ?, ?, ?, ?);
  `;

  // Assuming newUserResultDetails is an object with the appropriate keys
  const values = [
    newUserResultDetails.user_test_result_id,
    newUserResultDetails.question_set_question_id,
    // newUserResultDetails.question_type,
    newUserResultDetails.correct_answer,
    newUserResultDetails.created_by,
    newUserResultDetails.modified_by,
    newUserResultDetails.status,
  ];

  connection.query(query, values, (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

     // console.log("created userresultdetails: ", {
    //   id: res.insertId,
    //   ...newUserResultDetails,
    // });
    result(null, { id: res.insertId, ...newUserResultDetails });
  });
};

UserResultDetails.addAllQuestionForQuestionSet = (
  listUserResultDetails,
  result
) => {
   // console.log("listuserresult:" + listUserResultDetails);
  const query =
    "INSERT INTO user_test_result_dtl " +
    "(user_test_result_id, question_set_question_id, question_type, answer, correct_answer, created_by, created_date, modified_by, modified_date, status) " +
    "VALUES ?";
  connection.query(query, [listUserResultDetails], (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

     // console.log("created userresultdetails: ", {
    //   id: res.insertId,
    //   ...listUserResultDetails,
    // });
    result(null, { id: res.insertId, ...listUserResultDetails });
  });
};

UserResultDetails.addQuestionsOnStartQuiz = (
  orgid,
  userId,
  questionSetId,
  userResultId,
  createdDate,
  result
) => {
   // console.log("questionSetId --> " + questionSetId);

   // console.log("userResultId --> " + userResultId);
  connection.query(
    `
        INSERT INTO user_test_result_dtl (
        org_id,
        user_test_result_id,
        question_set_question_id,
        question_type,
        correct_answer,
        created_by,
        created_date,
        modified_by,
        modified_date,
        status
    ) 
    SELECT
        qs.org_id as org_id,  
        utr.id as user_test_result_id,   
        qm.id as question_set_question_id,
        qm.question_type_id as question_type, 
        GROUP_CONCAT(qo.question_option ORDER BY qo.id SEPARATOR '${separator}') as correct_answer,
        ${userId} as created_by,
        CURRENT_TIMESTAMP() as created_date,
        ${userId} as modified_by,
        CURRENT_TIMESTAMP() as modified_date,
        0 as status
    FROM 
        question_master qm 
        JOIN question_options qo ON qm.id = qo.question_id AND qo.is_correct_answer = 1
        JOIN question_set_questions qsq ON qsq.question_id = qm.id
        JOIN question_set qs ON qs.id = qsq.question_set_id
        JOIN user_test_result utr ON utr.question_set_id = qs.id
    WHERE 
        qs.id = ${questionSetId}
        AND utr.id = ${userResultId}
    GROUP BY qm.id; `,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

       // console.log("created userresultdetails: ", { id: res.insertId });
      result(null, { id: res.insertId });
    }
  );
};

UserResultDetails.findById = (id,orgid, result) => {
  connection.query(
    `SELECT * FROM user_test_result_dtl WHERE id = ${id} AND org_id = ${orgid}`,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
         // console.log("found UserResultDetails: ", res);
        result(null, res);
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResultDetails.findUserResultDetailsByUserResultId = (
  userresultid,orgid,
  result
) => {
  connection.query(
    `SELECT * FROM user_test_result_dtl WHERE user_test_result_id = ${userresultid} AND org_id = ${orgid} order by question_set_question_id asc`,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
         // console.log("found UserResultDetails: ", res);
        result(null, res);
        // const encryptedData = encrypt(JSON.stringify(res));

        // // Return encrypted data
        // result(null, { encryptedPayload: encryptedData });
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResultDetails.getUserResultAnswers = (
  userResultId,
  questionSetLength,orgid,
  result
) => {
  connection.query(
    ` SELECT question_set_question_id, answer, status FROM user_test_result_dtl WHERE user_test_result_id = ${userResultId} AND org_id = ${orgid}  ORDER BY id DESC LIMIT ${questionSetLength}`,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
         // console.log("found selected options: ", res);
        result(null, res);
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResultDetails.getStatus = (userResultId, questionId,orgid, result) => {
  connection.query(
    ` SELECT status FROM user_test_result_dtl WHERE user_test_result_id = ${userResultId}  AND question_set_question_id = ${questionId} AND org_id = ${orgid} ORDER BY id DESC LIMIT 1`,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
         // console.log("found status: ", res);
        result(null, res);
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResultDetails.getAll = (title, result) => {
  let query = "SELECT * FROM user_test_result_dtl";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  connection.query(query, (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

     // console.log("user_test_result_dtl: ", res);
    result(null, res);
  });
};
// userResultId, questionId, findSelectedOption, status
UserResultDetails.updateById = (userresultdetails, result) => {
   // console.log("userresultdetails : " + JSON.stringify(userresultdetails));
  // const updatestmt =
  //   "UPDATE user_test_result_dtl SET " +
  //   "user_test_result_id= ?, " +
  //   "question_set_question_id= ? ," +
  //   // "question_type= ? , " +
  //   "answer= ? ," +
  //   // "correct_answer= ? , " +
  //   "status= ? ," +
  //   // "modified_by= ? ," +
  //   // "modified_date='" +
  //   // new Date().toISOString().replace("T", " ").substring(0, 19) +
  //   "' " +
  //   " WHERE id = ?";
  const query = `UPDATE user_test_result_dtl 
  SET answer = ?, modified_by = ?, status = ?, modified_date = ?
  WHERE id = (
      SELECT id 
      FROM (
          SELECT id 
          FROM user_test_result_dtl 
          WHERE user_test_result_id = ? AND question_set_question_id = ? 
          ORDER BY id DESC 
          LIMIT 1
      ) AS temp
  )`;
  const modifiedDate = new Date()
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);
  connection.query(
    query,
    [
      userresultdetails.answer,
      userresultdetails.modified_by,
      userresultdetails.status,
      modifiedDate,
      userresultdetails.user_test_result_id,
      userresultdetails.question_set_question_id,
      // userresultdetails.question_type,
      // userresultdetails.correct_answer,
      // userresultdetails.modified_by,
      //id,
    ],
    (err, res) => {
      //  // console.log(JSON.stringify(res))
      if (err) {
         
        result(null, err);
        return;
      }
       // console.log(res.affectedRows);

      if (res.affectedRows == 0) {
        // not found UserResultDetails with the id
        result({ kind: "not_found" }, null);
        return;
      }

       // console.log("updated userresultdetails: ", {
      //   ...userresultdetails,
      // });
      result(null, { ...userresultdetails });
    }
  );
};

UserResultDetails.remove = (id, result) => {
  connection.query(
    "DELETE FROM user_test_result_dtl WHERE id = ?",
    id,
    (err, res) => {
      if (err) {
         
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found UserResultDetails with the id
        result({ kind: "not_found" }, null);
        return;
      }

       // console.log("deleted userresultdetails with id: ", id);
      result(null, res);
    }
  );
};

UserResultDetails.removeAll = (result) => {
  connection.query("DELETE FROM user_test_result_dtl", (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

     // console.log(`deleted ${res.affectedRows} user_test_result_dtl`);
    result(null, res);
  });
};

module.exports = UserResultDetails;
