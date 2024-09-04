const connection = require("../config/mysql.db.config");
const util = require("../utils/util")

// constructor
const UserResult = function(userresult) {
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
    this,marks = userresult.masks;
    // this.created_by = userresult.created_by;
    // this.created_date = userresult.created_date;
    // this.modified_by = userresult.modified_by;
    // this.modified_date = userresult.modified_date;
};

/**
 * 
 * @param {*} questionSetId 
 * @returns 
 */
function getPassCriteria  (questionSetId) {
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
UserResult.getAnswers  =  (userResultId) => {
  try {
    const [rows] =  connection.execute(
      "select answer, correct_answer from user_test_result_dtl where user_test_result_id = ?",
      [userResultId]
    );
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
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

function updateTestResult (
            userResultId,
            questionSetId,
            totalQuestions,
            totalAnswered,
            skippedQuestion,
            totalReviewed,
            marks,
            percentage
          ){
  const modifiedDate = new Date().toISOString().replace("T"," ").substring(0, 19);

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
UserResult.updateUserResult =  (userresult, result) => {
    const modifiedDate = new Date().toISOString().replace("T"," ").substring(0, 19);

    const query = `UPDATE user_test_result SET 
                    total_answered = ? , total_not_answered = ?, 
                    total_reviewed = ? , total_not_visited = 0 , 
                    percentage = ?, marks_obtained = ?, 
                    modified_date = ?, status = ?
                  WHERE id = ?`;
    connection.query(
       query,
      [ 
        userresult.total_answered, userresult.total_not_answered, 
        userresult.total_reviewed , 
        userresult.percentage, userresult.marksObtained ,modifiedDate,
        userresult.status,userresult.id
      ],
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
  
        // console.log("updated userresult: ", { id: id, ...userresult });
        result(null, { id: userresult.id, ...userresult });
      }
    );
}


/**
 * 
 * @param {*} userResult 
 * @param {*} result 
 */
UserResult.calculateResult  = (userResult, result) => {

  // console.log("userResult --> "  + JSON.stringify(userResult));
  let passingStatus;
  let percentage;
  let marks;
  let count = 0;
  
  connection.query(`select   qs.totalmarks, qs.pass_percentage, utrd.answer, utrd.correct_answer, utr.total_question, utr.total_answered, 
                      utr.total_not_answered, utr.total_reviewed, utr.total_not_visited , utr.percentage , qm.marks 
                      from question_set qs , user_test_result utr , user_test_result_dtl utrd , question_master qm 
                      where qs.id = utr.question_set_id  
                      and utr.id = utrd.user_test_result_id
                      and qm.id = utrd.question_set_question_id 
                      and utr.id = ${userResult.id}`, (err, res) => {
                          if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      let totalMarks = 0;
      let achievedMarks = 0;
      let passPercentage =res[0].pass_percentage;
      let correct = 0;


      res.forEach((record ) => {
        // console.log(record.marks + " : "+record.answer + " : " + record.correct_answer);
        totalMarks+=record.marks;
        if (record.answer == record.correct_answer) {
              achievedMarks +=  record.marks;
              correct = correct + 1;
        }
      },0);
 
      percentage = Math.round((100 * achievedMarks) / totalMarks);
      console.log("achievedMarks : "+ achievedMarks);
      console.log("passPercentage : "+ passPercentage);
      
      console.log("totalMarks : "+ totalMarks);
      console.log("percentage : "+ percentage);

      if (percentage < passPercentage) {
        passingStatus = "Fail";
      } else {
        passingStatus = "Pass";
      }
      console.log(passingStatus);
      console.log("userResult : " + JSON.stringify(userResult));

      userResult.marksObtained = achievedMarks;
      userResult.percentage = percentage;
      userResult.status = 1;
      userResult.passingStatus = passingStatus;

      // console.log(userResult);

      let userresult = userResult;

      // updateUserResult(userResult);

      // console.log("updated userresult: ", { ...userResult });
      // result(null, { ...userResult });
      const modifiedDate = new Date().toISOString().replace("T"," ").substring(0, 19);

      const query = `UPDATE user_test_result SET 
                      total_answered = ? , total_not_answered = ?, 
                      total_reviewed = ? , total_not_visited = 0 , 
                      percentage = ?, marks_obtained = ?, 
                      modified_date = ?, status = ?
                    WHERE id = ?`;
      connection.query(
         query,
        [ 
          userresult.total_answered, userresult.total_not_answered, 
          userresult.total_reviewed , 
          userresult.percentage, userresult.marksObtained ,modifiedDate,
          userresult.status,userresult.id
        ],
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
    
          console.log("updated userresult: ", {id: userResult.id, correct:correct, wrong: userResult.total_question - correct, percentage:percentage,passPercentage:passPercentage });
          result(null,{ id: userResult.id, correct:correct, wrong: userResult.total_question - correct, percentage:percentage,passPercentage:passPercentage });
        }
      );
      
      // result(null, this.updateUserResult(userResult));
      return;
    }
   

    

    // not found UserResultDetails with the id
    result({ kind: "not_found" }, null);
  });

};


UserResult.create = (newUserResult, result) => {
  connection.query("INSERT INTO user_test_result SET ?", [newUserResult], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("user_result_id : /////////////"+res.insertId)
    console.log("created userresult: ", { id: res.insertId, ...newUserResult });
    result(null, { userResultId: res.insertId});
  });
};

