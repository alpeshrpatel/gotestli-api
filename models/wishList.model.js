const connection = require("../config/mysql.db.config");

// constructor
const WishList = function (wishList) {
  this.questionset_id = wishList.questionset_id;
  this.user_id = wishList.user_id;
  this.created_by = wishList.created_by;
  this.modified_by = wishList.modified_by

};

WishList.create = (newWishList, result) => {
  const query =
    "INSERT INTO wishlist (questionset_id,user_id,created_by,modified_by) values (?,?,?,?); ";
  connection.query(
    query,
    [newWishList.questionset_id,newWishList.user_id,newWishList.user_id,newWishList.user_id],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }

      console.log("created WishList: ", {
        id: res.insertId,
        ...newWishList,
      });
      result(null, { id: res.insertId, ...newWishList });
    }
  );
};



WishList.findById = async (id, result) => {
  connection.query(
    `select * from wishlist where user_id = ${id}`,
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



WishList.remove = (qsetid, id, result) => {
    console.log("Attempting to delete with:", { questionset_id: qsetid, user_id: id });
    connection.query(
      `DELETE FROM wishlist WHERE questionset_id = ? AND user_id = ?`,
      [qsetid, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        console.log(`deleted ${res.affectedRows} wishlist items`);
        result(null, res);
      }
    );
  };

module.exports = WishList;