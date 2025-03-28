const connection = require("../config/mysql.db.config");


// constructor
const WhiteListedQSet = function (whiteListedQSet) {
  this.questionset_id = whiteListedQSet.questionset_id;
  this.user_id = whiteListedQSet.user_id;
  this.is_demo = whiteListedQSet.is_demo;
  this.ins_id = whiteListedQSet.ins_id;
  this.created_by = whiteListedQSet.created_by;
  this.modified_by = whiteListedQSet.modified_by

};

WhiteListedQSet.create = (newWhiteListedQSet, result) => {
  const query =
    "INSERT INTO whitelisted_questionset (questionset_id,is_demo,user_id,ins_id,created_by,modified_by) values (?,?,?,?,?,?); ";
  connection.query(
    query,
    [newWhiteListedQSet.questionset_id,1,newWhiteListedQSet.user_id,newWhiteListedQSet.ins_id,newWhiteListedQSet.user_id,newWhiteListedQSet.user_id],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newWhiteListedQSet });
    }
  );
};

WhiteListedQSet.getMyPurchases = async (id, result) => {
    connection.query(
      `SELECT * FROM whitelisted_questionset wq JOIN question_set qs ON wq.questionset_id = qs.id WHERE user_id = ${id} ORDER BY wq.created_date DESC;
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
  
        // not found user with the id
        result({ kind: "not_found" }, null);
      }
    );
  };

module.exports = WhiteListedQSet;