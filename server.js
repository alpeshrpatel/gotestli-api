const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const queries = require("./queries.js");
const { default: axios } = require("axios");

const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const connection = require("./config/mysql.db.config.js");
const option = require('./swagger.js')

const port = 3000;

// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000'] // Whitelist the domains you want to allow
};



const app = express();
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to testli-api." });
});
// Custom middleware to intercept all requests
app.use((req, res, next) => {
  // Modify the response body or perform any other actions
  console.log(`Intercepted request: ${req.method} ${req.url}`);
  console.log(JSON.stringify(req.body));
  next(); 
});

require("./routes/questionset.route.js")(app);
require("./routes/category.route.js")(app);
require("./routes/questionmaster.route.js")(app);
require("./routes/user.result.route.js")(app);
require("./routes/user.result.detail.route.js")(app);
require("./routes/users.route.js")(app);
require("./routes/questionoptions.route.js")(app)
require("./routes/questionsetcategory.route.js")(app)
require("./routes/questionsetquestion.route.js")(app)


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  connection.getConnection(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL!');
  });
});


// app.get("/categories", async (req, res) => {
//   try {
//     const [rows] = await connection.query(queries.getCategories);
//     //
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });
// app.get("/question_master", async (req, res) => {
//   try {
//     // //const connection = await mysql.createConnection(dbConfig);
//     // connection = await connection.getConnection();
   
//     const [rows] = await connection.query(queries.getAllQuestions);
//     //
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// async function getQuestion(questionId) {
//   try {
//     const [rows] = await connection.execute(
//       "SELECT question  FROM question_master WHERE id = ?",
//       [questionId]
//     );

//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get("/api/question_master/:questionId", async (req, res) => {
//   try {
//     // //const connection = await mysql.createConnection(dbConfig);
//     // connection = await connection.getConnection();

