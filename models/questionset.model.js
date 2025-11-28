const connection = require("../config/mysql.db.config");
const { logger } = require("../logger");

// constructor
const QuestionSet = function (questionset) {
  // this.org_id = questionset.org_id;
  // this.title = questionset.title;
  // this.question_set_url = questionset.question_set_url;
  // this.image = questionset.image;
  // this.author = questionset.author;
  // this.short_desc = questionset.short_desc;
  // this.description = questionset.description;
  // this.start_time = questionset.start_time;
  // this.end_time = questionset.end_time;
  // this.start_date = questionset.start_date;
  // this.end_date = questionset.end_date;
  // this.time_duration = questionset.time_duration;
  // this.no_of_question = questionset.no_of_question;
  // this.status_id = questionset.status_id;
  // this.is_demo = questionset.is_demo;
  //  this.created_by=questionset.created_by;
  // // this.created_date=created_date;
  //  this.modified_by=questionset.modified_by;
  // // this.modified_date=modified_date;
  // this.totalmarks = questionset.totalmarks;
  // this.pass_percentage = questionset.pass_percentage;
  // this.tags = questionset.tags;
};

QuestionSet.create = (newQuestionSet, result) => {
  if (newQuestionSet.start_date > new Date().toISOString()) {
    newQuestionSet.status_id = 0; 
    }
  const sqlQuery = `
    INSERT INTO question_set (
      org_id, title, question_set_url, image, author, short_desc, description,
      start_time, end_time, start_date, end_date, time_duration, no_of_question,
      status_id, is_demo, created_by, modified_by, totalmarks, pass_percentage, tags
    ) VALUES (
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `;

  const values = [
    newQuestionSet.org_id,
    newQuestionSet.title,
    newQuestionSet.question_set_url,
    newQuestionSet.image,
    newQuestionSet.author,
    newQuestionSet.short_desc,
    newQuestionSet.description,
    newQuestionSet.start_time,
    newQuestionSet.end_time,
    newQuestionSet.start_date,
    newQuestionSet.end_date,
    newQuestionSet.time_duration,
    newQuestionSet.no_of_question,
    newQuestionSet.status_id,
    newQuestionSet.is_demo,
    newQuestionSet.created_by,
    newQuestionSet.modified_by,
    newQuestionSet.totalmarks,
    newQuestionSet.pass_percentage,
    newQuestionSet.tags,
  ];
  connection.query(
    sqlQuery, values,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

       // console.log("created questionset: ", {
      //   id: res.insertId,
      //   ...newQuestionSet,
      // });
      result(null, { id: res.insertId, ...newQuestionSet });
    }
  );
};

QuestionSet.getQuestionSetIdByCategoryId = async (category_id,orgid, result) => {
  connection.execute(
    `select question_set_id from question_set_categories where category_id = ${category_id} and org_id = ${orgid}`,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
         // console.log("found questionset: ", res);
        result(null, res);
        return;
      }

      // not found QuestionSet with the id
      result({ kind: "not_found" }, null);
    }
  );
  // return rows;
  // try {
  //   const [rows] = await connection.execute(
  //     "select question_set_id from question_set_categories where category_id = ? ",
  //     [category_id]
  //   );
  //   return rows;
  // } catch (err) {
  //   console.error(err);
  //   throw err;
  // }
};

QuestionSet.getQuestionSet = async (question_set_id,startPoint,endPoint,orgid, result) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  
  const limit = Math.max(parseInt(end - start + 1, 10), 1);
const offset = Math.max(parseInt(start - 1, 10), 0);

  connection.query(
    `SELECT qsq.question_id, qm.question, qm.paragraph_id, qm.question_type_id,qm.marks,qm.is_negative, qm.negative_marks, qs.pass_percentage from testli.question_set_questions qsq, question_set qs , question_master qm where qs.id = ? and qs.org_id = ?  and qsq.question_set_id = qs.id  and qm.id = qsq.question_id order by qm.created_date desc LIMIT ? OFFSET ?;`,[question_set_id,orgid,limit,offset],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      connection.query(
        "SELECT COUNT(*) as total FROM question_set_questions WHERE question_set_id = ? and org_id = ?",
        [question_set_id,orgid],
        (countErr, countRes) => {
            if (countErr) {
                result(countErr, null);
                return;
            }

            const totalRecords = countRes[0]?.total || 0;
            result(null, {  res, totalRecords });
        }
    );

      // not found QuestionSet with the id
      // result({ kind: "not_found" }, null);
    }
  );
};

