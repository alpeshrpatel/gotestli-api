const { error } = require("winston");
const connection = require("../config/mysql.db.config");
const { logger } = require("../logger");

// constructor
const QuestionFiles = function (questionFiles) {
  // this.id = QuestionFiles.id;
  this.file_name = questionFiles.file_name;
  this.file_path = questionFiles.file_path;
  this.user_id = questionFiles.user_id;
  this.status = questionFiles.status;
  this.created_by = questionFiles.created_by;
  // this.created_date = QuestionFiles.created_date;
  this.modified_by = questionFiles.modified_by;
  // this.modified_date = QuestionFiles.modified_date;
};

// QuestionFiles.create = (newQuestionFiles, result) => {
//   const query = " INSERT INTO users_preferences (user_id, category_id, created_by, created_date, modified_by, modified_date) VALUES ?";
//   connection.query(query, [newQuestionFiles], (err, res) => {
//     if (err) {
//        
//       result(err, null);
//       return;
//     }

//      // console.log("created QuestionFiles: ", { id: res.insertId, ...newQuestionFiles });
//     result(null, { id: res.insertId, ...newQuestionFiles });
//   });
// };

QuestionFiles.create = (newQuestionFiles, createdDate, result) => {
  const query =
    "INSERT INTO question_files (file_name,file_path,user_id,status,created_by,created_date,modified_by,modified_date) values (? , ? , ?, ? , ?, ?, ?, ?); ";
  connection.query(
    query,
    [
      newQuestionFiles.file_name,
      newQuestionFiles.file_path,
      newQuestionFiles.user_id,
      newQuestionFiles.status,
      newQuestionFiles.user_id,
      createdDate,
      newQuestionFiles.user_id,
      createdDate,
      0,
      0,
    ],
    (err, res) => {
      if (err) {

        result(err, null);
        return;
      }

      // console.log("created entry in QuestionFiles: ", {
      //   id: res.insertId,
      //   ...newQuestionFiles,
      // });
      result(null, { id: res.insertId, ...newQuestionFiles });
    }
  );
};

// QuestionFiles.insertQuestions = async (
//   fileId,
//   errorRows,
//   errorLog,
//   dataSet,
//   userId,
//   date,
//   result
// ) => {
//   let size = Object.keys(dataSet).length;
//   for (let i = 7; i < 7 + size; i++) {
//     if (!errorRows.includes(i)) {
//       console.log("dataset: ", i, "th row", dataSet[i]);
//       const data = dataSet[i];
//       const question_type = String(data[3]).includes(':') ? 7 : 2;
//       const checkDuplicateQuery = `SELECT COUNT(*) as count FROM question_master WHERE org_id = ? AND question = ? AND created_by = ?`;
//       const query = `INSERT INTO question_master (org_id, question, description, question_type_id, status_id, complexity,marks, is_negative, negative_marks, created_by, created_date, modified_by, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//       const values = [
//         0,
//         data[0],
//         data[1],
//         question_type,
//         1,
//         data[4],
//         data[5],
//         data[6],
//         data[7],
//         userId,
//         date,
//         userId,
//         date,
//       ];
//       const question = data[0];
//       const org_id = 0;
//       const created_by = userId;
//       try {
//         connection.query(checkDuplicateQuery, [org_id, question, created_by], (err, res) => {
//           if (res[0].count > 0) {
//             console.log(res[0].count, "duplicate question found");
//            const duplicateMessage = `(Row:- ${i - 6})` + `Error: Duplicate question at row ${i - 6}: question already exists`
//             // const duplicateMessage = `Duplicate question at row ${i - 6}: "${question}" already exists.`;
//             logger.warn(duplicateMessage);
//             errorRows.push(i);
            
//             errorLog.push(duplicateMessage);

//             // return result(error, 'Duplicate question found');
//           } else {
//             connection.query(query, values, async (err, res) => {
//               if (err) {
//                 logger.error("Error inserting question:", err);
//                 errorRows.push(i - 6);
//                 errorLog.push(`Error inserting question row:- ${i - 7}:  ${err}`);

