const connection = require("../config/mysql.db.config");

// constructor
const CheatsheetComment = function (cheatsheetComment) {
  this.id = cheatsheetComment.id;
  this.cheatsheet_id = cheatsheetComment.cheatsheet_id;
  this.comment = cheatsheetComment.comment;
  this.reply_to = cheatsheetComment.reply_to;
  this.user_id = cheatsheetComment.user_id;
  this.created_by = cheatsheetComment.created_by;
  // this.created_date = cheatsheetComment.created_date;
  this.modified_by = cheatsheetComment.modified_by;
  // this.modified_date = cheatsheetComment.modified_date;
};

CheatsheetComment.create = (newCheatsheetComment, result) => {
  const query =
    "INSERT INTO cheatsheets_comments (cheatsheet_id, title, comment, reply_to, user_id, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?);";
    
  connection.query(
    query,
    [
      newCheatsheetComment.cheatsheet_id,
      newCheatsheetComment.title || 'cheatsheet',
      newCheatsheetComment.comment,
      newCheatsheetComment.reply_to || null,
      newCheatsheetComment.created_by || null,
      newCheatsheetComment.created_by,
      newCheatsheetComment.modified_by,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      // console.log("created CheatsheetComment: ", {
      //   id: res.insertId,
      //   ...newCheatsheetComment,
      // });
      result(null, { id: res.insertId, ...newCheatsheetComment });
    }
  );
};

CheatsheetComment.getCheatsheetCommentById = async (cheatsheetid, result) => {
  // const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  // const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;
      
  // const limit = Math.max(parseInt(end - start + 1, 10), 1);
  // const offset = Math.max(parseInt(start - 1, 10), 0);
  
  connection.query(
    `SELECT * FROM cheatsheets_comments WHERE cheatsheet_id = ? ORDER BY created_date DESC`,
    [cheatsheetid],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      connection.query(
        "SELECT COUNT(*) as total FROM cheatsheets_comments WHERE cheatsheet_id = ?",
        [cheatsheetid],
        (countErr, countRes) => {
          if (countErr) {
            return result(countErr, null);
          }

          const totalRecords = countRes[0]?.total || 0;
          return result(null, { res, totalRecords });
        }
      );
    }
  );
};

CheatsheetComment.getCommentById = (commentId, result) => {
  connection.query(
    "SELECT * FROM cheatsheets_comments WHERE id = ?",
    [commentId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};

CheatsheetComment.updateById = (id, cheatsheetComment, result) => {
  connection.query(
    "UPDATE cheatsheets_comments SET comment = ?, modified_by = ? WHERE id = ?",
    [
      cheatsheetComment.comment,
      cheatsheetComment.modified_by,
      id
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...cheatsheetComment });
    }
  );
};

CheatsheetComment.remove = (id, result) => {
  connection.query(
    "DELETE FROM cheatsheets_comments WHERE id = ? or reply_to = ?",
    [id,id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

CheatsheetComment.removeReply = (id, result) => {
  connection.query(
    "DELETE FROM cheatsheets_comments WHERE id = ? ",
    [id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

CheatsheetComment.getRepliesByCommentId = (commentId, result) => {
  connection.query(
    "SELECT * FROM cheatsheets_comments WHERE reply_to = ? ORDER BY created_date ASC",
    [commentId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, res);
    }
  );
};

CheatsheetComment.update = (commentsData, result) => {

}

module.exports = CheatsheetComment;