QuestionSet.getAllQuestionsOfQuestionSet = (question_set_id,orgid, result) => {
  connection.query(
         `SELECT qsq.question_id, qm.question, qm.paragraph_id, qm.question_type_id,qm.marks,qm.is_negative, qm.negative_marks, qsq.question_set_id, qs.game_time, qs.game_score, qs.pass_percentage from testli.question_set_questions qsq, question_set qs , question_master qm where qs.id = ? and qs.org_id = ?  and qsq.question_set_id = qs.id  and qm.id = qsq.question_id order by qm.created_date desc;`,[question_set_id,orgid],
    (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, {res});
        }
    );
}

QuestionSet.getAllQuestionsOfGamePin = (gamepin,orgid, result) => {
  connection.query(
         `SELECT qsq.question_id, qm.question, qm.paragraph_id, qm.question_type_id,qm.marks,qm.is_negative, qm.negative_marks, qs.pass_percentage, qsq.question_set_id, qs.game_time, qs.game_score from testli.question_set_questions qsq, question_set qs , question_master qm where  qs.org_id = ? and qs.game_pin = ?  and qsq.question_set_id = qs.id  and qm.id = qsq.question_id order by qm.created_date desc;`,[orgid, gamepin],
    (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, {res});
        }
    );
}

QuestionSet.getQuestionSetsOfInstructor = (userId,startPoint,endPoint,search,orgid, result) => {

  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  const limit = Math.max(parseInt((end - start) - 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);

  
  let queryString = "";
  let queryParams = "";
  if (search) {
    queryString = `SELECT id, title, short_desc, start_date, end_date, no_of_question, time_duration, totalmarks, is_demo, is_gamified, game_pin, status_id, modified_date, created_date 
     FROM question_set 
     WHERE created_by = ? 
     AND (title LIKE ? OR short_desc LIKE ?) AND org_id = ? order by created_date desc LIMIT ? OFFSET ?;`;
  } else {
    queryString = `SELECT id, title, short_desc, start_date, end_date, no_of_question, time_duration, totalmarks, is_demo,is_gamified, game_pin, status_id, modified_date, created_date 
     FROM question_set 
     WHERE created_by = ? AND org_id = ?
     ORDER BY created_date DESC 
     LIMIT ? OFFSET ?;`;
  }
  if (search) {
    const searchTerm = `%${search}%`;
    queryParams = [userId, searchTerm, searchTerm,orgid, limit, offset];
  } else {
    queryParams = [userId,orgid, limit, offset];
  }
  connection.query(
    queryString, queryParams,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (!res.length) {
        result({ kind: "not_found" }, null);
        return;
      }

      let countQuery = ``;
      if (search) {
        countQuery = `SELECT COUNT(*) as total FROM question_set WHERE created_by = ? AND (title LIKE ? OR short_desc LIKE ?) AND org_id = ?`;
      } else {
        countQuery = `SELECT COUNT(*) as total FROM question_set WHERE created_by = ? AND org_id = ?`;
      }
      let countParams = [];
      if (search) {
        const searchTerm = `%${search}%`;
        countParams = [userId, searchTerm, searchTerm,orgid];
      } else {
        countParams = [userId,orgid];
      }
      // Fetch total count only when there are results
      connection.query(
        countQuery, countParams,
        (countErr, countRes) => {
          if (countErr) {
            result(countErr, null);
            return;
          }

          const totalRecords = countRes[0]?.total || 0;
          result(null, { res, totalRecords });  // Send response only once
        }
      );
    }
  );
};

QuestionSet.findById = (id,orgid, result) => {
  connection.query(
    `SELECT * FROM question_set WHERE id = ${id} and org_id = ${orgid}`,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
         // console.log("found questionset: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found QuestionSet with the id
      result({ kind: "not_found" }, null);
    }
  );
};