UserResult.findById = (id, result) => {
  connection.query(`SELECT * FROM user_test_result WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found UserResult: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found UserResultDetails with the id
    result({ kind: "not_found" }, null);
  });
};

UserResult.findByUserId = (user_id, result) => {
  connection.query(`SELECT * FROM user_test_result WHERE user_id = ${user_id} order by created_date desc`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found UserResult: ", res);
      result(null, res);
      return;
    }

    // not found UserResultDetails with the id
    result({ kind: "not_found" }, null);
  });
};

UserResult.findQuestionSetByUserId = (userid, questionsetid,  result) => {
  connection.query(`SELECT id FROM user_test_result WHERE user_id = ${userid} and question_set_id = ${questionsetid} order by created_date desc`, (err, res) => {
    if (err) {
      console.log("error: ", err);
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

UserResult.getHistoryOfUser = (userId, questionsetid,  result) => { 
  connection.query(`SELECT id,percentage,marks_obtained,modified_date,status FROM user_test_result WHERE user_id = ${userId} and question_set_id = ${questionsetid} order by created_date desc`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      
      result(null, res);
      return;
    }

    // not found UserResultDetails with the id
    result({ kind: "not_found" }, null);
  });
};

UserResult.getStudentsList = (questionSetId, result) => { 
  connection.query(`SELECT user_id, total_answered, percentage, marks_obtained, status from user_test_result where question_set_id = ${questionSetId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found UserResultDetails with the id
    result({ kind: "not_found" }, null);
  });
};

UserResult.getAll = (result) => {
  let query = "SELECT * FROM user_test_result";

  connection.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("user_test_result: ", res);
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
            "total_not_visited= ? , flag= ? , " + 
            "WHERE id = ?",
    [ 
      userresult.org_id, userresult.user_id, userresult.question_set_id, 
      userresult.total_answered, userresult.total_not_answered, userresult.total_reviewed ,
      userresult.total_not_visited, userresult.total_not_visited, userresult.total_not_visited ,
      userresult.flag,
      id
    ],
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

      console.log("updated userresult: ", { id: id, ...userresult });
      result(null, { id: id, ...userresult });
    }
  );
};

UserResult.remove = (id, result) => {
  connection.query("DELETE FROM user_test_result WHERE id = ?", id, (err, res) => {
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

    console.log("deleted userresult with id: ", id);
    result(null, res);
  });
};

UserResult.removeAll = result => {
  connection.query("DELETE FROM user_test_result", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} user_test_result`);
    result(null, res);
  });
};

module.exports = UserResult;