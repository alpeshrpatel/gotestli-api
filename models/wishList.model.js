const connection = require("../config/mysql.db.config");

// constructor
const WishList = function (wishList) {
  this.questionset_id = wishList.questionset_id;
  this.user_id = wishList.user_id;
  this.created_by = wishList.created_by;
  this.modified_by = wishList.modified_by;
};

WishList.create = (newWishList, result) => {
  const query =
    "INSERT INTO wishlist (questionset_id,user_id,created_by,modified_by) values (?,?,?,?); ";
  connection.query(
    query,
    [
      newWishList.questionset_id,
      newWishList.user_id,
      newWishList.user_id,
      newWishList.user_id,
    ],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      // console.log("created WishList: ", {
      //   id: res.insertId,
      //   ...newWishList,
      // });
      result(null, { id: res.insertId, ...newWishList });
    }
  );
};

WishList.findById = async (id, startPoint, endPoint, search, result) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

  const limit = Math.max(parseInt(end - start + 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);

  let queryString = "";
  let queryParams = "";
  if (search) {
    queryString = `SELECT qs.*
FROM wishlist w
JOIN question_set qs ON w.questionset_id = qs.id
WHERE w.user_id = ? AND (qs.title LIKE ? OR qs.short_desc LIKE ?) order by w.created_date desc LIMIT ? OFFSET ?;`;
  } else {
    queryString = `SELECT qs.*
FROM wishlist w
JOIN question_set qs ON w.questionset_id = qs.id
WHERE w.user_id = ? order by w.created_date desc LIMIT ? OFFSET ?;`;
  }
  if (search) {
    const searchTerm = `%${search}%`;
    queryParams = [id, searchTerm, searchTerm, limit, offset];
  } else {
    queryParams = [id, limit, offset];
  }
  connection.query(queryString, queryParams, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    let countQuery = ``;
    if (search) {
      countQuery = `SELECT COUNT(*) as total FROM wishlist w JOIN question_set qs ON w.questionset_id = qs.id WHERE w.user_id = ? AND (qs.title LIKE ? OR qs.short_desc LIKE ?)`;
    } else {
      countQuery = `SELECT COUNT(*) as total FROM wishlist WHERE user_id = ?`;
    }
    let countParams = [];
    if (search) {
      const searchTerm = `%${search}%`;
      countParams = [id, searchTerm, searchTerm];
    } else {
      countParams = [id];
    }
    connection.query(countQuery, countParams, (countErr, countRes) => {
      if (countErr) {
        result(countErr, null);
        return;
      }
      const totalRecords = countRes[0]?.total || 0;
      result(null, { res, totalRecords });
    });

    // not found user with the id
    // result({ kind: "not_found" }, null);
  });
};

WishList.getQsetId = async (id, result) => {
  connection.query(
    `SELECT * FROM wishlist WHERE user_id = ${id};
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

WishList.remove = (qsetid, id, result) => {
  // console.log("Attempting to delete with:", { questionset_id: qsetid, user_id: id });
  connection.query(
    `DELETE FROM wishlist WHERE questionset_id = ? AND user_id = ?`,
    [qsetid, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      // console.log(`deleted ${res.affectedRows} wishlist items`);
      result(null, res);
    }
  );
};

module.exports = WishList;
