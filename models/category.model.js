const connection = require("../config/mysql.db.config");
const logger = require("../logger");
// constructor
const Category = function (category) {
  (this.id = category.id),
    (this.org_id = category.org_id),
    (this.parent_id = category.parent_id),
    (this.title = category.title),
    (this.description = category.description),
    (this.meta_title = category.meta_title),
    (this.slug = category.slug),
    (this.meta_keyword = category.meta_keyword),
    (this.meta_description = category.meta_description),
    (this.status = category.status),
    (this.show_menu = category.show_menu),
    (this.is_parent_id = category.is_parent_id),
    (this.is_show_home = category.is_show_home),
    (this.icon = category.icon),
    (this.position = category.position);

  // this.created_by=category.created_by,
  // this.created_date=category.created_date,
  // this.modified_by=category.modified_by,
  // this.modified_date=category.modified_date
};

Category.create = (newCategory, result) => {
  connection.query("INSERT INTO categories SET ?", newCategory, (err, res) => {
    if (err) {
     
      result(err, null);
      return;
    }


    result(null, { id: res.insertId, ...newCategory });
  });
};

//getParentCategoryOfQuestionSet
Category.getParentCategoryOfQuestionSet = (id, result) => {
  const query = `WITH RECURSIVE hierarchy_cte AS (
    SELECT id, parent_id, title
    FROM categories
    WHERE id = ${id}  
    UNION ALL
    SELECT t.id, t.parent_id, t.title
    FROM categories t
    INNER JOIN hierarchy_cte h ON h.parent_id = t.id  
)
SELECT id, title 
FROM hierarchy_cte
WHERE parent_id = 0;`;

  connection.query(query, (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

    if (res.length) {
 
      result(null, res[0]);
      return;
    }

    // not found Category with the id
    result({ kind: "not_found" }, null);
  });
};

Category.findById = (id, result) => {
  connection.query(`SELECT * FROM categories WHERE id = ${id}`, (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

    if (res.length) {
     
      result(null, res[0]);
      return;
    }

    // not found Category with the id
    result({ kind: "not_found" }, null);
  });
};

Category.findParentCategories = (result) => {
  connection.query(
    `SELECT id,title FROM categories WHERE parent_id = 0`,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
    
        result(null, res);
        return;
      }

      // not found Category with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Category.findSelectedCategoriesQuestionsets = (title, result) => {
  const query =
    `SELECT qs.* ` +
    `FROM question_set qs  ` +
    `JOIN categories c2 ON ( ` +
    `qs.tags LIKE CONCAT('%,', c2.title, ',%') ` +
    `OR qs.tags LIKE CONCAT(c2.title, ',%') ` +
    `OR qs.tags LIKE CONCAT('%,', c2.title) ` +
    `OR qs.tags = c2.title ` +
    `and qs.is_demo = 1) ` +
    `WHERE  qs.status_id = 1 and c2.parent_id = (SELECT id FROM categories c WHERE title = '${title}');`;
  connection.query(query, (err, res) => {
    if (err) {
       
      result(err, null);
      return;
    }

    if (res.length) {
     
      result(null, res);
      return;
    }

    // not found Category with the id
    result({ kind: "not_found" }, null);
  });
};

Category.getAll = (result) => {
  let query = "SELECT * FROM categories where show_menu=1";
  connection.query(query, (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

    logger.info("categories: ", res);
    result(null, res);
  });
};

// Category.updateById = (id, category, result) => {
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
//       category.org_id, category.question_set_url, category.image,
//       category.short_desc, category.description, category.start_time ,
//       category.end_time, category.start_date, category.end_date ,
//       category.time_duration, category.no_of_question, category.status_id ,
//       category.is_demo ,
//       id
//     ],
//     (err, res) => {
//       if (err) {
//          
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found Category with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       result(null, { id: id, ...category });
//     }
//   );
// };

Category.remove = (id, result) => {
  connection.query("DELETE FROM question_set WHERE id = ?", id, (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Category with the id
      result({ kind: "not_found" }, null);
      return;
    }

    
    result(null, res);
  });
};

Category.removeAll = (result) => {
  connection.query("DELETE FROM categories", (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

    
    result(null, res);
  });
};

module.exports = Category;