QuestionSet.getQuetionSetBySearchedKeyword = (keyword,orgid, result) => {
  const query = `select * from question_set qs where org_id = ${orgid} and title like "%${keyword}%" or title = "${keyword}" or short_desc = "${keyword}" or short_desc like "%${keyword}%" or tags ="${keyword}" or tags like "%${keyword}%";`;
  connection.query(query, (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

    if (res.length) {
       // console.log("found questionset: ", res);
      result(null, res);
      return;
    }

    // not found QuestionSet with the id
    result({ kind: "not_found" }, null);
  });
};

QuestionSet.getQuestionSetByTitle = (title, result) => {
  const query = `SELECT * FROM question_set WHERE title = ?`;
  connection.query(query, [title], (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found questionset: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found QuestionSet with the title
    result({ kind: "not_found" }, null);
  });

}

// QuestionSet.getAll = (orgid,start,end,limit1,result) => {
//   const limit = Math.max(parseInt((end - start) + 1 , 10), 1);
//   const offset = Math.max(parseInt(start - 1, 10), 0);
//   let query = `SELECT * FROM question_set where status_id = 1 and org_id = ? LIMIT ? OFFSET ?;` ;
//   connection.query(query,[orgid, limit, offset], (err, res) => {
//     if (err) {
       
//       result(null, err);
//       return;
//     }

//     // logger.info("users: ", res);
//     result(null, res);
//   });
// };

QuestionSet.getAll = (orgid, start, end, limit1, result) => {
  const limit = Math.max(parseInt((end - start)- 1 , 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);
  
  
  // const updateExpiredQuery = `
  //   UPDATE question_set 
  //   SET status_id = 0 
  //   WHERE status_id = 1 
  //   AND org_id = ? 
  //   AND end_date < NOW() AND start_date < NOW()
  // `;

 
const updateStatusQuery = `
    UPDATE question_set 
    SET status_id = CASE 
        WHEN start_date <= NOW() AND end_date > NOW() THEN 1
        ELSE 0
    END
    WHERE org_id = ?
`;
  
  connection.query(updateStatusQuery, [orgid], (updateErr, updateRes) => {
    if (updateErr) {
      result(null, updateErr);
      return;
    }
    
    
    const selectQuery = `
      SELECT * FROM question_set 
      WHERE status_id = 1 
      AND org_id = ? 
      LIMIT ? OFFSET ?
    `;
    
    connection.query(selectQuery, [orgid, limit, offset], (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      
      // logger.info("users: ", res);
      result(null, res);
    });
  });
};

QuestionSet.findAllQSet = (startPoint,endPoint,search,orgid,result) => {
  // const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  // const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  // const limit = Math.max(parseInt((end - start) - 1, 10), 1);
  // const offset = Math.max(parseInt(start - 1, 10), 0);

   const limit = Math.max(parseInt(rowsPerPage, 10), 1);
  const offset = Math.max(parseInt((page - 1) * rowsPerPage, 10), 0);

  
  let queryString = "";
  let queryParams = "";
  if (search) {
    queryString = `SELECT * FROM question_set where status_id = 1 and org_id = ? AND (title LIKE ? OR short_desc LIKE ? OR description LIKE ?) ORDER BY created_date DESC LIMIT ? OFFSET ?;`;
  } else {
    queryString = `SELECT * FROM question_set where status_id = 1 and org_id = ? ORDER BY created_date DESC LIMIT ? OFFSET ?;`;
  }
  if (search) {
    const searchTerm = `%${search}%`;
    queryParams = [orgid, searchTerm, searchTerm,searchTerm, limit, offset];
  } else {
    queryParams = [orgid,limit, offset];
  }
  connection.query(
    queryString, queryParams,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (!res.length) {
        result({ kind: "not_found" }, null);
        return;
      }

      let countQuery = ``;
      if (search) {
        countQuery = `SELECT COUNT(*) as total FROM question_set where status_id = 1 and org_id = ? AND (title LIKE ? OR short_desc LIKE ? OR description LIKE ?);`;
      } else {
        countQuery = `SELECT COUNT(*) as total FROM question_set where status_id = 1 and org_id = ?;`;
      }
      let countParams = [];
      if (search) {
        const searchTerm = `%${search}%`;
        countParams = [orgid,searchTerm, searchTerm, searchTerm];
      } else {
        countParams = [orgid];
      }
      // Fetch total count only when there are results
      connection.query(
        countQuery, countParams,
        (countErr, countRes) => {
          if (countErr) {
            result(countErr, null);
            return;
          }

          const totalRecords = countRes[0]?.total || 0;
          result(null, { res, totalRecords });  // Send response only once
        }
      );
    }
  );

}
// QuestionSet.findAllQSet = (orgid,result) => {
//   let query = `SELECT * FROM question_set where status_id = 1 and org_id = ${orgid}`;
//   connection.query(query, (err, res) => {
//     if (err) { 
       