//     const questionId = req.params.questionId;
//     const result = await getQuestion(questionId);
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/all_question_options", async (req, res) => {
//   try {
//     const [rows] = await connection.query(queries.getAllQuestionOptions);
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/all_question_sets", async (req, res) => {
//   try {
//     const [rows] = await connection.query(queries.getAllQuestionSets);
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/test-result", async (req, res) => {
//   try {
//     const [rows] = await connection.query(queries.getIdofTestResult);

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/lastId/test-result-dtl", async (req, res) => {
//   try {
//     const [rows] = await connection.query(queries.getIdofTestResultDtl);

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/api/get/last-question-set-id", async (req, res) => {
//   try {
//     const [rows] = await connection.query(queries.getIdofQuestionSet);

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// async function getQuestionSets(id) {
//   try {
//     const [rows] = await connection.execute(
//       "SELECT qsq.question_id, qm.question, qs.pass_percentage from testli.question_set_questions qsq, question_set qs , question_master qm where qs.id = ? and qsq.question_set_id = qs.id  and qm.id = qsq.question_id",
//       [id]
//     );
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get("/question_sets/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const questionSet = await getQuestionSets(id);
   
//     res.json(questionSet);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// /// creating new question set

// app.post("/api/post/create/questionsetdtl", async (req, res) => {
//   const {formData} = req.body
//   const {
//     title,
//     image,
//     author,
//     short_desc,
//     description,
//     start_date,
//     end_date,
//     time_duration,
//     no_of_question,
//     is_demo,
//     totalmarks,
//     pass_percentage,
//   } = formData;
  

//   const query = "INSERT INTO question_set(`org_id`,`title`,`question_set_url`,`image`,`author`,`short_desc`,`description`,`start_time`,`end_time`,`start_date`,`end_date`,`time_duration`,`no_of_question`,`status_id`,`is_demo`,`created_by`,`modified_by`,`totalmarks`,`pass_percentage`) VALUES   (1, ?, NULL , ?, ?, ?, ?,NULL ,NULL ,?, ?, ?, ?, NULL, ?, NULL, NULL, ?, ? )";
//   try {
//     const [results] = await connection.execute(query, [
//       title,
//       image,
//       author,
//       short_desc,
//       description,
//       start_date,
//       end_date,
//       time_duration,
//       no_of_question,
//       is_demo,
//       totalmarks,
//       pass_percentage,
//     ]);
//     res.json({
//       msg: "Selected option inserted successfully",
//       success: true,      
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// async function getOptions(questionId) {
//   try {
//     const [rows] = await connection.execute(
//       "SELECT question_option AS options FROM question_options WHERE question_id = ?",
//       [questionId]
//     );

//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get("/options/:questionId", async (req, res) => {
//   try {
//     const questionId = req.params.questionId;
//     const options = await getOptions(questionId);
//     res.json(options);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// //// getting testresultid of in-progress quiz

// async function getTestResultId(questionSetId, userId) {
//   try {
//     const [rows] = await connection.execute(
//       "SELECT id FROM user_test_result WHERE question_set_id = ? AND user_id = ? AND status = 2  ",
//       [questionSetId, userId]
//     );
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get(
//   "/api/get/pendingquiz/testresultid/:questionSetId/:userId",
//   async (req, res) => {
//     const { questionSetId, userId } = req.params;
//     try {
//       const result = await getTestResultId(questionSetId, userId);
//       res.json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// //// getting history of previous attempts
// async function getHistory(questionSetId, userId) {
//   try {
//     const [rows] = await connection.execute(
//       "SELECT id,percentage,marks_obtained,modified_date,status FROM user_test_result WHERE question_set_id = ? AND user_id = ?  ORDER BY id DESC LIMIT 4 ",
//       [questionSetId, userId]
//     );
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get(
//   "/api/get/attempts/history/:questionSetId/:userId",
//   async (req, res) => {
//     const { questionSetId, userId } = req.params;
//     try {
//       const result = await getHistory(questionSetId, userId);
//       res.json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// app.post("/api/start/test/result", async (req, res) => {
//   const {
//     userId,
//     questionSetId,
//     totalQuestions,
//     totalAnswered,
//     notAnswered,
//     totalReviewed,
//     notVisited,
//   } = req.body;

//   const query =
//     "INSERT INTO user_test_result(`org_id`, `user_id`, `question_set_id`, `total_question`, `total_answered`, `total_not_answered`, `total_reviewed`, `total_not_visited`, `percentage`, `marks_obtained`, `date`, `flag`, `created_by`, `created_date`, `modified_by`, `modified_date`,`status`) VALUES (1, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, NULL, 17, ?, NULL, NULL, 2)";

//   const date = new Date().toISOString().slice(0, 10);
//   const createdDate = new Date().toISOString().slice(0, 19).replace("T", " ");
//   try {
//     const [results] = await connection.query(query, [
//       userId,
//       questionSetId,
//       totalQuestions,
//       totalAnswered,
//       notAnswered,
//       totalReviewed,
//       notVisited,
//       date,
//       createdDate,
//     ]);
//     res.json({
//       msg: "Selected option inserted successfully",
//       success: true,
//       user_test_result_id: results.insertId,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// /// submiting quiz on test_result
// app.put("/api/put/testresult", async (req, res) => {
//   const {
//     userResultId,
//     questionSetId,
//     totalQuestions,
//     totalAnswered,
//     skippedQuestion,
//     totalReviewed,
//     marks,
//     percentage,
//   } = req.body;

//   const modifiedDate = new Date().toISOString().slice(0, 19).replace("T", " ");

//   const query = `UPDATE user_test_result SET total_answered = ? , total_not_answered = ?, total_reviewed = ? , total_not_visited = 0 , percentage = ?, marks_obtained = ?, modified_date = ?, status = 1 WHERE id = ?`;
//   try {
//     const [results] = await connection.query(query, [
//       totalAnswered,
//       skippedQuestion,
//       totalReviewed,
//       percentage,
//       marks,
//       modifiedDate,
//       userResultId,
//     ]);

//     res.json({
//       msg: "Selected option inserted successfully",
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: err });
//   }
// });

// /// calculating result
// app.post("/api/post/result/calculate", async (req, res) => {
//   const {
//     questionSetId,
//     totalQuestions,
//     totalAnswered,
//     totalReviewed,
//     skippedQuestion,
//     reviewQuestions,
//     userResultId,
//   } = req.body;
//   try {
//     const passingCriteria = await getPassCriteria(questionSetId);

//     const answers = await getAnswers(userResultId);

//     let passingStatus;
//     let percentage;
//     let marks;
//     let count = 0;
   
//     const totalmarks = passingCriteria[0]?.totalmarks;
//     const passPercentage = passingCriteria[0].pass_percentage;

//     if (passingCriteria.length > 0) {
//       const marksPerQuestion = totalmarks / totalQuestions;

//       answers.forEach((answer) => {
//         if (answer.answer == answer.correct_answer) {
//           count++;
//         }
//       });
//       marks = Math.round(marksPerQuestion * count);

//       percentage = Math.round((100 * marks) / totalmarks);

//       if (percentage < passPercentage) {
//         passingStatus = "Fail";
//       } else {
//         passingStatus = "Pass";
//       }
//     }

//     const result = await axios.put("http://localhost:3000/api/put/testresult", {
//       userResultId,
//       questionSetId,
//       totalQuestions,
//       totalAnswered,
//       skippedQuestion,
//       totalReviewed,
//       marks,
//       percentage,
//     });

//     res.json({
//       msg: "option inserted successfully",
//       success: true,
//       data: {
//         correct: count,
//         wrong: totalAnswered - count,
//         marks: marks,
//         percentage: percentage,
//         passPercentage: passPercentage,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// async function getPassCriteria(questionSetId) {
//   try {
//     const [rows] = await connection.execute(
//       "select totalmarks, pass_percentage from question_set where id = ? ",
//       [questionSetId]
//     );
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// async function getAnswers(userResultId) {
//   try {
//     const [rows] = await connection.execute(
//       "select answer, correct_answer from user_test_result_dtl where user_test_result_id = ?",
//       [userResultId]
//     );
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// async function getQuestionSetId(category_id) {
//   try {
//     const [rows] = await connection.execute(
//       "select question_set_id from question_set_categories where category_id = ? ",
//       [category_id]
//     );
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get("/api/questionset/:categoryId", async (req, res) => {
//   try {
//     const categoryId = req.params.categoryId;
//     const questionSetId = await getQuestionSetId(categoryId);
//     res.json(questionSetId);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// /// get correct answer from options table

// async function getCorrectAnswer(questionId) {
//   try {
//     const [rows] = await connection.execute(
//       "SELECT question_option AS correctAnswer FROM question_options WHERE is_correct_answer = 1 AND question_id = ?",
//       [questionId]
//     );
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get("/api/correctanswer/:questionId", async (req, res) => {
//   try {
//     const questionId = req.params.questionId;
//     const options = await getCorrectAnswer(questionId);
//     res.json(options);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/api/test/resultdetailsubmit", async (req, res) => {
//   const { jsonData } = req.body;

//   const query =
//     "INSERT INTO user_test_result_dtl " +
//     "(user_test_result_id, question_set_question_id, question_type, answer, correct_answer, created_by, created_date, modified_by, modified_date, status) " +
//     "VALUES (?, ?, 2, NULL, ?, 10, ?, NULL, NULL, ?)";
//   const createdDate = new Date().toISOString().slice(0, 19).replace("T", " ");
//   try {
//     const results = [];

//     for (const entry of jsonData) {
//       const result = await connection.query(query, [
//         entry.userResultId,
//         entry.questionId,
//         entry.correctAnswer,
//         createdDate,
//         entry.status,
//       ]);
//       results.push(result);
//     }

//     res.status(200).json({ message: "Data inserted successfully", results });
//   } catch (error) {
//     console.error("Error submitting test result details:", error);
//     res.status(500).json({ error: error.message });
//   } finally {
//     console.log("End of request processing");
//   }
// });

// //// get user_test_result_id

// async function getUserResultId(userId, questionSetId) {
//   try {
//     const [rows] = await connection.query(
//       "SELECT id FROM user_test_result WHERE user_id = ? AND question_set_id = ? ORDER BY id DESC LIMIT 1",
//       [userId, questionSetId]
//     );
//     console.log(rows);
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get("/api/get/userresultid/:userId/:questionSetId", async (req, res) => {
//   const { userId, questionSetId } = req.params;

//   try {
//     const results = await getUserResultId(userId, questionSetId);

//     res.json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.put("/api/update/testresultdtl", async (req, res) => {
//   const { userResultId, questionId, findSelectedOption, status } = req.body;

//   const query = `UPDATE user_test_result_dtl 
//      SET answer = ?, status = ? 
//      WHERE id = (
//          SELECT id 
//          FROM (
//              SELECT id 
//              FROM user_test_result_dtl 
//              WHERE user_test_result_id = ? AND question_set_question_id = ? 
//              ORDER BY id DESC 
//              LIMIT 1
//          ) AS temp
//      )`;

//   try {
//     const [results] = await connection.query(query, [
//       findSelectedOption,
//       status,
//       userResultId,
//       questionId,
//     ]);
    
//     res.json({
//       msg: "Selected option inserted successfully",
//       success: true,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// /// getting selected options from test_result_dtl

// async function getUserResultAnswers(userResultId, length) {
//   try {
//     const [rows] = await connection.query(
//       "SELECT question_set_question_id, answer, status FROM user_test_result_dtl WHERE user_test_result_id = ?  ORDER BY id DESC LIMIT ?",
//       [userResultId, length]
//     );
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get(
//   "/api/get/answers/:userResultId/:questionSetLength",
//   async (req, res) => {
//     const { userResultId, questionSetLength } = req.params;
//     const length = parseInt(questionSetLength);

//     try {
//       const answers = await getUserResultAnswers(userResultId, length);
//       res.json(answers);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// //// getting status from test_result_dtl

// async function getUserResultDtlStatus(userResultId, questionId) {
//   try {
//     const [rows] = await connection.execute(
//       "SELECT status FROM user_test_result_dtl WHERE user_test_result_id = ?  AND question_set_question_id = ? ORDER BY id DESC LIMIT 1",
//       [userResultId, questionId]
//     );
//     return rows;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// app.get(
//   "/api/update/testresultdtl/status/:userResultId/:questionId",
//   async (req, res) => {
//     const { userResultId, questionId } = req.params;

//     try {
//       const options = await getUserResultDtlStatus(userResultId, questionId);

//       res.json(options);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// /// storing question set in question_set_questions

// app.post("/api/post/questionset", async (req, res) => {
//   const { questionSetId, questionId } = req.body;

//   const query =
//     "INSERT INTO `question_set_questions` ( `question_set_id`, `question_id`, `created_by`,  `modified_by` ) VALUES (?, ?,  10, NULL )";
//   const createdDate = new Date().toISOString().slice(0, 19).replace("T", " ");
//   const data = await connection.query(
//     query,
//     [questionSetId, questionId],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Server error" });
//       } else {
//         res.json({
//           msg: "Selected option inserted successfully",
//           success: true,
//         });
//         return res;
//       }
//     }
//   );
// });



// ====================================