//                 // return result(err, null);

//               }
//               // console.log("insert id:", res.insertId);
//               logger.info("this row inserted in qm: ", i, res);
//               const optionInsertResult = await insertQuestionOptions(
//                 res.insertId,
//                 data,
//                 userId,
//                 date
//               );

//               if (optionInsertResult) {

//               }
//             });
//           }
//           // logger.error("Error inserting question:", err);
//           // errorRows.push(i - 6);
//           // errorLog.push(`Error inserting question row:- ${i - 7}:  ${err}`);
//           // return res(err, null);
//         });


//       } catch (error) {
//         // console.log("Error inserting question:", error);
//         return result(error, null);

//       }
//     } else {
//       break;
//     }
//   }
 
//   const globalArray = Array.from({ length: size }, (_, index) => index + 1);
//   const erroredArray = errorRows.map((row) => row - 6);
//   const correctedArray = globalArray.filter((num) => !erroredArray.includes(num));
//   const correct = correctedArray.join(',');
//   const errored = erroredArray.join(",");
//   // update file data in question_files
//   const res = await updateFilesData(fileId, correct, errored, errorLog, date)
//   if (res) {
//     // console.log('updated successfully!');
//   } else {
//     // console.log('some error')
//   }
//   if (errorRows.length > 0) {
//     result(null, { message: "Questions of this Rows are not inserted: ", errored });
//   } else {
//     result(null, {
//       message: "All questions and options inserted successfully",
//     });
//   }
// };

const util = require('util');
const checkDuplicate = util.promisify(connection.query).bind(connection);
const insertQuestion = util.promisify(connection.query).bind(connection);

