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
  const query = `
  INSERT INTO question_master (
    org_id, question, description, explanation, paragraph_id, question_type_id, 
    status_id, complexity, marks, is_negative, negative_marks, created_by, modified_by
  )
  VALUES (0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    explanation = VALUES(explanation),
    paragraph_id = VALUES(paragraph_id),
    question_type_id = VALUES(question_type_id),
    status_id = VALUES(status_id),
    complexity = VALUES(complexity),
    marks = VALUES(marks),
    is_negative = VALUES(is_negative),
    negative_marks = VALUES(negative_marks),
    modified_by = VALUES(modified_by);
`;

  // const query = `INSERT INTO question_master (org_id, question, description,explanation,paragraph_id,question_type_id,status_id,complexity,marks,is_negative,negative_marks, created_by, modified_by) VALUES (0, ?,?, ?, ?, ?,?,?,?,?,?,?,?)`;
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

QuestionMaster.findById = (id, orgid, result) => {
  connection.execute(
    `SELECT question, explanation FROM question_master WHERE id = ${id} AND org_id = ${orgid}`,
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

QuestionMaster.findParagraph = (id, orgid, result) => {
  connection.execute(
    `SELECT paragraph FROM question_paragraph WHERE id = ${id} and org_id = ${orgid}`,
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
// QuestionMaster.findDetailedQuestion = (id, startPoint, endPoint, result) => {
//     const start = parseInt(startPoint) || 1;
//     const end = parseInt(endPoint) || 10;
//     const limit = end - start + 1;

//   connection.execute(
//     `SELECT
//     qm.id AS id,
//     qm.question AS question,
//     qm.description AS description,
//     qm.explanation AS explanation,
//     qm.paragraph_id AS paragraph_id,
//     qm.question_type_id AS question_type_id,
//     qm.status_id AS status_id,
//     qm.complexity AS complexity,
//     qm.marks AS marks,
//     qm.negative_marks AS negative_marks,
//     qm.is_negative AS is_negative,
//     qp.paragraph AS paragraph
// FROM
//     question_master qm
// JOIN
//     question_paragraph qp
// ON
//     qm.paragraph_id = qp.id
// WHERE
//     qm.created_by = ${id} LIMIT ${limit} OFFSET ${start-1};
// `,
//   async (err, res) => {
//       if (err) {
//         result(err, null);
//         return;
//       }
//       const [countResult] = await connection.execute("SELECT COUNT(*) as total FROM your_table_name");
//       const totalRecords = countResult[0].total;
//       if (res.length) {
//         result(null,  res.json({
//           data: res,
//           totalRecords
//       }));
//         return;
//       }

//       result({ kind: "not_found" }, null);
//     }
//   );
// };
QuestionMaster.findDetailedQuestion = (
  id,
  startPoint,
  endPoint,
  orgid,
  result
) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  const limit = Math.max(parseInt(end - start + 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);

  connection.query(
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
    qp.paragraph AS paragraph,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'option_id', qo.id,
            'options', qo.question_option,
            'correctAnswer', qo.is_correct_answer
        )
    ) AS options
FROM
    question_master qm
JOIN
    question_paragraph qp ON qm.paragraph_id = qp.id
LEFT JOIN
    question_options qo ON qm.id = qo.question_id AND qo.org_id = ?
WHERE
    qm.created_by = ? AND qm.org_id = ?
GROUP BY
    qm.id
LIMIT ? OFFSET ?;`,
[orgid, id, orgid, limit, offset],
    async (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      try {
        // const [countResult] = await connection.execute(
        //   "SELECT COUNT(*) as total FROM question_master WHERE created_by = ?",
        //   [id]
        // );
        // const totalRecords = countResult[0].total;
        connection.query(
          "SELECT COUNT(*) as total FROM question_master WHERE created_by = ? and org_id = ?",
          [id, orgid],
          (countErr, countRes) => {
            if (countErr) {
              result(countErr, null);
              return;
            }

            const totalRecords = countRes[0]?.total || 0;
            result(null, { res, totalRecords });
          }
        );

        // result(null, {
        //   data: res,
        //   totalRecords,
        // });
      } catch (error) {
        result(error, null);
      }
    }
  );
};

// QuestionMaster.findAll = (userid,startPoint,endPoint, result) => {
//   const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
//   const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

//   const limit = Math.max(parseInt(end - start + 1, 10), 1);
// const offset = Math.max(parseInt(start - 1, 10), 0);

//   // let query = `SELECT * FROM question_master where created_by = ? LIMIT ? OFFSET ?`;
//   //  // console.log("tags : " + tags);
//   // tags = req.params.id;
//   // if (tags) {
//   //   query += ` WHERE tags LIKE '%${tags}%'`;
//   // }
//   // console.log("findAll : " + query)
//   connection.query(`SELECT * FROM question_master where created_by = ? LIMIT ? OFFSET ?`,[userid,limit,offset], (err, res) => {
//     if (err) {
//       result(null, err);
//       return;
//     }

//     //  // console.log("question_master: ", res);
//     // result(null, res);
//     connection.query(
//       "SELECT COUNT(*) as total FROM question_master WHERE created_by = ?",
//       [userid],
//       (countErr, countRes) => {
//           if (countErr) {
//               result(countErr, null);
//               return;
//           }

//           const totalRecords = countRes[0]?.total || 0;
//           result(null, {  res, totalRecords });
//       }
//   );
//   });
// };
QuestionMaster.findAll = (
  userid,
  startPoint,
  endPoint,
  search,
  complexity,
  status,
  categoryId,
  orgid,
  result
) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  const limit = Math.max(parseInt(end - start + 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);

  let query =
    "SELECT * FROM question_master WHERE created_by = ? AND org_id = ?";
  const queryParams = [userid, orgid];

  if (status !== undefined) {
    query += " AND status_id = ?";
    queryParams.push(status);
  }

  if (complexity) {
    const complexityLevels = complexity.split(":").filter((level) => level);

    if (complexityLevels.length > 0) {
      query += " AND (";
      const complexityConditions = [];

      complexityLevels.forEach((level, index) => {
        complexityConditions.push("complexity = ?");
        queryParams.push(level);
      });

      query += complexityConditions.join(" OR ");
      query += ")";
    }
  }

  if (categoryId) {
    query += " AND category_id = ?";
    queryParams.push(categoryId);
  }

  if (search) {
    query += " AND (question LIKE ? OR description LIKE ?)";
    const searchTerm = `%${search}%`;
    queryParams.push(searchTerm, searchTerm);
  }

  query += " ORDER BY created_date DESC LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  connection.query(query, queryParams, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    let countQuery =
      "SELECT COUNT(*) as total FROM question_master WHERE created_by = ? AND org_id = ?";
    const countParams = [userid, orgid];

    if (status !== undefined) {
      countQuery += " AND status_id = ?";
      countParams.push(parseInt(status));
    }

    if (complexity) {
      const complexityLevels = complexity.split(":").filter((level) => level);

      if (complexityLevels.length > 0) {
        countQuery += " AND (";
        const complexityConditions = [];

        complexityLevels.forEach((level, index) => {
          complexityConditions.push("complexity = ?");
          countParams.push(level);
        });

        countQuery += complexityConditions.join(" OR ");
        countQuery += ")";
      }
    }

    if (categoryId) {
      countQuery += " AND category_id = ?";
      countParams.push(categoryId);
    }

    if (search) {
      countQuery += " AND (question LIKE ? OR description LIKE ?)";
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    connection.query(countQuery, countParams, (countErr, countRes) => {
      if (countErr) {
        result(countErr, null);
        return;
      }

      const totalRecords = countRes[0]?.total || 0;
      result(null, { res, totalRecords });
    });
  });
};
QuestionMaster.updateById = (id, questionmaster,orgid, result) => {
  connection.execute(
    "UPDATE question_master SET " +
      "org_id = ?, question = ?, description = ?, explanation = ?, " +
      "paragraph_id = ?, question_type_id = ?, status_id = ?, complexity = ?, " +
      "marks = ?, is_negative = ?, negative_marks = ? " +
      "WHERE id = ? AND org_id = ?",
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
      id,orgid
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

QuestionMaster.updateStatusById = (id, statusId,orgid, result) => {
  connection.execute(
    "UPDATE question_master SET status_id= ? WHERE id = ? and org_id = ?",
    [statusId, id, orgid],
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
