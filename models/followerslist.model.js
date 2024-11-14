const connection = require("../config/mysql.db.config");

// constructor
const FollowersList = function (followersList) {
  // this.id = FollowersList.id;
  this.user_id = followersList.instructor_id;
  this.category_id = followersList.follower_id;
  // this.created_by = FollowersList.created_by;
  // this.created_date = FollowersList.created_date;
  // this.modified_by = FollowersList.modified_by;
  // this.modified_date = FollowersList.modified_date;
};

// FollowersList.create = (newFollowersList, result) => {
//   const query = " INSERT INTO users_preferences (user_id, category_id, created_by, created_date, modified_by, modified_date) VALUES ?";
//   connection.query(query, [newFollowersList], (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     console.log("created FollowersList: ", { id: res.insertId, ...newFollowersList });
//     result(null, { id: res.insertId, ...newFollowersList });
//   });
// };

FollowersList.create = (newFollowersList, createdDate, result) => {
  const query =
    "INSERT INTO followers_list (instructor_id, follower_id, date) values (? , ? , ?); ";
  connection.query(
    query,
    [newFollowersList.instructor_id, newFollowersList.follower_id, createdDate],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }

      console.log("created FollowersList: ", {
        id: res.insertId,
        ...newFollowersList,
      });
      result(null, { id: res.insertId, ...newFollowersList });
    }
  );
};

FollowersList.getCategoriesByUserId = async (user_id, result) => {
  connection.query(
    `select category_id from users_preferences where user_id = ${user_id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found categories: ", res);
        result(null, res);
        return;
      }

      // not found QuestionSet with the id
      result({ kind: "not_found" }, null);
    }
  );
};

FollowersList.findById = async (user_id, result) => {
  connection.query(
    `select * from followers_list where follower_id = ${user_id}`,
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

FollowersList.getFollowerDetail = async (user_id, result) => {
  connection.query(
    `SELECT * FROM followers_list fl JOIN users u ON fl.follower_id = u.id WHERE fl.instructor_id = ${user_id}`,
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

FollowersList.remove = (instructor_id, follower_id, result) => {
  connection.query(
    `DELETE FROM followers_list WHERE instructor_id= ${instructor_id} and follower_id = ${follower_id};`,

    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found FollowersList with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted FollowersList ");
      result(null, res);
    }
  );
};

FollowersList.removeAll = (result) => {
  connection.query("DELETE FROM question_set_categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} question_set`);
    result(null, res);
  });
};

module.exports = FollowersList;
