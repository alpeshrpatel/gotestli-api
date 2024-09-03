const connection = require("../config/mysql.db.config");
const logger = require("../logger");

//constructor

function Options(options) {
  this.id = options.id;
  this.question_id = options.question_id;
  this.question_option = options.question_option;
  this.is_correct_answer = options.is_correct_answer;
  this.created_by = options.created_by;
  this.created_date = options.created_date;
  this.modified_by = options.modified_by;
  this.modified_date = options.modified_date;
}

Options.findById = (id, result) => {
  connection.query(
    `SELECT question_option AS options FROM question_options WHERE question_id = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found options: ", res[0]);
        result(null, res);
        return;
      }

      // not found Options with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Options.getAll = (result) => {
  let query = "SELECT * FROM question_options";

  connection.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    logger.info("users: ", res);
    result(null, res);
  });
};

Options.remove = (id, result) => {
  connection.execute(
    "DELETE FROM question_options WHERE id = ?",
    id,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Options with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted Options with id: ", id);
      result(null, res);
    }
  );
};

Options.removeAll = (result) => {
  connection.execute("DELETE FROM question_options", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} options`);
    result(null, res);
  });
};

module.exports = Options;
