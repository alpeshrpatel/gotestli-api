const connection = require("../config/mysql.db.config");
const { logger } = require("../logger");

// constructor
const QuestionSet = function(questionset) {
    this.org_id = questionset.org_id;
    this.title = questionset.title;
    this.question_set_url = questionset.question_set_url;
    this.image = questionset.image;
    this.author=questionset.author;
    this.short_desc=questionset.short_desc;
    this.description=questionset.description;
    this.start_time=questionset.start_time;
    this.end_time=questionset.end_time;
    this.start_date=questionset.start_date;
    this.end_date=questionset.end_date;
    this.time_duration=questionset.time_duration;
    this.no_of_question=questionset.no_of_question;
    this.status_id=questionset.status_id;
    this.is_demo=questionset.is_demo;
    // this.created_by=created_by;
    // this.created_date=created_date;
    // this.modified_by=modified_by;
    // this.modified_date=modified_date;
};

QuestionSet.create = (newQuestionSet, result) => {
  connection.query("INSERT INTO question_set SET ?", newQuestionSet, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created questionset: ", { id: res.insertId, ...newQuestionSet });
    result(null, { id: res.insertId, ...newQuestionSet });
  });
};

QuestionSet.getQuestionSetIdByCategoryId = async (category_id, result) => {
  connection.execute(`select question_set_id from question_set_categories where category_id = ${category_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found questionset: ", res);
      result(null, res);
      return;
    }

    // not found QuestionSet with the id
    result({ kind: "not_found" }, null);
  });
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
  connection.execute(`SELECT qsq.question_id, qm.question, qs.pass_percentage from testli.question_set_questions qsq, question_set qs , question_master qm where qs.id = ${question_set_id} and qsq.question_set_id = qs.id  and qm.id = qsq.question_id`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found questionset: ", res);
      result(null, res);
      return;
    }

    // not found QuestionSet with the id
    result({ kind: "not_found" }, null);
  });
};

QuestionSet.getQuestionSetsOfInstructor =  (author, result) => {
  connection.execute(`SELECT id, title, short_desc, no_of_question, time_duration, totalmarks, is_demo from question_set where author = '${author}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found questionset: ", res);
      result(null, res);
      return;
    }

    // not found QuestionSet with the id
    result({ kind: "not_found" }, null);
  });
};

QuestionSet.findById = (id, result) => {
  connection.query(`SELECT * FROM question_set WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found questionset: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found QuestionSet with the id
    result({ kind: "not_found" }, null);
  });
};


QuestionSet.getAll = (result) => {
  let query = "SELECT * FROM question_set";
  connection.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    logger.info("users: ", res);
    result(null, res);
  });
};

QuestionSet.updateById = (id, questionset, result) => {
  connection.query(
    "UPDATE question_set SET org_id= ?, question_set_url= ? ," + 
            "image= ? ," + 
            "short_desc= ? , description= ? ," + 
            "start_time= ? , end_time= ? ," + 
            "start_date= ? , end_date= ? ," + 
            "time_duration= ? , no_of_question= ? ," + 
            "status_id= ? , is_demo= ? " + 
            "WHERE id = ?",
    [ 
      questionset.org_id, questionset.question_set_url, questionset.image, 
      questionset.short_desc, questionset.description, questionset.start_time ,
      questionset.end_time, questionset.start_date, questionset.end_date ,
      questionset.time_duration, questionset.no_of_question, questionset.status_id ,
      questionset.is_demo ,
      id
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionSet with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated questionset: ", { id: id, ...questionset });
      result(null, { id: id, ...questionset });
    }
  );
};

QuestionSet.remove = (id, result) => {
  connection.query("DELETE FROM question_set WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found QuestionSet with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted questionset with id: ", id);
    result(null, res);
  });
};

QuestionSet.removeAll = result => {
  connection.query("DELETE FROM question_set", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} question_set`);
    result(null, res);
  });
};

module.exports = QuestionSet;
