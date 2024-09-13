const connection = require("../config/mysql.db.config");

// constructor
const UsersPreferences = function(usersPreferences){
    // this.id = UsersPreferences.id;
    this.user_id = usersPreferences.user_id;
    this.category_id = usersPreferences.category_id;
    // this.created_by = UsersPreferences.created_by;
    // this.created_date = UsersPreferences.created_date;
    // this.modified_by = UsersPreferences.modified_by;
    // this.modified_date = UsersPreferences.modified_date;
    }

// UsersPreferences.create = (newUsersPreferences, result) => {
//   const query = " INSERT INTO users_preferences (user_id, category_id, created_by, created_date, modified_by, modified_date) VALUES ?";
//   connection.query(query, [newUsersPreferences], (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     console.log("created UsersPreferences: ", { id: res.insertId, ...newUsersPreferences });
//     result(null, { id: res.insertId, ...newUsersPreferences });
//   });
// };

UsersPreferences.create = (newUsersPreferences, result) => {
    
    const query = `
      INSERT INTO users_preferences (user_id, category_id, created_by, created_date, modified_by, modified_date)
      SELECT ?, ?, ?, ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM users_preferences WHERE user_id = ? AND category_id = ?
      )
    `;
    console.log("userid delete " + newUsersPreferences[0][0])
    connection.query('DELETE from users_preferences where user_id = ? ',newUsersPreferences[0][0],(err,res) => {
      if (err) {
        console.log("error: ", err);
       
      }
  
      console.log("deleted UsersPreferences with id: ");
     
    })
    
    const insertUserPreference = (index) => {
      if (index >= newUsersPreferences.length) {
        console.log("All inserts completed");
        result(null, { message: "All inserts completed successfully" });
        return;
      }
  
      const [ user_id, category_id, created_by, created_date, modified_by, modified_date ] = newUsersPreferences[index];
  
      
      connection.query(
        query,
        [user_id, category_id, created_by, created_date, modified_by, modified_date, user_id, category_id],
        (err, res) => {
          if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;  
          }
  
          console.log(`Inserted/Skipped UserPreference for user_id ${user_id}, category_id ${category_id}`);
          insertUserPreference(index + 1);
        }
      );
    };
  
    insertUserPreference(0);
  };
  

UsersPreferences.getCategoriesByUserId = async (user_id, result) => {
    connection.query(`select category_id from users_preferences where user_id = ${user_id}`, (err, res) => {
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
    });
   
  };

  UsersPreferences.findById = async (user_id, result) => {
    connection.query(`select * from users_preferences where user_id = ${user_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found user with the id
      result({ kind: "not_found" }, null);
    });
   
  };



UsersPreferences.remove = (id, result) => {
  connection.query("DELETE FROM question_set_categories WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found UsersPreferences with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted UsersPreferences with id: ", id);
    result(null, res);
  });
};

UsersPreferences.removeAll = result => {
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

module.exports = UsersPreferences;
