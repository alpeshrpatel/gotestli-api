const connection = require("../config/mysql.db.config");
const separator = require("../constants");

const util = require("../utils/util");

// constructor
const UserResult = function (userresult) {
  this.id = userresult.id;
  this.org_id = userresult.org_id;
  this.user_id = userresult.user_id;
  this.question_set_id = userresult.question_set_id;
  this.total_question = userresult.total_question;
  this.total_answered = userresult.total_answered;
  this.total_not_answered = userresult.total_not_answered;
  this.total_reviewed = userresult.total_reviewed;
  this.total_not_visited = userresult.total_not_visited;
  this.percentage = userresult.percentage;
  this.marks_obtained = userresult.marks_obtained;
  this.date = userresult.date;
  this.flag = userresult.flag;
  this.status = userresult.status;
  this, (marks = userresult.masks);
  this.created_by = userresult.created_by;
  // this.created_date = userresult.created_date;
  this.modified_by = userresult.modified_by;
  // this.modified_date = userresult.modified_date;
};

/**
 *
 * @param {*} questionSetId
 * @returns
 */
function getPassCriteria(questionSetId) {
  const [rows] = connection.execute(
    "select totalmarks, pass_percentage from question_set where id = ? ",
    [questionSetId]
  );
  return rows;
}

/**
 *
 * @param {*} userResultId
 * @returns
 */
