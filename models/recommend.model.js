// const connection = require("../config/mysql.db.config");
// const { logger } = require("../logger");

// const getVectorDBDimension = (result) => {
//   connection.query(`SELECT title,author,short_desc,description,tags FROM question_set`, (err, res) => {
//     if (err) {
       
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//        // console.log("found review: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     // not found QuestionSet with the id
//     result({ kind: "not_found" }, null);
//   });
// };

// module.exports = {getVectorDBDimension};

const connection = require("../config/mysql.db.config");

const getVectorDBDimension = async () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT  id,title, author, short_desc, description, tags FROM question_set `,
      
      (err, res) => {
        if (err) return reject(err);
        if (res.length === 0) return reject({ kind: "not_found" });
        resolve(res);
      }
    );
  });
};

const getUsersVectorDBDimension = async () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT u.first_name as first_name, u.last_name as last_name,u.email as email, GROUP_CONCAT(CONCAT(c.title) SEPARATOR ', ') AS tags ` +
    `FROM users u ` +
    `LEFT JOIN users_preferences up ON u.id = up.user_id ` +
    `LEFT JOIN categories c ON up.category_id = c.id ` +
    ` GROUP BY u.id; `,
      
      (err, res) => {
        if (err) return reject(err);
        if (res.length === 0) return reject({ kind: "not_found" });
        resolve(res);
      }
    );
  });
};

    

module.exports = { getVectorDBDimension,getUsersVectorDBDimension };
