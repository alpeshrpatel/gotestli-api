const connection = require("../config/mysql.db.config");
const logger = require("../logger");
const generateDateTime = require("../utils/util");

//constructor

function Options(options) {
  this.id = options.id;
  this.question_id = options.question_id;
  this.question_option = options.question_option;
  this.is_correct_answer = options.is_correct_answer;
  this.created_by = options.created_by;
  this.created_date = options.created_date;
  this.modified_by = options.modified_by;
  this.modified_date = options.modified_date;
} 

Options.findById = (id, result) => {
  connection.query(
    `SELECT question_id,question_option AS options,is_correct_answer AS correctAnswer FROM question_options WHERE question_id = ${id}`,
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

      if (res.length) {
         // console.log("found options: ", res[0]);
        result(null, res);
        return;
      }

      // not found Options with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Options.getAll = (result) => {
  let query = "SELECT * FROM question_options";

  connection.query(query, (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

    logger.info("users: ", res);
    result(null, res);
  });
};

Options.remove = (id, result) => {
  const query = `DELETE FROM question_options WHERE question_id = ?`
  connection.query(
   query,
    id,
    (err, res) => {
      
      if (err) {
         
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Options with the id
        result({ kind: "not_found" }, null);
        return;
      }

       // console.log("deleted Options with id: ", id);
      //  console.log('delete res:', res)
      result(null, res);
    }
  );
};

Options.removeAll = (result) => {
  connection.execute("DELETE FROM question_options", (err, res) => {
    if (err) {
       
      result(null, err);
      return;
    }

     // console.log(`deleted ${res.affectedRows} options`);
    result(null, res);
  });
};
const date = generateDateTime()
Options.create = (qid,options,correct_option,userId, result) => {
  const query = `INSERT INTO question_options (question_id, question_option, is_correct_answer, created_by, created_date, modified_by, modified_date) 
    VALUES ?`;
    const question_options = options.split(":")
    let correct_answer
    correct_option?.includes(':') ? ( correct_answer = correct_option?.split(":")) : correct_answer = null
    const optionsArr = question_options.map((item) => {
      if(correct_answer){
        return(
          [
            qid,
            item,
            (correct_answer.some((answer) => answer == item)) ? 1 : 0,
            userId,
            date,
            userId,  
            date
          ]
        )
        
      }else{
      return ( [
          qid,
          item,
          correct_option == item ? 1 : 0,
          userId,
          date,
          userId,  
          date 
        ])
      }
    })
  connection.query(
    query,
    [optionsArr],
    (err, res) => {
      if (err) {
         
        result(err, null);
        return;
      }

       // console.log("created questionset: ", {
      //   id: res.insertId,
      //   ...newQuestionSet,
      // });
      result(null, { id: res.insertId});
    }
  );
};

module.exports = Options;