UserResult.getAnswers = (userResultId) => {
  try {
    const [rows] = connection.execute(
      "select answer, correct_answer from user_test_result_dtl where user_test_result_id = ?",
      [userResultId]
    );
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 *
 * @param {*} userResultId
 * @param {*} questionSetId
 * @param {*} totalQuestions
 * @param {*} totalAnswered
 * @param {*} skippedQuestion
 * @param {*} totalReviewed
 * @param {*} marks
 * @param {*} percentage
 */

function updateTestResult(
  userResultId,
  questionSetId,
  totalQuestions,
  totalAnswered,
  skippedQuestion,
  totalReviewed,
  marks,
  percentage
) {
  const modifiedDate = new Date()
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  const query = `UPDATE user_test_result SET 
                    total_answered = ? , total_not_answered = ?, 
                    total_reviewed = ? , total_not_visited = 0 , 
                    percentage = ?, marks_obtained = ?, 
                    modified_date = ?, status = 1 
                  WHERE id = ?`;

  const [results] = connection.query(query, [
    totalAnswered,
    skippedQuestion,
    totalReviewed,
    percentage,
    marks,
    modifiedDate,
    userResultId,
  ]);

  res.json({
    msg: "Selected option inserted successfully",
    success: true,
  });
}

/**
 *
 * @param {*} userResultId
 * @param {*} questionSetId
 * @param {*} totalQuestions
 * @param {*} totalAnswered
 * @param {*} skippedQuestion
 * @param {*} totalReviewed
 * @param {*} marks
 * @param {*} percentage
 */

//
UserResult.updateUserResult = (userresult, result) => {
  const modifiedDate = new Date()
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  const query = `UPDATE user_test_result SET 
                    total_answered = ? , total_not_answered = ?, 
                    total_reviewed = ? , total_not_visited = 0 , 
                    percentage = ?, marks_obtained = ?, 
                    modified_date = ?, status = ?
                  WHERE id = ?`;
  connection.query(
    query,
    [
      userresult.total_answered,
      userresult.total_not_answered,
      userresult.total_reviewed,
      userresult.percentage,
      userresult.marksObtained,
      modifiedDate,
      userresult.status,
      userresult.id,
    ],
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

      //  // console.log("updated userresult: ", { id: id, ...userresult });
      result(null, { id: userresult.id, ...userresult });
    }
  );
};

/**
 *
 * @param {*} userResult
 * @param {*} result
 */
UserResult.calculateResult = (userResult, result) => {
  //  // console.log("userResult --> "  + JSON.stringify(userResult));
  let passingStatus;
  let percentage;
  let marks;
  let count = 0;

  connection.query(
    `select   qs.totalmarks, qs.pass_percentage, utrd.answer, utrd.correct_answer, utr.total_question, utr.total_answered, 
                      utr.total_not_answered, utr.total_reviewed, utr.total_not_visited , utr.percentage , qm.marks, qm.negative_marks, qm.is_negative
                      from question_set qs , user_test_result utr , user_test_result_dtl utrd , question_master qm 
                      where qs.id = utr.question_set_id  
                      and utr.id = utrd.user_test_result_id
                      and qm.id = utrd.question_set_question_id 
                      and utr.id = ${userResult.id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        let totalMarks = 0;
        let achievedMarks = 0;
        let passPercentage = res[0].pass_percentage;
        let correct = 0;

        function areAnswersEqual(correctAnswer, userAnswer) {
          if (
            correctAnswer?.includes(separator) &&
            userAnswer?.includes(separator)
          ) {
            const correctAnswerArray = correctAnswer.split(separator);
            const userAnswerArray = userAnswer.split(separator);

            correctAnswerArray.sort();
            userAnswerArray.sort();

            return (
              JSON.stringify(correctAnswerArray) ===
              JSON.stringify(userAnswerArray)
            );
          } else {
            return correctAnswer === userAnswer;
          }
        }

        res.forEach((record) => {
          //  // console.log(record.marks + " : "+record.answer + " : " + record.correct_answer);
          totalMarks += record.marks;
          if (areAnswersEqual(record.correct_answer, record.answer)) {
            achievedMarks += record.marks;
            correct = correct + 1;
          }else if(record.is_negative && record.answer !== null && record.answer !== undefined && record.answer !== '') {
            achievedMarks -= record.negative_marks;
          }
        }, 0);

        percentage = Math.round((100 * achievedMarks) / totalMarks);
        // console.log("achievedMarks : " + achievedMarks);
        // console.log("passPercentage : " + passPercentage);

        // console.log("totalMarks : " + totalMarks);
        // console.log("percentage : " + percentage);

        if (percentage < passPercentage) {
          passingStatus = "Fail";
        } else {
          passingStatus = "Pass";
        }
        // console.log(passingStatus);
        // console.log("userResult : " + JSON.stringify(userResult));

        userResult.marksObtained = achievedMarks;
        userResult.percentage = percentage;
        userResult.status = 1;
        userResult.passingStatus = passingStatus;

        //  // console.log(userResult);

        let userresult = userResult;

        // updateUserResult(userResult);

        //  // console.log("updated userresult: ", { ...userResult });
        // result(null, { ...userResult });
        const modifiedDate = new Date()
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);

        const query = `UPDATE user_test_result SET 
                      total_answered = ? , total_not_answered = ?, 
                      total_reviewed = ? , total_not_visited = 0 , 
                      percentage = ?, marks_obtained = ?, modified_by = ?,
                      modified_date = ?, status = ?
                    WHERE id = ?`;
        connection.query(
          query,
          [
            userresult.total_answered,
            userresult.total_not_answered,
            userresult.total_reviewed,
            userresult.percentage,
            userresult.marksObtained,
            userResult.modified_by,
            modifiedDate,
            userresult.status,
            userresult.id,
          ],
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

            //  // console.log("updated userresult: ", {
            //   id: userResult.id,
            //   correct: correct,
            //   wrong: userResult.total_question - correct,
            //   percentage: percentage,
            //   passPercentage: passPercentage,
            // });
            result(null, {
              id: userResult.id,
              correct: correct,
              wrong: userResult.total_question - correct,
              percentage: percentage,
              passPercentage: passPercentage,
              achievedMarks: achievedMarks,
              totalMarks: totalMarks,
            });
          }
        );

        // result(null, this.updateUserResult(userResult));
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResult.create = (newUserResult, result) => {
  connection.query(
    "INSERT INTO user_test_result SET ?",
    [newUserResult],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      // console.log("user_result_id : /////////////" + res.insertId);
      // console.log("created userresult: ", {
      //   id: res.insertId,
      //   ...newUserResult,
      // });
      result(null, { userResultId: res.insertId });
    }
  );
};

UserResult.findById = (id,orgid, result) => {
  connection.query(
    `SELECT * FROM user_test_result WHERE id = ${id} AND org_id = ${orgid}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found UserResult: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResult.findByUserId = (userId,orgid, result) => {
  const query = `
  SELECT 
   utr.id AS user_test_result_id,
    utr.*, 
    qs.*, 
    u.first_name, 
    u.last_name 
  FROM 
    user_test_result utr
  JOIN 
    question_set qs 
    ON utr.question_set_id = qs.id
  JOIN 
    users u 
    ON utr.user_id = u.id
  WHERE 
    utr.user_id = ? AND utr.org_id = ?
  ORDER BY 
    utr.created_date DESC;
`;
  connection.query(query, [userId, orgid], (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found UserResult: ", res);
      result(null, res);
      return;
    }

    // not found UserResultDetails with the id
    result({ kind: "not_found" }, null);
  });
};

UserResult.findByUserIdForTable = (
  user_id,
  startPoint,
  endPoint,
  search,orgid,
  result
) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  const limit = Math.max(parseInt(end - start + 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);
  let queryString = "";
  let queryParams = "";
  if (search) {
    queryString = `SELECT 
   utr.id AS user_test_result_id,
    utr.*, 
    qs.*, 
    u.first_name, 
    u.last_name 
  FROM 
    user_test_result utr
  JOIN 
    question_set qs 
    ON utr.question_set_id = qs.id
  JOIN 
    users u 
    ON utr.user_id = u.id
  WHERE 
    utr.user_id = ? 
  AND (qs.title LIKE ? OR qs.short_desc LIKE ?) AND utr.org_id = ?
  ORDER BY 
    utr.created_date DESC LIMIT ? OFFSET ?;`;
  } else {
    queryString = `SELECT 
   utr.id AS user_test_result_id,
    utr.*, 
    qs.*, 
    u.first_name, 
    u.last_name 
  FROM 
    user_test_result utr
  JOIN 
    question_set qs 
    ON utr.question_set_id = qs.id
  JOIN 
    users u 
    ON utr.user_id = u.id
  WHERE 
    utr.user_id = ? AND utr.org_id = ?
  ORDER BY 
    utr.created_date DESC LIMIT ? OFFSET ?;`;
  }
  if (search) {
    const searchTerm = `%${search}%`;
    queryParams = [user_id, searchTerm, searchTerm,orgid, limit, offset];
  } else {
    queryParams = [user_id,orgid, limit, offset];
  }
  connection.query(queryString, queryParams, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    let countQuery = ``;
    if (search) {
      countQuery = `SELECT COUNT(*) as total FROM 
    user_test_result utr
  JOIN 
    question_set qs 
    ON utr.question_set_id = qs.id
  JOIN 
    users u   
    ON utr.user_id = u.id  WHERE utr.user_id = ? AND (qs.title LIKE ? OR qs.short_desc LIKE ?) AND utr.org_id = ?`;
    } else {
      countQuery = `SELECT COUNT(*) as total FROM user_test_result WHERE user_id = ? AND org_id = ?`;
    }
    let countParams = [];
    if (search) {
      const searchTerm = `%${search}%`;
      countParams = [user_id, searchTerm, searchTerm,orgid];
    } else {
      countParams = [user_id,orgid];
    }

    connection.query(
      countQuery,
      countParams,
      (countErr, countRes) => {
        if (countErr) {
          result(countErr, null);
          return;
        }

        const totalRecords = countRes[0]?.total || 0;
        result(null, { res, totalRecords });
      }
    );

    // not found UserResultDetails with the id
    // result({ kind: "not_found" }, null);
  });
};

UserResult.findQuestionSetByUserId = (userid, questionsetid,orgid, result) => {
  connection.query(
    `SELECT id FROM user_test_result WHERE user_id = ${userid} and question_set_id = ${questionsetid} and org_id = ${orgid} order by created_date desc`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        //  // console.log("found UserResult: ", res);
        result(null, res);
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResult.getHistoryOfUser = (userId, questionsetid,orgid, result) => {
  connection.query(
    `SELECT * FROM user_test_result WHERE user_id = ${userId} and question_set_id = ${questionsetid} and org_id = ${orgid} order by created_date desc`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      }

      // not found UserResultDetails with the id
      result({ kind: "not_found" }, null);
    }
  );
};

UserResult.getStudentsList = (questionSetId, startPoint, endPoint,search,orgid, result) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  const limit = Math.max(parseInt(end - start + 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);

  let queryString = "";
  let queryParams = "";
  if (search) {
    queryString = `SELECT * from user_test_result where question_set_id = ? AND (user_id LIKE ? OR created_date LIKE ?) AND org_id = ? order by created_date desc LIMIT ? OFFSET ?;`;
  } else {
    queryString = `SELECT * from user_test_result where question_set_id = ? AND org_id = ? order by created_date desc LIMIT ? OFFSET ?;`;
  }
  if (search) {
    const searchTerm = `%${search}%`;
    queryParams = [questionSetId, searchTerm, searchTerm,orgid, limit, offset];
  } else {
    queryParams = [questionSetId,orgid, limit, offset];
  }

  connection.query(
    queryString,queryParams,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      let countQuery = ``;
      if (search) {
        countQuery = `SELECT COUNT(*) as total FROM user_test_result WHERE question_set_id = ? AND (user_id LIKE ? OR created_date LIKE ?) AND org_id = ?`;
      } else {
        countQuery = `SELECT COUNT(*) as total FROM user_test_result WHERE question_set_id = ? AND org_id = ?`;
      }
      let countParams = [];
      if (search) {
        const searchTerm = `%${search}%`;
        countParams = [questionSetId, searchTerm, searchTerm,orgid];
      } else {
        countParams = [questionSetId,orgid];
      }
      connection.query(
        countQuery,countParams,
        (countErr, countRes) => {
          if (countErr) {
            result(countErr, null);
            return;
          }

          const totalRecords = countRes[0]?.total || 0;
          result(null, { res, totalRecords });
        }
      );

      // not found UserResultDetails with the id
      // result({ kind: "not_found" }, null);
    }
  );
};

