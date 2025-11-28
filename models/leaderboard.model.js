const connection = require("../config/mysql.db.config");

// constructor
const Leaderboard = function (leaderboard) {
  this.user_id = leaderboard.user_id;
  this.user_name = leaderboard.user_name;
  this.game_pin = leaderboard.game_pin;
  this.quiz_id = leaderboard.quiz_id;
  this.total_score = leaderboard.total_score;
  this.total_time_taken = leaderboard.total_time_taken;
  this.rank_position = leaderboard.rank_position;
  this.badges_earned = leaderboard.badges_earned;
  this.created_by = leaderboard.created_by;
  this.modified_by = leaderboard.modified_by;
 
};

Leaderboard.create = (newLeaderboard, result) => {
  const query = `
    INSERT INTO leaderboard 
    (user_id, user_name, game_pin, quiz_id, total_score, total_time_taken, rank_position, badges_earned, created_by, modified_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    newLeaderboard.user_id,
    newLeaderboard.user_name,
    newLeaderboard.game_pin,
    newLeaderboard.quiz_id,
    newLeaderboard.total_score || 0,  
    newLeaderboard.total_time_taken,
    newLeaderboard.rank_position,
    newLeaderboard.badges_earned,
    newLeaderboard.created_by,
    newLeaderboard.modified_by
  ];

  connection.query(query, values, (error, res) => {
    if (error) {
      console.error("Error inserting Leaderboard:", error);
      return result(error, null);
    }
    console.log("Score in Leaderboard inserted successfully:", res);
    result(null, { id: res.insertId, ...newLeaderboard });
  });
};

Leaderboard.findById = async (id, result) => {
  connection.query(
    `SELECT * FROM leaderboard where quiz_id = ${id} ORDER BY created_date DESC;
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

Leaderboard.updateApproval = async (status, id, result) => {
  connection.query(
    `UPDATE Leaderboard SET status = ? WHERE id = ?;
  `,
    [status, id],
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

module.exports = Leaderboard;
