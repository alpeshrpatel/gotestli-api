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

Comments.getCommentsById = async (type,id,startPoint,endPoint, result) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  
  const limit = Math.max(parseInt(end - start + 1, 10), 1);
const offset = Math.max(parseInt(start - 1, 10), 0);
  connection.query(
    `SELECT * FROM comments WHERE entity_type = ? AND entity_id = ? ORDER BY created_date DESC LIMIT ? OFFSET ?`,
    [type, id, limit, offset],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      connection.query(
        "SELECT COUNT(*) as total FROM comments WHERE entity_id = ?",
        [id],
        (countErr, countRes) => {
          if (countErr) {
            return result(countErr, null);
          }

          const totalRecords = countRes[0]?.total || 0;
          return result(null, { res, totalRecords });
        }
      );

      // result({ kind: "not_found" }, null);
    }
  );
};


module.exports = Comments;