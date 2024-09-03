const connection = require("../config/mysql.db.config");
const logger = require("../logger")
// constructor
const QuestionMaster = function(questionmaster) {


    // this.id = questionmaster.id;
    this.org_id = questionmaster.org_id;
    this.question = questionmaster.question;
    this.question_type_id = questionmaster.question_type_id;
    this.status_id = questionmaster.status_id;
    this.marks = questionmaster.marks;
    this.is_negative = questionmaster.is_negative;
    this.negative_marks = questionmaster.negative_marks;
    this.tags = questionmaster.tags;
    // this.created_by = questionmaster.created_by;
    // this.created_date = questionmaster.created_date;
    // this.modified_by = questionmaster.modified_by;
    // this.modified_date = questionmaster.modified_date;
};

QuestionMaster.create = (newQuestionMaster, result) => {
  connection.execute("INSERT INTO question_master SET ?", newQuestionMaster, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created questionmaster: ", { id: res.insertId, ...newQuestionMaster });
    result(null, { id: res.insertId, ...newQuestionMaster });
  });
};

QuestionMaster.findById = (id, result) => {
  connection.execute(`SELECT question FROM question_master WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found questionmaster: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found QuestionMaster with the id
    result({ kind: "not_found" }, null);
  });
};



QuestionMaster.findAll = (result) => {
  let query = "SELECT * FROM question_master";
  // console.log("tags : " + tags);
  // tags = req.params.id;
  // if (tags) {
  //   query += ` WHERE tags LIKE '%${tags}%'`;
  // }
  console.log("findAll : " + query)
  connection.execute(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("question_master: ", res);
    result(null, res);
  });
};


QuestionMaster.updateById = (id, questionmaster, result) => {
  connection.execute(
    "UPDATE question_master SET org_id= ?, question_master_url= ? ," + 
            "image= ? ," + 
            "short_desc= ? , description= ? ," + 
            "start_time= ? , end_time= ? ," + 
            "start_date= ? , end_date= ? ," + 
            "time_duration= ? , no_of_question= ? ," + 
            "status_id= ? , is_demo= ? " + 
            "WHERE id = ?",
    [ 
      questionmaster.org_id, questionmaster.question_master_url, questionmaster.image, 
      questionmaster.short_desc, questionmaster.description, questionmaster.start_time ,
      questionmaster.end_time, questionmaster.start_date, questionmaster.end_date ,
      questionmaster.time_duration, questionmaster.no_of_question, questionmaster.status_id ,
      questionmaster.is_demo ,
      id
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionMaster with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated questionmaster: ", { id: id, ...questionmaster });
      result(null, { id: id, ...questionmaster });
    }
  );
};

QuestionMaster.remove = (id, result) => {
  connection.execute("DELETE FROM question_master WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found QuestionMaster with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted questionmaster with id: ", id);
    result(null, res);
  });
};

QuestionMaster.removeAll = result => {
  connection.execute("DELETE FROM question_master", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} question_master`);
    result(null, res);
  });
};

module.exports = QuestionMaster;