QuestionFiles.insertQuestions = async (
  fileId,
  errorRows,
  errorLog,
  dataSet,
  userId,
  date,
  result
) => {
  const size = Object.keys(dataSet).length;

  for (let i = 7; i < 7 + size; i++) {
    if (errorRows.includes(i)) {
      continue; // Skip error rows
    }

    const data = dataSet[i];
    const question_type = String(data[3]).includes(':') ? 7 : 2;
    const question = data[0];
    const org_id = 0;

    try {
      const [duplicateCheck] = await checkDuplicate(
        `SELECT COUNT(*) as count FROM question_master WHERE org_id = ? AND question = ? AND created_by = ?`,
        [org_id, question, userId]
      );

      if (duplicateCheck.count > 0) {
        const msg = `(Row:- ${i - 6}) Error: Duplicate question at row ${i - 6}`;
        logger.warn(msg);
        errorRows.push(i);
        errorLog.push(msg);
        continue;
      }

      const values = [
        org_id,
        question || '',
        data[1] || '',
        question_type || 2,
        1,
        data[4] || 'easy',
        data[5] || 1,
        data[6] || 0,
        data[7] || 0,
        userId,
        date,
        userId,
        date,
      ];

      const insertResult = await insertQuestion(
        `INSERT INTO question_master (org_id, question, description, question_type_id, status_id, complexity, marks, is_negative, negative_marks, created_by, created_date, modified_by, modified_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values
      );

      const insertId = insertResult.insertId;
      logger.info(`Inserted question at row ${i - 6}: ID ${insertId}`);

      const optionInsertResult = await insertQuestionOptions(
        insertId,
        data,
        userId,
        date
      );

    } catch (err) {
      const errorMsg = `Error inserting question at row ${i - 6}: ${err.message}`;
      logger.error(errorMsg);
      errorRows.push(i);
      errorLog.push(errorMsg);
      continue;
    }
  }

  // Prepare summary arrays
  const globalArray = Array.from({ length: size }, (_, index) => index + 1);
  const erroredArray = errorRows.map((row) => row - 6);
  const correctedArray = globalArray.filter((num) => !erroredArray.includes(num));
  const correct = correctedArray.join(',');
  const errored = erroredArray.join(',');

  const res = await updateFilesData(fileId, correct, errored, errorLog, date);

  if (errorRows.length > 0) {
    result(null, { message: "Questions of these rows were not inserted: ", errored });
  } else {
    result(null, { message: "All questions and options inserted successfully" });
  }
};

QuestionFiles.insertQuestionsEliminatingDuplicates = async (
  fileId,
  errorRows,
  errorLog,
  dataSet,
  userId,
  date,
  result
) => {
  let size = Object.keys(dataSet).length;
  for (let i = 7; i < 7 + size; i++) {
    if (!errorRows.includes(i)) {
      const data = dataSet[i];
      console.log("dataset: ", i, "th row", data);

      const question = data[0];
      const org_id = 0; // Hardcoded in values
      const created_by = userId;
      const question_type = String(data[3]).includes(':') ? 7 : 2;

      try {
        // Check for duplicate question
        const checkDuplicateQuery = `SELECT COUNT(*) as count FROM question_master WHERE org_id = ? AND question = ? AND created_by = ?`;
        const [rows] = await new Promise((resolve, reject) => {
          connection.query(checkDuplicateQuery, [org_id, question, created_by], (err, res) => {
            if (err) return reject(err);
            resolve(res);
          });
        });

        if (rows.count > 0) {
          const duplicateMessage = `Duplicate question at row ${i - 6}: "${question}" already exists.`;
          logger.warn(duplicateMessage);
          errorRows.push(i - 6);
          errorLog.push(duplicateMessage);
          return result(error, 'Duplicate question found');
        }

        // If no duplicate, proceed to insert
        const insertQuery = `INSERT INTO question_master (org_id, question, description, question_type_id, status_id, complexity, marks, is_negative, negative_marks, created_by, created_date, modified_by, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
          org_id,
          data[0],
          data[1],
          question_type,
          1,
          data[4],
          data[5],
          data[6],
          data[7],
          userId,
          date,
          userId,
          date,
        ];

        const insertResult = await new Promise((resolve, reject) => {
          connection.query(insertQuery, values, (err, res) => {
            if (err) return reject(err);
            resolve(res);
          });
        });

        logger.info("Row inserted into question_master:", i, insertResult);

        // Insert question options
        const optionInsertResult = await insertQuestionOptions(
          insertResult.insertId,
          data,
          userId,
          date
        );

        if (optionInsertResult) {
          // Optionally handle successful option insertion
        }

      } catch (err) {
        logger.error("Error inserting question at row", i - 6, ":", err);
        errorRows.push(i - 6);
        errorLog.push(`Error inserting question at row ${i - 6}: ${err.message}`);
        return result(error, null);
      }
    }
  }

  const globalArray = Array.from({ length: size }, (_, index) => index + 1);
  const erroredArray = errorRows.map((row) => row - 6);
  const correctedArray = globalArray.filter((num) => !erroredArray.includes(num));
  const correct = correctedArray.join(',');
  const errored = erroredArray.join(",");

  const res = await updateFilesData(fileId, correct, errored, errorLog, date);
  if (!res) {
    logger.error('Error updating question_files with result metadata.');
  }

  if (errorRows.length > 0) {
    result(null, { message: "Questions of these rows were not inserted due to errors or duplicates:", errored });
  } else {
    result(null, { message: "All questions and options inserted successfully" });
  }
};




// QuestionFiles.insertQuestions = async (
//   fileId,
//   errorRows,
//   dataSet,
//   userId,
//   date,
//   result
// ) => {
//   let size = Object.keys(dataSet).length;
//   console.log(`Total rows in dataset: ${size}`);
//   console.log(`Error rows: ${errorRows.length > 0 ? errorRows.join(', ') : 'None'}`);

//   // Track processed rows and successful inserts
//   let processedCount = 0;
//   let successCount = 0;
//   let failCount = 0;
//   let successRows = [];

//   // If no rows to process, return early
//   if (size === 0) {
//     await updateFilesData(fileId, "", "", date);
//     return result(null, {
//       message: "No questions to insert",
//     });
//   }