//getDshbDataAnalysis
UserResult.getDshbDataAnalysis = (userId,orgid, result) => {
  // const query =
  //   `SELECT COUNT(*) AS completed_quiz_count, ` +
  //   `AVG(percentage) AS average_percentage, ` +
  //   // `(SELECT COUNT(*) FROM user_test_result WHERE  )`
  //   `(COUNT(*) * 100 / (SELECT COUNT(*) FROM user_test_result WHERE user_id = ${userId})) AS quiz_completion_percentage  FROM ` +
  //   `user_test_result WHERE status = 1 and user_id = ${userId} and org_id=${orgid};`;
  const query = `
  SELECT 
    COUNT(*) AS completed_quiz_count, 
    AVG(percentage) AS average_percentage,
    (COUNT(*) * 100 / (SELECT COUNT(*) FROM user_test_result WHERE user_id = ?)) AS quiz_completion_percentage  
  FROM user_test_result 
  WHERE status = 1 AND user_id = ? AND org_id = ?;
`;
  connection.query(query,[userId, userId, orgid], (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found UserResultDetails with the id
    result({ kind: "not_found" }, null);
  });
};

UserResult.getTotalAttemptCount = (userId, orgid, result) => {
  const query = `SELECT COUNT(*) AS attempt_count from user_test_result u join question_set qs on u.question_set_id = qs.id where qs.created_by = ${userId} AND u.org_id = ${orgid};`;
  connection.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

UserResult.getAll = (orgid, result) => {
  let query = `SELECT * FROM user_test_result where org_id = ${orgid}`;

  connection.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    // console.log("user_test_result: ", res);
    result(null, res);
  });
};

