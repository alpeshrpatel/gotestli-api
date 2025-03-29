const connection = require("../config/mysql.db.config");


// constructor
const UserPurchases = function (userPurchases) {
  this.questionset_id = userPurchases.questionset_id;
  this.user_id = userPurchases.user_id;
  this.is_demo = userPurchases.is_demo;
  this.instructor_id = userPurchases.instructor_id;
  this.created_by = userPurchases.created_by;
  this.modified_by = userPurchases.modified_by

};

UserPurchases.create = (newUserPurchases, result) => {
  const query =
    "INSERT INTO user_purchases (questionset_id,is_demo,user_id,instructor_id,created_by,modified_by) values (?,?,?,?,?,?); ";
  connection.query(
    query,
    [newUserPurchases.questionset_id,1,newUserPurchases.user_id,newUserPurchases.ins_id,newUserPurchases.user_id,newUserPurchases.user_id],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newUserPurchases });
    }
  );
};

UserPurchases.getMyPurchases = async (id, result) => {
    connection.query(
      `SELECT * FROM user_purchases up JOIN question_set qs ON up.questionset_id = qs.id WHERE user_id = ${id} ORDER BY up.created_date DESC;
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

module.exports = UserPurchases;