//   // Use a Promise to track when all inserts are done
//   const insertPromises = [];

//   for (let i = 7; i < 7 + size; i++) {
//     // Skip rows with validation errors
//     if (errorRows.includes(i)) {
//       failCount++;
//       continue;
//     }

//     const rowNum = i - 6; // Convert to 1-based indexing for display
//     console.log(`Processing row ${rowNum}: ${JSON.stringify(dataSet[i])}`);

//     const data = dataSet[i];
//     if (!data || data.length < 8) {
//       console.error(`Invalid data in row ${rowNum}:`, data);
//       failCount++;
//       continue;
//     }

//     const question_type = String(data[2]).includes(':') ? 7 : 2;
//     const query = `INSERT INTO question_master (org_id, question, description, question_type_id, status_id, complexity,marks, is_negative, negative_marks, created_by, created_date, modified_by, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     const values = [
//       0,
//       data[0],
//       data[1],
//       question_type, // Fixed: Use the calculated question_type
//       1,
//       data[4],
//       data[5],
//       data[6],
//       data[7],
//       userId,
//       date,
//       userId,
//       date,
//     ];

//     // Add this insert to our list of promises
//     const insertPromise = new Promise((resolve, reject) => {
//       connection.query(query, values, async (err, res) => {
//         if (err) {
//           console.error(`Error inserting question for row ${rowNum}:`, err);
//           failCount++;
//           resolve(false); // We resolve with false to indicate failure
//         } else {
//           const questionId = res.insertId;
//           console.log(`Inserted question ID: ${questionId} for row ${rowNum}`);

//           try {
//             const optionsInserted = await insertQuestionOptions(
//               questionId,
//               data,
//               userId,
//               date
//             );

//             if (optionsInserted) {
//               successCount++;
//               successRows.push(rowNum);
//               console.log(`Successfully inserted options for question ID: ${questionId}`);
//               resolve(true); // Success!
//             } else {
//               failCount++;
//               console.error(`Failed to insert options for question ID: ${questionId}`);
//               resolve(false);
//             }
//           } catch (error) {
//             failCount++;
//             console.error(`Error inserting options for question ID: ${questionId}:`, error);
//             resolve(false);
//           }
//         }

//         processedCount++;
//       });
//     });

//     insertPromises.push(insertPromise);
//   }

//   // Wait for all inserts to complete
//   try {
//     await Promise.all(insertPromises);

//     console.log(`All rows processed. Success: ${successCount}, Failed: ${failCount}`);

//     // Convert arrays to comma-separated strings
//     const correct = successRows.length > 0 ? successRows.join(',') : "";
//     const errorIndexes = errorRows.map(row => row - 6); // Convert to 1-based indexing
//     const errored = errorIndexes.length > 0 ? errorIndexes.join(",") : "";

//     // Update file data in question_files
//     console.log(`Updating file record. File ID: ${fileId}, Correct rows: ${correct}, Error rows: ${errored}`);
//     await updateFilesData(fileId, correct, errored, date);

//     // Return appropriate response
//     if (successCount === 0) {
//       result(null, { message: "No questions were inserted successfully" });
//     } else if (failCount > 0) {
//       result(null, { 
//         message: `Inserted ${successCount} questions successfully. Failed to insert ${failCount} questions.`,
//         successRows,
//         errorRows: errorIndexes 
//       });
//     } else {
//       result(null, {
//         message: `All ${successCount} questions and options inserted successfully`,
//       });
//     }
//   } catch (error) {
//     console.error("Error in question insertion process:", error);
//     result(error, null);
//   }
// };

// Update the updateFilesData function to properly handle the update
// const updateFilesData = async (fileId, correct, errored, date) => {
//   return new Promise((resolve, reject) => {
//     const query = `UPDATE question_files SET status = 1, correct_rows = ?, error_rows = ? WHERE id = ?`;
//     connection.query(query, [correct, errored, fileId], (err, res) => {
//       if (err) {
//         console.error("Error updating files:", err);
//         reject(err);
//       } else {
//         console.log(`Updated question_files record. File ID: ${fileId}, Status: 1, Affected rows: ${res.affectedRows}`);
//         resolve(true);
//       }
//     });
//   });
// };

