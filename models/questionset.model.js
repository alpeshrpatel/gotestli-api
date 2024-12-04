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
  connection.query(
    "INSERT INTO question_set SET ?",
    newQuestionSet,
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

QuestionSet.getQuestionSetIdByCategoryId = async (category_id, result) => {
  connection.execute(
    `select question_set_id from question_set_categories where category_id = ${category_id}`,
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

QuestionSet.getQuestionSet = async (question_set_id, result) => {
  connection.execute(
    `SELECT qsq.question_id, qm.question, qm.paragraph_id, qm.question_type_id, qs.pass_percentage from testli.question_set_questions qsq, question_set qs , question_master qm where qs.id = ${question_set_id} and qsq.question_set_id = qs.id  and qm.id = qsq.question_id order by qm.created_date desc`,
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
};

QuestionSet.getQuestionSetsOfInstructor = (userId, result) => {
  connection.execute(
    `SELECT id, title, short_desc, no_of_question, time_duration, totalmarks, is_demo from question_set where created_by = '${userId}' ORDER BY created_date DESC`,
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
};

QuestionSet.findById = (id, result) => {
  connection.query(
    `SELECT * FROM question_set WHERE id = ${id}`,
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

QuestionSet.getQuetionSetBySearchedKeyword = (keyword, result) => {
  const query = `select * from question_set qs where title like "%${keyword}%" or title = "${keyword}" or short_desc = "${keyword}" or short_desc like "%${keyword}%" or tags ="${keyword}" or tags like "%${keyword}%";`;
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

QuestionSet.getAll = (result) => {
  let query = "SELECT * FROM question_set where is_demo = 1";
  connection.query(query, (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

    // logger.info("users: ", res);
    result(null, res);
  });
};

QuestionSet.updateById = (id, questionset, modified_by, modified_date, result) => {
  connection.query(
    "UPDATE question_set SET title= ?, " +
      "short_desc= ? , " +
      "time_duration= ? , " +
      "is_demo= ?, modified_by= ? , modified_date= ? " +
      "WHERE id = ?",
    [
      questionset.title,
      questionset.short_desc,
      questionset.time_duration,
      questionset.is_demo,
      modified_by,
      modified_date,
      id,
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

QuestionSet.updateStatusById = (questionset, result) => {
  connection.execute(
    "UPDATE question_set SET status_id = ? WHERE id = ?",
    [
      questionset.status_id,
      questionset.id,
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

QuestionSet.getQuetionSetUsedByCount = (result) => {
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
      "ON q1.id = q2.question_set_id order by count desc",
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
