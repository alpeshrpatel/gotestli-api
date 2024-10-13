const connection = require("../config/mysql.db.config");

// constructor
const ContactMessages = function (contactMessages) {
 
  this.name = contactMessages.name;
  this.email = contactMessages.email;
  this.message = contactMessages.message
 
};

ContactMessages.create = (newContactMessages, result) => {
  const query =
    "INSERT INTO contact_messages (name, email, message) values (? , ? , ?); ";
  connection.query(
    query,
    [newContactMessages.name, newContactMessages.email, newContactMessages.message],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }

      console.log("created ContactMessages: ", {
        id: res.insertId,
        ...newContactMessages,
      });
      result(null, { id: res.insertId, ...newContactMessages });
    }
  );
};



ContactMessages.findById = async (id, result) => {
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



ContactMessages.removeAll = (result) => {
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

module.exports = ContactMessages;