// Update the insertQuestionOptions function to properly handle promises
// const insertQuestionOptions = async (questionId, data, userId, date) => {
//   return new Promise((resolve, reject) => {
//     const query = `
//       INSERT INTO question_options (question_id, question_option, is_correct_answer, created_by, created_date, modified_by, modified_date) 
//       VALUES ?`;

//     try {
//       const question_options = data[2].split(":");
//       console.log(`Processing options for question ID ${questionId}: ${question_options.join(', ')}`);
//       console.log(`Correct answer: ${data[3]}`);

//       const correct_answer = question_options.map((option) => {
//         if (typeof data[3] === "string" && data[3].includes(':')) {
//           return data[3].toLowerCase().includes(option.toLowerCase()) ? 1 : 0;
//         } else {
//           return typeof data[3] === "string"
//             ? data[3].toLowerCase() === option.toLowerCase()
//               ? 1
//               : 0
//             : data[3] === option
//             ? 1
//             : 0;
//         }
//       });

//       console.log(`Correct answers mapping: ${correct_answer.join(', ')}`);

//       // Make sure we have at least 4 options
//       if (question_options.length < 4) {
//         console.error(`Not enough options for question ID ${questionId}. Found: ${question_options.length}`);
//         return resolve(false);
//       }

//       const options = [
//         [
//           questionId,
//           question_options[0],
//           correct_answer[0],
//           userId,
//           date,
//           userId,
//           date,
//         ], // Option 1
//         [
//           questionId,
//           question_options[1],
//           correct_answer[1],
//           userId,
//           date,
//           userId,
//           date,
//         ], // Option 2
//         [
//           questionId,
//           question_options[2],
//           correct_answer[2],
//           userId,
//           date,
//           userId,
//           date,
//         ], // Option 3
//         [
//           questionId,
//           question_options[3],
//           correct_answer[3],
//           userId,
//           date,
//           userId,
//           date,
//         ], // Option 4
//       ];

//       // Insert options for each question
//       connection.query(query, [options], (err, result) => {
//         if (err) {
//           console.error(`Error inserting options for question ID ${questionId}:`, err);
//           resolve(false);
//         } else {
//           console.log(`Successfully inserted ${result.affectedRows} options for question ID ${questionId}`);
//           resolve(true);
//         }
//       });
//     } catch (error) {
//       console.error(`Error preparing options for question ID ${questionId}:`, error);
//       resolve(false);
//     }
//   });
// };



const updateFilesData = async (fileId, correct, errored, errorLog, date) => {
  const errorLogJson = JSON.stringify(errorLog);
  const query = `UPDATE question_files SET status = 1, correct_rows = ?, error_rows = ?, error_log = ? WHERE id = ?`;
  connection.query(query, [correct, errored, errorLogJson, fileId], (err, res) => {
    if (err) {
      console.error("Error updating files:", err);
      return false;
    }
    return true;
  });
}

const insertQuestionOptions = async (questionId, data, userId, date) => {
  const query = `
    INSERT INTO question_options (question_id, question_option, is_correct_answer, created_by, created_date, modified_by, modified_date) 
    VALUES ?`;
  const question_options = data[2].split(":");
  // console.log("data3", data[3]);
  const correct_answer = question_options.map((option) => {
    if (typeof data[3] === "string" && data[3].includes(':')) {
      return data[3].toLowerCase().includes(option.toLowerCase()) ? 1 : 0;
    } else {
      return typeof data[3] === "string"
        ? data[3].toLowerCase() === option.toLowerCase()
          ? 1
          : 0
        : data[3] === option
          ? 1
          : 0;
    }
  });
  const options = [
    [
      questionId,
      question_options[0],
      correct_answer[0],
      userId,
      date,
      userId,
      date,
    ], // Option 1
    [
      questionId,
      question_options[1],
      correct_answer[1],
      userId,
      date,
      userId,
      date,
    ], // Option 2
    [
      questionId,
      question_options[2],
      correct_answer[2],
      userId,
      date,
      userId,
      date,
    ], // Option 3
    [
      questionId,
      question_options[3],
      correct_answer[3],
      userId,
      date,
      userId,
      date,
    ], // Option 4
  ];

  try {
    // Insert options for each question
    connection.query(query, [options]);
    return true;
  } catch (error) {
    console.error("Error inserting options:", error);
    return false;
  }
};

