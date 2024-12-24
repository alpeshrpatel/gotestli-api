const connection = require("../config/mysql.db.config");
const logger = require("../logger");
// constructor
const QuestionMaster = function (questionmaster) {
  // this.id = questionmaster.id;
  this.org_id = questionmaster.org_id;
  this.question = questionmaster.question;
  this.description = questionmaster.description;
  this.explanation = questionmaster.explanation;
  this.paragraph_id = questionmaster.paragraph_id;
  this.question_type_id = questionmaster.question_type_id;
  this.status_id = questionmaster.status_id;
  this.complexity = questionmaster.complexity;
  this.marks = questionmaster.marks;
  this.is_negative = questionmaster.is_negative;
  this.negative_marks = questionmaster.negative_marks;
  // this.tags = questionmaster.tags;
  // this.created_by = questionmaster.created_by;
  // this.created_date = questionmaster.created_date;
  // this.modified_by = questionmaster.modified_by;
  // this.modified_date = questionmaster.modified_date;
};

QuestionMaster.create = (newQuestionMaster, userId, result) => {
  const query = `INSERT INTO question_master (org_id, question, description,explanation,paragraph_id,question_type_id,status_id,complexity,marks,is_negative,negative_marks, created_by, modified_by) VALUES (0, ?,?, ?, ?, ?,?,?,?,?,?,?,?)`;
  connection.execute(
    query,
    [
      newQuestionMaster.question,
      newQuestionMaster.description,
      newQuestionMaster.explanation,
      newQuestionMaster.paragraph_id,
      newQuestionMaster.question_type_id,
      1,
      newQuestionMaster.complexity,
      newQuestionMaster.marks,
      newQuestionMaster.is_negative,
      newQuestionMaster.negative_marks,
      userId,
      userId,
    ],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      // console.log("created questionmaster: ", { id: res.insertId, ...newQuestionMaster });
      result(null, { id: res.insertId, ...newQuestionMaster });
    }
  );
};

QuestionMaster.findById = (id, result) => {
  connection.execute(
    `SELECT question, explanation FROM question_master WHERE id = ${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found questionmaster: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found QuestionMaster with the id
      result({ kind: "not_found" }, null);
    }
  );
};

QuestionMaster.findParagraph = (id, result) => {
  connection.execute(
    `SELECT paragraph FROM question_paragraph WHERE id = ${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found paragraph: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found paragraph with the id
      result({ kind: "not_found" }, null);
    }
  );
};

//findDetailedQuestion
QuestionMaster.findDetailedQuestion = (id, result) => {
  connection.execute(
    `SELECT 
    qm.id AS id,
    qm.question AS question,
    qm.description AS description,
    qm.explanation AS explanation,
    qm.paragraph_id AS paragraph_id,
    qm.question_type_id AS question_type_id,
    qm.status_id AS status_id,
    qm.complexity AS complexity,
    qm.marks AS marks,
    qm.negative_marks AS negative_marks,
    qm.is_negative AS is_negative,
    qp.paragraph AS paragraph
FROM 
    question_master qm
JOIN 
    question_paragraph qp 
ON 
    qm.paragraph_id = qp.id
WHERE 
    qm.created_by = ${id};
`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};

QuestionMaster.findAll = (userid, result) => {
  let query = `SELECT * FROM question_master where created_by = ${userid}`;
  //  // console.log("tags : " + tags);
  // tags = req.params.id;
  // if (tags) {
  //   query += ` WHERE tags LIKE '%${tags}%'`;
  // }
  // console.log("findAll : " + query)
  connection.execute(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    //  // console.log("question_master: ", res);
    result(null, res);
  });
};

QuestionMaster.updateById = (id, questionmaster, result) => {
  connection.execute(
    "UPDATE question_master SET " +
      "org_id = ?, question = ?, description = ?, explanation = ?, " +
      "paragraph_id = ?, question_type_id = ?, status_id = ?, complexity = ?, " +
      "marks = ?, is_negative = ?, negative_marks = ? " +
      "WHERE id = ?",
    [
      questionmaster.org_id,
      questionmaster.question,
      questionmaster.description,
      questionmaster.explanation,
      questionmaster.paragraph_id,
      questionmaster.question_type_id,
      questionmaster.status_id,
      questionmaster.complexity,
      questionmaster.marks,
      questionmaster.is_negative,
      questionmaster.negative_marks,
      id, 
    ],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionMaster with the id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated questionmaster: ", { id: id, ...questionmaster });
      result(null, { id: id, ...questionmaster });
    }
  );
};

QuestionMaster.updateStatusById = (id, statusId, result) => {
  connection.execute(
    "UPDATE question_master SET status_id= ? WHERE id = ?",
    [statusId, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionMaster with the id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated questionmaster: ", { id: id, ...questionmaster });
      result(null, { id: id });
    }
  );
};

QuestionMaster.remove = (id, result) => {
  connection.query(
    "DELETE FROM question_master WHERE id = ?",
    id,
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found QuestionMaster with the id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("deleted questionmaster with id: ", id);
      result(null, res);
    }
  );
};

QuestionMaster.removeAll = (result) => {
  connection.execute("DELETE FROM question_master", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    // console.log(`deleted ${res.affectedRows} question_master`);
    result(null, res);
  });
};

module.exports = QuestionMaster;
