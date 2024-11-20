const connection = require("../config/mysql.db.config");

// constructor
const Badge = function (Badge) {
  // this.id = Badge.id;
  this.badge_name = Badge.badge_name;
  this.count = Badge.count;
  this.category_id = Badge.category_id;
  this.questionset_id = Badge.questionset_id;
  this.user_id = Badge.user_id;
  this.created_by = Badge.created_by;
  // this.created_date = Badge.created_date;
  this.modified_by = Badge.modified_by;
  // this.modified_date = Badge.modified_date;
};

Badge.create = (id, userId, result) => {
  const query = `INSERT INTO badge (badge_name, count, category_id, questionset_id, user_id, created_by, modified_by)
SELECT 'Apprentice', 1, category_id, ${id}, ${userId}, ${userId}, ${userId}
FROM (
    SELECT category_id
    FROM question_set_categories
    WHERE question_set_id = ${id}
) AS category_ids
ON DUPLICATE KEY UPDATE 
    count = count + 1, 
    badge_name = CASE
        WHEN count = 5 THEN 'Trailblazer'
        WHEN count = 10 THEN 'Virtuoso'
        WHEN count = 15 THEN 'Legend'
        ELSE badge_name  
    END;`;
  connection.query(query, (err, res) => {
    if (err) {
      
      result(err, null);
      return;
    }

  
    result(null, { id: res.insertId });
  });
};

Badge.getBadges = (id, result) => {
  const query = `SELECT b.*, c.title FROM badge b INNER JOIN categories c ON b.category_id = c.id WHERE b.user_id =${id};`;
  connection.query(query, (err, res) => {
    if (err) {
     
      result(err, null);
      return;
    }


    result(null, res);
  });
};

module.exports = Badge;