//       result(null, err);
//       return;
//     }

//     // logger.info("users: ", res);
//     result(null, res);
//   });
// };


QuestionSet.updateById = (id, questionset, modified_by, modified_date,orgid, result) => {
 
  connection.query(
    "UPDATE question_set SET title= ?, " +
      "short_desc= ? , start_date = ? , end_date = ?," +
      "time_duration= ? , " +
      "is_demo= ?, modified_by= ? , modified_date= ? " +
      "WHERE id = ? and org_id = ?",
    [
      questionset.title,
      questionset.short_desc,
      questionset.start_date,
      questionset.end_date,
      questionset.time_duration,
      questionset.is_demo,
      modified_by,
      modified_date,
      id,orgid
    ],
    (err, res) => {
      if (err) {
         
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionSet with the id
        result({ kind: "not_found" }, null);
        return;
      }

       // console.log("updated questionset: ", { id: id, ...questionset });
      result(null, { id: id, ...questionset });
    }
  );
};

QuestionSet.updateStatusById = (questionset,orgid, result) => {
  connection.execute(
    "UPDATE question_set SET status_id = ? WHERE id = ? and org_id = ?",
    [
      questionset.status_id,
      questionset.id,
      orgid
    ],
    (err, res) => {
      if (err) {
         
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionSet with the id
        result({ kind: "not_found" }, null);
        return;
      }

       // console.log("updated questionset: ", { id: id, ...questionset });
      result(null, { id: id, ...questionset });
    }
  );
};

QuestionSet.updateGameConfigById = ( {timePerQuestion, scorePerQuestion, gamePin}, id, result) => {
   connection.execute(
    "UPDATE question_set SET is_gamified = 1 , game_pin = ? , game_time = ?, game_score = ? WHERE id = ?",
    [
      gamePin,
      timePerQuestion,
      scorePerQuestion,
      id
     
    ],
    (err, res) => {
      if (err) {
         
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionSet with the id
        result({ kind: "not_found" }, null);
        return;
      }

       // console.log("updated questionset: ", { id: id, ...questionset });
      result(null, { id: id });
    }
  );
}

QuestionSet.remove = (id, result) => {
  connection.query("DELETE FROM question_set WHERE id = ?", id, (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found QuestionSet with the id
      result({ kind: "not_found" }, null);
      return;
    }

     // console.log("deleted questionset with id: ", id);
    result(null, res);
  });
};

QuestionSet.removeAll = (result) => {
  connection.query("DELETE FROM question_set", (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

     // console.log(`deleted ${res.affectedRows} question_set`);
    result(null, res);
  });
};

QuestionSet.getQuetionSetUsedByCount = (orgid,result) => {
  connection.query(
    "SELECT q1.title, q1.id, q2.count AS count " +
      "FROM  " +
      "( " +
      "SELECT id , title " +
      "FROM question_set " +
      ") AS q1 " +
      "INNER JOIN " +
      "( " +
      "select question_set_id, count(question_set_id) as count from user_test_result utr group by question_set_id  " +
      ") AS q2 " +
      "ON q1.id = q2.question_set_id where q1.org_id = ? order by count desc",orgid,
    (err, res) => {
      if (err) {
         
        result(null, err);
        return;
      }

      logger.info("users: ", res);
      result(null, res);
    }
  );
};

module.exports = QuestionSet;
