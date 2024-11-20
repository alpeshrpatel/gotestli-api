const connection = require("../config/mysql.db.config");
const logger = require("../logger");
const generateDateTime = require("../utils/util");
// constructor
const Users = function (users) {
  this.ip_address = users.ip_address;
  this.username = users.username;
  this.password = users.password;
  this.email = users.email;
  this.activation_selector = users.activation_selector;
  this.activation_code = users.activation_code;
  this.forgotten_password_selector = users.forgotten_password_selector;
  this.forgotten_password_code = users.forgotten_password_code;
  this.forgotten_password_time = users.forgotten_password_time;
  this.remember_selector = users.remember_selector;
  this.remember_code = users.remember_code;
  this.created_on = users.created_on;
  this.last_login = users.last_login;
  this.active = users.active;
  this.first_name = users.first_name;
  this.last_name = users.last_name;
  this.company = users.company;
  this.phone = users.phone;
  // this.profile_pic = users.profile_pic;
  // this.created_by = users.created_by;
  // this.created_date = users.created_date;
  // this.modified_by = users.modified_by;
  // this.modified_date = users.modified_date;
  this.is_delete = users.is_delete;
  this.uid = users.uid;
  this.role = users.role;
  this.provider = users.provider;
};

Users.create = (newuser, result) => {
  connection.query("INSERT INTO users SET ?", newuser, (err, res) => {
    if (err) {
       // console.log("error= ", err);
      result(err, null);
      return;
    }

     // console.log("created users: ", { id: res.insertId, ...newuser });
    result(null, { id: res.insertId, ...newuser });
  });
};

Users.findById = (userid, result) => {
  const query =
    `SELECT u.*, GROUP_CONCAT(CONCAT(c.id, ':', c.title) SEPARATOR ', ') AS tags ` +
    `FROM users u ` +
    `LEFT JOIN users_preferences up ON u.id = up.user_id ` +
    `LEFT JOIN categories c ON up.category_id = c.id ` +
    `WHERE u.id = "${userid}" GROUP BY u.id;`;

  connection.query(query, (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

    if (res.length) {
       // console.log("found users: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found users with the id
    result({ kind: "not_found" }, null);
  });
};

Users.findUser = (uid, result) => {
  const query =
    `SELECT u.*, GROUP_CONCAT(CONCAT(c.id, ':', c.title) SEPARATOR ', ') AS tags ` +
    `FROM users u ` +
    `LEFT JOIN users_preferences up ON u.id = up.user_id ` +
    `LEFT JOIN categories c ON up.category_id = c.id ` +
    `WHERE u.uid = "${uid}" GROUP BY u.id;`;

  connection.query(query, (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

    if (res.length) {
       // console.log("found users: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found users with the id
    result({ kind: "not_found" }, null);
  });
};

Users.getAll = (result) => {
  let query = "SELECT * FROM users";
  connection.query(query, (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

    logger.info("users: ", res);
    result(null, res);
  });
};

Users.updateUser = (userid, users, result) => {
  // first_name: data.first_name || "",
  // last_name: data.last_name || "",
  // role: data.role || "",
  // email: data.email || "",
  // company: data.company || "",
  // phone: data.phone || "",
  const modified_date = generateDateTime();
  connection.query(
    "UPDATE users SET first_name= ?, last_name= ?, " +
      "email= ? , company= ?, " +
      "phone= ? , modified_date = ? " +
      "WHERE id = ?",
    [
      users.first_name,
      users.last_name,
      users.email,
      users.company,
      users.phone,
      modified_date,
      userid,
    ],
    (err, res) => {
      if (err) {
         
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found users with the id
        result({ kind: "not_found" }, null);
        return;
      }

       // console.log("updated users: ", { id: userid, ...users });
      result(null, { id: userid, ...users });
    }
  );
};

Users.remove = (id, result) => {
  connection.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found users with the id
      result({ kind: "not_found" }, null);
      return;
    }

     // console.log("deleted users with id: ", id);
    result(null, res);
  });
};

Users.removeAll = (result) => {
  connection.query("DELETE FROM users", (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

     // console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

module.exports = Users;
