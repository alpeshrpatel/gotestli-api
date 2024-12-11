const connection = require("../config/mysql.db.config");

// constructor
const Comments = function (comments) {
  this.entity_type = comments.entity_type
  this.entity_id = comments.entity_id;
  this.user_id = comments.user_id;
  this.comment = comments.comment;
};

Comments.create = (newComments, result) => {
  const query =
    "INSERT INTO comments (entity_type,entity_id,user_id,comment,created_by,modified_by) values (?,?,?,?,?,?); ";
  connection.query(
    query,
    [newComments.entity_type,newComments.entity_id,newComments.user_id,newComments.comment,newComments.user_id,newComments.user_id],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

       // console.log("created Comments: ", {
      //   id: res.insertId,
      //   ...newComments,
      // });
      result(null, { id: res.insertId, ...newComments });
    }
  );
};

Comments.getCommentsById = async (type,id, result) => {
  connection.query(
    `SELECT * FROM comments WHERE entity_type = ? AND entity_id = ? ORDER BY created_date DESC`,
    [type, id],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
         // console.log("found user: ", res);
        result(null, res);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};


module.exports = Comments;