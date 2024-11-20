const connection = require("../config/mysql.db.config");
const { logger } = require("../logger");
const generateDateTime = require("../utils/util");

// constructor
const Reviews = function (reviews) {
  this.questionset_id = reviews.questionset_id;
  this.satisfaction = reviews.satisfaction;
  this.difficulty = reviews.difficulty;
  this.content_quality = reviews.content_quality;
  this.review = reviews.review;
  this.created_by = reviews.created_by;
  this.modified_by = reviews.modified_by;
};

Reviews.create = (newReviews, result) => {
  connection.query("INSERT INTO reviews SET ?", newReviews, (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

     // console.log("created Reviews: ", {
    //   id: res.insertId,
    //   ...newReviews,
    // });
    result(null, { id: res.insertId, ...newReviews });
  });
};


Reviews.getRating = async (id, result) => {
  const query = `SELECT 
  -- Calculate overall average rating across the three parameters
  (difficulty_rating + content_quality_rating + satisfaction_rating) / 3 AS rating
FROM (
  SELECT
    -- Calculate weighted average rating for difficulty using the correct formula
    (
      (5 * SUM(CASE WHEN difficulty = 5 THEN 1 ELSE 0 END) +
       4 * SUM(CASE WHEN difficulty = 4 THEN 1 ELSE 0 END) +
       3 * SUM(CASE WHEN difficulty = 3 THEN 1 ELSE 0 END) +
       2 * SUM(CASE WHEN difficulty = 2 THEN 1 ELSE 0 END) +
       1 * SUM(CASE WHEN difficulty = 1 THEN 1 ELSE 0 END)
      ) / 
      (SUM(CASE WHEN difficulty = 5 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN difficulty = 4 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN difficulty = 3 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN difficulty = 2 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN difficulty = 1 THEN 1 ELSE 0 END))
    ) AS difficulty_rating,

    -- Calculate weighted average rating for content_quality using the correct formula
    (
      (5 * SUM(CASE WHEN content_quality = 5 THEN 1 ELSE 0 END) +
       4 * SUM(CASE WHEN content_quality = 4 THEN 1 ELSE 0 END) +
       3 * SUM(CASE WHEN content_quality = 3 THEN 1 ELSE 0 END) +
       2 * SUM(CASE WHEN content_quality = 2 THEN 1 ELSE 0 END) +
       1 * SUM(CASE WHEN content_quality = 1 THEN 1 ELSE 0 END)
      ) / 
      (SUM(CASE WHEN content_quality = 5 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN content_quality = 4 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN content_quality = 3 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN content_quality = 2 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN content_quality = 1 THEN 1 ELSE 0 END))
    ) AS content_quality_rating,

    -- Calculate weighted average rating for satisfaction using the correct formula
    (
      (5 * SUM(CASE WHEN satisfaction = 5 THEN 1 ELSE 0 END) +
       4 * SUM(CASE WHEN satisfaction = 4 THEN 1 ELSE 0 END) +
       3 * SUM(CASE WHEN satisfaction = 3 THEN 1 ELSE 0 END) +
       2 * SUM(CASE WHEN satisfaction = 2 THEN 1 ELSE 0 END) +
       1 * SUM(CASE WHEN satisfaction = 1 THEN 1 ELSE 0 END)
      ) / 
      (SUM(CASE WHEN satisfaction = 5 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN satisfaction = 4 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN satisfaction = 3 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN satisfaction = 2 THEN 1 ELSE 0 END) + 
       SUM(CASE WHEN satisfaction = 1 THEN 1 ELSE 0 END))
    ) AS satisfaction_rating
  FROM reviews
  WHERE questionset_id = ${id}
) AS ratings;`
  connection.query(
    query,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
         // console.log("found rating: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found user with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Reviews.getUserReview = (qsetid,userid,result) => {
  connection.query(`SELECT * FROM reviews where questionset_id=${qsetid} and created_by=${userid}`, (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

    if (res.length) {
       // console.log("found review: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found QuestionSet with the id
    result({ kind: "not_found" }, null);
  });
};

Reviews.updateReview = (qsetid,userid, data, result) => {
  // first_name: data.first_name || "",
  // last_name: data.last_name || "",
  // role: data.role || "",
  // email: data.email || "",
  // company: data.company || "",
  // phone: data.phone || "",
  const modified_date = generateDateTime();
  connection.query(
    "UPDATE reviews SET content_quality= ?, satisfaction= ?, " +
      "difficulty= ? , review= ?, " +
      "modified_date = ? " +
      "WHERE questionset_id = ? AND created_by = ?",
    [
      data.content_quality,
      data.satisfaction,
      data.difficulty,
      data.review,
      modified_date,
      qsetid,
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

       // console.log("updated review: ", { id: userid, ...data });
      result(null, { id: userid, ...data });
    }
  );
};

module.exports = Reviews;
