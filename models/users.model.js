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
  this.org_id = users.org_id;
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

Users.findById = (userid, orgid, result) => {
  console.log('orgid',orgid)
  const query = `SELECT u.*, GROUP_CONCAT(CONCAT(c.id, ':', c.title) SEPARATOR ', ') AS tags 
    FROM users u 
    LEFT JOIN users_preferences up ON u.id = up.user_id
    LEFT JOIN categories c ON up.category_id = c.id  
    WHERE u.id = ?  AND (u.org_id = ? OR u.org_id IS NULL)  GROUP BY u.id;`;

  connection.query(query,[userid,orgid], (err, res) => {
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

Users.findUser = (uid, orgid, result) => {
  const query =
    `SELECT u.*, GROUP_CONCAT(CONCAT(c.id, ':', c.title) SEPARATOR ', ') AS tags ` +
    `FROM users u ` +
    `LEFT JOIN users_preferences up ON u.id = up.user_id ` +
    `LEFT JOIN categories c ON up.category_id = c.id ` +
    `WHERE u.uid = "${uid}" AND u.org_id = ${orgid} GROUP BY u.id;`;

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

Users.getAll = (orgid, result) => {
  let query = `SELECT * FROM users where org_id = ${orgid}`;
  connection.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    logger.info("users: ", res);
    result(null, res);
  });
};

Users.getAllStudentsList = (startPoint,endPoint,search,orgid,result) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  const limit = Math.max(parseInt((end - start) - 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);

  
  let queryString = "";
  let queryParams = "";
  if (search) {
    queryString = `SELECT * FROM users WHERE role ='student' AND is_delete = 0 AND org_id = ? AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?) ORDER BY created_date DESC LIMIT ? OFFSET ?;`;
  } else {
    queryString = `SELECT * FROM users WHERE role ='student' AND is_delete = 0 AND org_id = ? ORDER BY created_date DESC LIMIT ? OFFSET ?;`;
  }
  if (search) {
    const searchTerm = `%${search}%`;
    queryParams = [orgid, searchTerm, searchTerm,searchTerm,searchTerm, limit, offset];
  } else {
    queryParams = [orgid,limit, offset];
  }
  connection.query(
    queryString, queryParams,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (!res.length) {
        result({ kind: "not_found" }, null);
        return;
      }

      let countQuery = ``;
      if (search) {
        countQuery = `SELECT COUNT(*) as total FROM users WHERE role ='student' AND is_delete = 0 AND org_id = ? AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?);`;
      } else {
        countQuery = `SELECT COUNT(*) as total FROM users WHERE role ='student' AND is_delete = 0 AND org_id = ?;`;
      }
      let countParams = [];
      if (search) {
        const searchTerm = `%${search}%`;
        countParams = [orgid,searchTerm, searchTerm, searchTerm, searchTerm];
      } else {
        countParams = [orgid];
      }
      // Fetch total count only when there are results
      connection.query(
        countQuery, countParams,
        (countErr, countRes) => {
          if (countErr) {
            result(countErr, null);
            return;
          }

          const totalRecords = countRes[0]?.total || 0;
          result(null, { res, totalRecords });  // Send response only once
        }
      );
    }
  );

}


Users.getAllInstructorsList = (startPoint,endPoint,search,orgid,result) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  const limit = Math.max(parseInt((end - start) - 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);

  
  let queryString = "";
  let queryParams = "";
  if (search) {
    queryString = `SELECT * FROM users WHERE role ='instructor' AND is_delete = 0 AND org_id = ? AND  (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?) ORDER BY created_date DESC LIMIT ? OFFSET ?;`;
  } else {
    queryString = `SELECT * FROM users WHERE role ='instructor' AND is_delete = 0 AND org_id = ? ORDER BY created_date DESC LIMIT ? OFFSET ?;`;
  }
  if (search) {
    const searchTerm = `%${search}%`;
    queryParams = [ orgid,searchTerm, searchTerm,searchTerm,searchTerm, limit, offset];
  } else {
    queryParams = [orgid,limit, offset];
  }
  connection.query(
    queryString, queryParams,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (!res.length) {
        result({ kind: "not_found" }, null);
        return;
      }

      let countQuery = ``;
      if (search) {
        countQuery = `SELECT COUNT(*) as total FROM users WHERE role ='instructor' AND is_delete = 0 AND org_id = ? AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?);`;
      } else {
        countQuery = `SELECT COUNT(*) as total FROM users WHERE role ='instructor' AND is_delete = 0 AND org_id = ?;`;
      }
      let countParams = [];
      if (search) {
        const searchTerm = `%${search}%`;
        countParams = [orgid,searchTerm, searchTerm, searchTerm, searchTerm];
      } else {
        countParams = [orgid];
      }
      // Fetch total count only when there are results
      connection.query(
        countQuery, countParams,
        (countErr, countRes) => {
          if (countErr) {
            result(countErr, null);
            return;
          }

          const totalRecords = countRes[0]?.total || 0;
          result(null, { res, totalRecords });  // Send response only once
        }
      );
    }
  );

}

Users.updateUser = (userid, users, orgid, result) => {
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
      "phone= ?, profile_pic= ? , modified_date = ? " +
      "WHERE id = ? AND org_id = ?",
    [
      users.first_name,
      users.last_name,
      users.email,
      users.company,
      users.phone,
      users.profile_pic,
      modified_date,
      userid,
      orgid,
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
