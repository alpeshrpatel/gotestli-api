const connection = require("../config/mysql.db.config");
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


UserResultDetails.create = (newUserResultDetails, result) => {

  const query = "INSERT INTO user_test_result_dtl(user_test_result_id,question_set_question_id, question_type,answer,created_by, modified_by,status) values  ?";
  connection.query(query, [newUserResultDetails], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created userresultdetails: ", { id: res.insertId, ...newUserResultDetails });
    result(null, { id: res.insertId, ...newUserResultDetails });
  });
};


UserResultDetails.addAllQuestionForQuestionSet = (listUserResultDetails, result) => {
  console.log("listuserresult:"+listUserResultDetails)
  const query =  "INSERT INTO user_test_result_dtl " +
  "(user_test_result_id, question_set_question_id, question_type, answer, correct_answer, created_by, created_date, modified_by, modified_date, status) " +
  "VALUES ?";
  connection.query(query, [listUserResultDetails], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created userresultdetails: ", { id: res.insertId, ...listUserResultDetails });
    result(null, { id: res.insertId, ...listUserResultDetails });
  });
};


UserResultDetails.addQuestionsOnStartQuiz = (userId, questionSetId,
  userResultId, createdDate, result) => {

  console.log("questionSetId --> " + questionSetId);

  console.log("userResultId --> " + userResultId);
  connection.query(`
        INSERT INTO user_test_result_dtl (
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
              utr.id  as user_test_result_id ,   
              qm.id as question_set_question_id,
              qm.question_type_id as question_type , 
              qo.question_option as correct_answer,
              ${userId} as created_by,
              CURRENT_TIMESTAMP()  as created_date ,
              ${userId} as modified_by,
              CURRENT_TIMESTAMP()  as modified_date ,
              1 as status 
            from 
              question_master qm ,  
              question_set qs , 
              user_test_result utr , 
              question_options qo ,
              question_set_questions qsq 
            where 
              qm.id = qo.question_id 
              and qo.is_correct_answer =1 
              and qs.id = utr.question_set_id 
              and qs.id = qsq.question_set_id 
              and qsq.question_id = qm.id
              and qs.id = ${questionSetId}
              and utr.id = ${userResultId}  `, 
     (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created userresultdetails: ", { id: res.insertId });
    result(null, { id: res.insertId });
  });
};


UserResultDetails.findById = (id, result) => {
  connection.query(
    `SELECT * FROM user_test_result_dtl WHERE id = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found UserResultDetails: ", res);
        result(null, res);
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResultDetails.findUserResultDetailsByUserResultId = (
  userresultid,
  result
) => {
  connection.query(
    `SELECT * FROM user_test_result_dtl WHERE user_test_result_id = ${userresultid}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found UserResultDetails: ", res);
        result(null, res);
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResultDetails.getUserResultAnswers = (
  userResultId, questionSetLength,
  result
) => {
  connection.query(
    ` SELECT question_set_question_id, answer, status FROM user_test_result_dtl WHERE user_test_result_id = ${userResultId}  ORDER BY id DESC LIMIT ${questionSetLength}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found selected options: ", res);
        result(null, res);
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResultDetails.getStatus = (
  userResultId, questionId,
  result
) => {
  connection.query(
    ` SELECT status FROM user_test_result_dtl WHERE user_test_result_id = ${userResultId}  AND question_set_question_id = ${questionId} ORDER BY id DESC LIMIT 1`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found status: ", res);
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
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("user_test_result_dtl: ", res);
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
  SET answer = ?, status = ?, modified_date = ?
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
  const modifiedDate = new Date().toISOString().replace("T", " ").substring(0, 19)
  connection.query(
    query,
    [
      userresultdetails.answer,
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
      // console.log(JSON.stringify(res))
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      console.log(res.affectedRows);

      if (res.affectedRows == 0) {
        // not found UserResultDetails with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated userresultdetails: ", {
        
        ...userresultdetails,
      });
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
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found UserResultDetails with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted userresultdetails with id: ", id);
      result(null, res);
    }
  );
};

UserResultDetails.removeAll = (result) => {
  connection.query("DELETE FROM user_test_result_dtl", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} user_test_result_dtl`);
    result(null, res);
  });
};

module.exports = UserResultDetails;