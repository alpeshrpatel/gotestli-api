const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
  const userresultdetails = require("../controller/user.result.details.controller");

  var router = require("express").Router();

  /**
 * @swagger
 * /api/userresultdetails:
 *   post:
 *     summary: Create a new UserResultDetails
 *     description: Adds a new entry for the User's result details in the system.
 *     tags: [UserResultDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_test_result_id:
 *                 type: integer
 *                 description: The ID of the user's test result.
 *                 example: 101
 *               question_set_question_id:
 *                 type: integer
 *                 description: The ID of the question in the question set.
 *                 example: 212
 *               correct_answer:
 *                 type: string
 *                 description: The answer provided by the user.
 *                 example: "A"
 *               status:
 *                 type: integer
 *                 description: The status of the answer (e.g., 1 for correct, 0 for incorrect).
 *                 example: 1
 *               created_by:
 *                 type: integer
 *                 description: The ID of the user who created this result entry.
 *                 example: 43
 *               modified_by:
 *                 type: integer
 *                 description: The ID of the user who last modified this result entry (nullable).
 *                 example: 43
 *     responses:
 *       201:
 *         description: Successfully created a new UserResultDetails entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message for successful creation.
 *                   example: "UserResultDetails created successfully."
 *                 user_result_details:
 *                   type: object
 *                   properties:
 *                     user_test_result_id:
 *                       type: integer
 *                       description: The ID of the user's test result.
 *                       example: 101
 *                     question_set_question_id:
 *                       type: integer
 *                       description: The ID of the question in the question set.
 *                       example: 212
 *                     correct_answer:
 *                       type: string
 *                       description: The correct answer provided by the user.
 *                       example: "A"
 *                     status:
 *                       type: integer
 *                       description: The status of the answer.
 *                       example: 1
 *                     created_by:
 *                       type: integer
 *                       description: The ID of the user who created this result entry.
 *                       example: 43
 *                     modified_by:
 *                       type: integer
 *                       description: The ID of the user who last modified this result entry.
 *                       example: 43
 *       400:
 *         description: Bad Request. Invalid input or missing fields.
 *       500:
 *         description: Internal Server Error. Could not create the UserResultDetails entry.
 */

  // Create a new UserResultDetails
  router.post("/", userresultdetails.create);

  // Create a new UserResultDetails
  router.post("/add/questions", userresultdetails.addAllQuestionForQuestionSet);

  /**
 * @swagger
 * /api/userresultdetails/add/user/questions:
 *   post:
 *     summary: Add questions at the start of a quiz for a user
 *     description: Creates a new set of questions for the user when starting the quiz based on the provided user and question set IDs.
 *     tags: [UserResultDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user who is starting the quiz.
 *                 example: 43
 *               questionSetId:
 *                 type: integer
 *                 description: The ID of the question set to be used in the quiz.
 *                 example: 69
 *               userResultId:
 *                 type: integer
 *                 description: The ID of the user’s result entry where the questions will be added.
 *                 example: 101
 *     responses:
 *       201:
 *         description: Successfully added questions to the user’s quiz.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message for successfully adding questions.
 *                   example: "Questions added successfully to the quiz."
 *                 user_result_details:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       description: The ID of the user.
 *                       example: 43
 *                     questionSetId:
 *                       type: integer
 *                       description: The ID of the question set.
 *                       example: 69
 *                     userResultId:
 *                       type: integer
 *                       description: The ID of the user’s result.
 *                       example: 101
 *       400:
 *         description: Bad Request. Invalid input or missing fields.
 *       404:
 *         description: Not Found. The specified question set or user result ID does not exist.
 *       500:
 *         description: Internal Server Error. Could not add the questions to the quiz.
 */

  // Create a new UserResultDetails
  router.post("/add/user/questions", userresultdetails.addQuestionsOnStartQuiz);

  /**
 * @swagger
 * /api/userresultdetails/{id}:
 *   get:
 *     summary: Retrieve a single UserResultDetails by ID
 *     description: Fetches the details of a single user result entry based on the provided ID.
 *     tags: [UserResultDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the UserResultDetails to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the UserResultDetails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_test_result_id:
 *                   type: integer
 *                   description: The ID of the user's test result.
 *                   example: 101
 *                 question_set_question_id:
 *                   type: integer
 *                   description: The ID of the associated question set question.
 *                   example: 5
 *                 correct_answer:
 *                   type: string
 *                   description: The correct answer for the question.
 *                   example: "B"
 *                 status:
 *                   type: integer
 *                   description: The status of the question (e.g., correct or incorrect).
 *                   example: 1
 *                 created_by:
 *                   type: integer
 *                   description: The ID of the user who created the result details.
 *                   example: 43
 *                 modified_by:
 *                   type: integer
 *                   description: The ID of the user who last modified the result details.
 *                   example: 44
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the result details were created.
 *                   example: "2024-10-20T10:30:00Z"
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the result details were last modified.
 *                   example: "2024-10-20T12:00:00Z"
 *       404:
 *         description: UserResultDetails not found. The specified ID does not exist.
 *       500:
 *         description: Internal Server Error. Could not retrieve the UserResultDetails.
 */

  // Retrieve a single UserResultDetails with id
  router.get("/:id",cacheMiddleware, userresultdetails.findOne);

  /**
 * @swagger
 * /api/userresultdetails/userresult/{userresultid}:
 *   get:
 *     summary: Retrieve a single UserResultDetails by user result ID
 *     description: Fetches the details of a user result entry based on the provided user result ID.
 *     tags: [UserResultDetails]
 *     parameters:
 *       - in: path
 *         name: userresultid
 *         required: true
 *         description: The user result ID to retrieve the associated UserResultDetails.
 *         schema:
 *           type: integer
 *           example: 101
 *     responses:
 *       200:
 *         description: Successfully retrieved the UserResultDetails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_test_result_id:
 *                   type: integer
 *                   description: The ID of the user's test result.
 *                   example: 101
 *                 question_set_question_id:
 *                   type: integer
 *                   description: The ID of the associated question set question.
 *                   example: 5
 *                 correct_answer:
 *                   type: string
 *                   description: The correct answer for the question.
 *                   example: "B"
 *                 status:
 *                   type: integer
 *                   description: The status of the question (e.g., correct or incorrect).
 *                   example: 1
 *                 created_by:
 *                   type: integer
 *                   description: The ID of the user who created the result details.
 *                   example: 43
 *                 modified_by:
 *                   type: integer
 *                   description: The ID of the user who last modified the result details.
 *                   example: 44
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the result details were created.
 *                   example: "2024-10-20T10:30:00Z"
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the result details were last modified.
 *                   example: "2024-10-20T12:00:00Z"
 *       404:
 *         description: UserResultDetails not found. The specified user result ID does not exist.
 *       500:
 *         description: Internal Server Error. Could not retrieve the UserResultDetails.
 */

  // Retrieve a single UserResultDetails with id
  router.get("/userresult/:userresultid",cacheMiddleware, userresultdetails.findUserResultDetailsByUserResultId);

  /**
 * @swagger
 * /api/userresultdetails/get/answers/userresult/{userResultId}/length/{questionSetLength}:
 *   get:
 *     summary: Retrieve selected answers from test_result_dtl by user result ID and question set length
 *     description: Fetches the selected answers and their corresponding status for a specific user result and question set length.
 *     tags: [UserResultDetails]
 *     parameters:
 *       - in: path
 *         name: userResultId
 *         required: true
 *         description: The user result ID for which to retrieve the answers.
 *         schema:
 *           type: integer
 *           example: 101
 *       - in: path
 *         name: questionSetLength
 *         required: true
 *         description: The length of the question set for which to retrieve the answers.
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved the answers for the given user result and question set length.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   question_set_question_id:
 *                     type: integer
 *                     description: The ID of the question in the question set.
 *                     example: 5
 *                   answer:
 *                     type: string
 *                     description: The selected answer for the question.
 *                     example: "B"
 *                   status:
 *                     type: integer
 *                     description: The status of the answer (e.g., correct or incorrect).
 *                     example: 1
 *       404:
 *         description: No answers found for the provided user result ID and question set length.
 *       500:
 *         description: Internal Server Error. Could not retrieve the answers.
 */

  // Retrieve selected options from test_result_dtl
  router.get("/get/answers/userresult/:userResultId/length/:questionSetLength",cacheMiddleware,userresultdetails.getUserResultAnswers);

  /**
 * @swagger
 * /api/userresultdetails/status/userresult/{userResultId}/questionid/{questionId}:
 *   get:
 *     summary: Retrieve the updated status of a question in the test_result_dtl by user result ID and question ID
 *     description: Fetches the updated status for a specific question in a user's result based on the user result ID and question ID.
 *     tags: [UserResultDetails]
 *     parameters:
 *       - in: path
 *         name: userResultId
 *         required: true
 *         description: The user result ID for which to retrieve the status of a question.
 *         schema:
 *           type: integer
 *           example: 101
 *       - in: path
 *         name: questionId
 *         required: true
 *         description: The ID of the question for which to retrieve the status.
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Successfully retrieved the status for the given user result ID and question ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The updated status of the question in the user's result.
 *                   example: 1
 *       404:
 *         description: No status found for the provided user result ID and question ID.
 *       500:
 *         description: Internal Server Error. Could not retrieve the status.
 */

  // Retrieve updated status of  test_result_dtl
  router.get("/status/userresult/:userResultId/questionid/:questionId",cacheMiddleware,userresultdetails.getStatus);

  /**
 * @swagger
 * /api/userresultdetails:
 *   put:
 *     summary: Update an existing UserResultDetails
 *     description: Updates the details of a specific user result, including the answer and status for a question.
 *     tags: [UserResultDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_test_result_id:
 *                 type: integer
 *                 description: The ID of the user's test result to be updated.
 *                 example: 123
 *               question_set_question_id:
 *                 type: integer
 *                 description: The ID of the question in the question set.
 *                 example: 45
 *               answer:
 *                 type: string
 *                 description: The selected answer for the question.
 *                 example: "A"
 *               modified_by:
 *                 type: integer
 *                 description: The ID of the user making the update.
 *                 example: 42
 *               status:
 *                 type: integer
 *                 description: The status of the answer (e.g., 1 for correct, 0 for incorrect).
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully updated the UserResultDetails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating the successful update.
 *                   example: "UserResultDetails updated successfully."
 *       400:
 *         description: Bad Request. Invalid input or missing fields.
 *       404:
 *         description: Not Found. UserResultDetails not found for the provided user_test_result_id and question_set_question_id.
 *       500:
 *         description: Internal Server Error. Could not update the UserResultDetails.
 */

  // Update a UserResultDetails with id
  router.put("/", userresultdetails.update);

  /**
 * @swagger
 * /api/userresultdetails/{id}:
 *   delete:
 *     summary: Delete a UserResultDetails by ID
 *     description: Deletes a specific UserResultDetails entry based on the provided ID.
 *     tags: [UserResultDetails]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the UserResultDetails to be deleted.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the UserResultDetails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating the successful deletion.
 *                   example: "UserResultDetails deleted successfully."
 *       404:
 *         description: Not Found. The UserResultDetails with the specified ID does not exist.
 *       500:
 *         description: Internal Server Error. Could not delete the UserResultDetails.
 */
  // Delete a UserResultDetails with id
  router.delete("/:id", userresultdetails.delete);

  /**
 * @swagger
 * /api/userresultdetails:
 *   delete:
 *     summary: Delete all UserResultDetails
 *     description: Deletes all UserResultDetails entries in the system.
 *     tags: [UserResultDetails]
 *     responses:
 *       200:
 *         description: Successfully deleted all UserResultDetails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating the successful deletion of all entries.
 *                   example: "All UserResultDetails deleted successfully."
 *       500:
 *         description: Internal Server Error. Could not delete the UserResultDetails.
 */
  // Delete all UserResultDetails
  router.delete("/", userresultdetails.deleteAll);

  app.use('/api/userresultdetails', router);
};