UserResult.updateById = (id, userresult, result) => {
  connection.query(
    "UPDATE user_test_result SET " +
      "org_id= ?, user_id= ? ," +
      "question_set_id= ? , total_question= ? ," +
      "total_answered= ? , total_not_answered= ? ," +
      "total_reviewed= ? , total_not_visited= ? ," +
      "total_not_visited= ? , flag= ? , modified_by = ? " +
      "WHERE id = ?",
    [
      userresult.org_id,
      userresult.user_id,
      userresult.question_set_id,
      userresult.total_answered,
      userresult.total_not_answered,
      userresult.total_reviewed,
      userresult.total_not_visited,
      userresult.total_not_visited,
      userresult.total_not_visited,
      userresult.flag,
      id,
    ],
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

      // console.log("updated userresult: ", { id: id, ...userresult });
      result(null, { id: id, ...userresult });
    }
  );
};

UserResult.remove = (id, result) => {
  connection.query(
    "DELETE FROM user_test_result WHERE id = ?",
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

      // console.log("deleted userresult with id: ", id);
      result(null, res);
    }
  );
};

UserResult.removeAll = (result) => {
  connection.query("DELETE FROM user_test_result", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    // console.log(`deleted ${res.affectedRows} user_test_result`);
    result(null, res);
  });
};

module.exports = UserResult;
