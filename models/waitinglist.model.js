const connection = require("../config/mysql.db.config");

// constructor
const WaitingList = function (waitingList) {
  this.email = waitingList.email;
};

WaitingList.create = (newWaitingList, result) => {
  const query =
    "INSERT INTO waiting_list (email) values (?); ";
  connection.query(
    query,
    [newWaitingList.email],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }

      console.log("created WaitingList: ", {
        id: res.insertId,
        ...newWaitingList,
      });
      result(null, { id: res.insertId, ...newWaitingList });
    }
  );
};



WaitingList.findById = async (id, result) => {
  connection.query(
    `select * from contact_messages where id = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found user: ", res);
        result(null, res);
        return;
      }

      // not found user with the id
      result({ kind: "not_found" }, null);
    }
  );
};



WaitingList.removeAll = (result) => {
  connection.query("DELETE FROM contact_messages", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} question_set`);
    result(null, res);
  });
};

module.exports = WaitingList;