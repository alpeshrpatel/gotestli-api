const connection = require("../config/mysql.db.config");
const logger = require("../logger");
// constructor
const Users = function(users) {
    
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
    this.uid = users.uid

};

Users.create = (newuser, result) => {
  connection.query("INSERT INTO users SET ?", newuser, (err, res) => {
    if (err) {
      console.log("error= ", err);
      result(err, null);
      return;
    }

    console.log("created users: ", { id: res.insertId, ...newuser });
    result(null, { id: res.insertId, ...newuser });
  });
};

Users.findById = (id, result) => {
  connection.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found users: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found users with the id
    result({ kind: "not_found" }, null);
  });
};


Users.getAll = ( result) => {
  let query = "SELECT * FROM users";
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


// users.updateById = (id, users, result) => {
//   sql.query(
//     "UPDATE categories SET org_id= ?, question_set_url= ? ," + 
//             "image= ? ," + 
//             "short_desc= ? , description= ? ," + 
//             "start_time= ? , end_time= ? ," + 
//             "start_date= ? , end_date= ? ," + 
//             "time_duration= ? , no_of_question= ? ," + 
//             "status_id= ? , is_demo= ? " + 
//             "WHERE id = ?",
//     [ 
//       users.org_id, users.question_set_url, users.image, 
//       users.short_desc, users.description, users.start_time ,
//       users.end_time, users.start_date, users.end_date ,
//       users.time_duration, users.no_of_question, users.status_id ,
//       users.is_demo ,
//       id
//     ],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found users with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("updated users: ", { id: id, ...users });
//       result(null, { id: id, ...users });
//     }
//   );
// };

Users.remove = (id, result) => {
  connection.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found users with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted users with id: ", id);
    result(null, res);
  });
};

Users.removeAll = result => {
  connection.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

module.exports = Users;
