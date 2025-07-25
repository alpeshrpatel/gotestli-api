const connection = require("../config/mysql.db.config");

// constructor

const CheatsheetSocial = function (cheatsheetSocial) {
  
  this.cheatsheet_id = cheatsheetSocial.cheatsheet_id;
  this.title = cheatsheetSocial.title;
  this.likes_count = cheatsheetSocial.likes_count;
 
  this.created_by = cheatsheetSocial.created_by;
//   this.created_date = cheatsheetSocial.created_date;
  this.modified_by = cheatsheetSocial.modified_by;
//   this.modified_date = cheatsheetSocial.modified_date;
};

CheatsheetSocial.create = (newCheatsheetSocial, result) => {
  const query =
    "INSERT INTO cheatsheets_likes (cheatsheet_id, title, likes_count, created_by, modified_by) VALUES (?, ?, ?, ?, ?);";
  
  connection.query(
    query,
    [
      newCheatsheetSocial.cheatsheet_id,
      newCheatsheetSocial.title,
      newCheatsheetSocial.likes_count || 0,
      newCheatsheetSocial.created_by,
      newCheatsheetSocial.modified_by ,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      // console.log("created CheatsheetSocial: ", {
      //   id: res.insertId,
      //   ...newCheatsheetSocial,
      // });
      result(null, { id: res.insertId, ...newCheatsheetSocial });
    }
  );
};

CheatsheetSocial.getCheatsheetLikes = async (cheatsheetid, result) => {
 
  connection.query(
    `SELECT title, likes_count FROM cheatsheets_likes where cheatsheet_id = ? `,
    [cheatsheetid],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }
      result(null, res[0] || { title: "", likes_count: 0 });
    }
  );
};

CheatsheetSocial.updateCheatsheetLikes = (cheatsheetid, result) => {
  const query = `UPDATE cheatsheets_likes SET likes_count = likes_count + 1 WHERE cheatsheet_id = ?`;
  
  connection.query(query, [cheatsheetid], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // not found CheatsheetSocial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated CheatsheetSocial: ", { cheatsheetid: cheatsheetid });
    result(null, { cheatsheetid: cheatsheetid });
  });
}

module.exports = CheatsheetSocial;