QuestionFiles.CheckQuestionExists = async (question, org_id, created_by,result) => {
  const checkDuplicateQuery = `SELECT COUNT(*) as count FROM question_master WHERE org_id = ? AND question = ? AND created_by = ?`;
  
    connection.query(checkDuplicateQuery, [org_id, question, created_by], (err, res) => { 
      if (err) {
       return result(err, null);
      
      } else {
        return result(0, res[0].count > 0);
      }
    });
 
};

QuestionFiles.findById = async (user_id, startPoint, endPoint, search, orgid, result) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;


  const limit = Math.max(parseInt(end - start + 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);
  let queryString = "";
  let queryParams = "";
  if (search) {
    queryString = `SELECT * FROM question_files WHERE user_id = ? 
   AND (file_name LIKE ?) AND org_id = ? order by created_date desc LIMIT ? OFFSET ?;`;
  } else {
    queryString = `SELECT * FROM question_files WHERE user_id = ? AND org_id = ? ORDER BY created_date DESC LIMIT ? OFFSET ?`;
  }
  if (search) {
    const searchTerm = `%${search}%`;
    queryParams = [user_id, searchTerm, orgid, limit, offset];
  } else {
    queryParams = [user_id, orgid, limit, offset];
  }
  connection.query(
    queryString, queryParams,
    (err, res) => {
      if (err) {
        return result(err, null);
      }

      if (!res.length) {
        // If no records are found, return early to prevent further execution
        return result({ kind: "not_found" }, null);
      }
      let countQuery = ``;
      if (search) {
        countQuery = `SELECT COUNT(*) as total FROM question_files WHERE user_id = ? AND (file_name LIKE ?) AND org_id = ?`;
      } else {
        countQuery = `SELECT COUNT(*) as total FROM question_files WHERE user_id = ? AND org_id = ?`;
      }
      let countParams = [];
      if (search) {
        const searchTerm = `%${search}%`;
        countParams = [user_id, searchTerm, orgid];
      } else {
        countParams = [user_id, orgid];
      }
      // If records are found, fetch the total count
      connection.query(
        countQuery, countParams,
        (countErr, countRes) => {
          if (countErr) {
            return result(countErr, null);
          }

          const totalRecords = countRes[0]?.total || 0;
          return result(null, { res, totalRecords });
        }
      );
    }
  );
};

QuestionFiles.findByFileName = async (filename, orgid, result) => {
  connection.query(
    `select * from question_files where file_name = '${filename}' AND org_id = ${orgid};`,
    (err, res) => {
      if (err) {

        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found user: ", res);
        result(null, res);
        return;
      }

      // not found user with the id
      result({ kind: "not_found" }, null);
    }
  );
};
// QuestionFiles.remove = (instructor_id, follower_id, result) => {
//   connection.query(
//     `DELETE FROM followers_list WHERE instructor_id= ${instructor_id} and follower_id = ${follower_id};`,

//     (err, res) => {
//       if (err) {
//          
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found QuestionFiles with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }

//        // console.log("deleted QuestionFiles ");
//       result(null, res);
//     }
//   );
// };

QuestionFiles.removeAll = (result) => {
  connection.query("DELETE FROM question_files", (err, res) => {
    if (err) {

      result(null, err);
      return;
    }

    // console.log(`deleted ${res.affectedRows} question_set`);
    result(null, res);
  });
};

module.exports = QuestionFiles;
