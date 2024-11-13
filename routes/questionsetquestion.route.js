module.exports = app => {
    const QuestionSetQuestion = require("../controller/questionsetquestion.controller");
  
    var router = require("express").Router();
  

    /**
 * @swagger
 * /api/questionset/question/questionsetid:
 *   get:
 *     summary: Retrieve the latest QuestionSet ID
 *     description: Fetches the most recent ID from the QuestionSet table to be used in question set insertion.
 *     tags: [QuestionSet Question]
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest QuestionSet ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The latest ID in the QuestionSet table.
 *                   example: 45
 *       404:
 *         description: No QuestionSet found.
 *       500:
 *         description: Internal Server Error. Could not retrieve the QuestionSet ID.
 */

    // Retrieve last questionset id to insert into qs
    router.get("/questionsetid", QuestionSetQuestion.findOne);

 /**
 * @swagger
 * /api/questionset/question:
 *   post:
 *     summary: Create new QuestionSetQuestion entries
 *     description: Adds new questions to a specific question set in bulk.
 *     tags: [QuestionSet Question]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 question_set_id:
 *                   type: integer
 *                   description: The ID of the question set associated with this question.
 *                   example: 43
 *                 question_id:
 *                   type: integer
 *                   description: The ID of the question to add to the question set.
 *                   example: 6
 *                 userId:
 *                   type: integer
 *                   description: ID of the user who created this question association.
 *                   example: 43
 *     responses:
 *       201:
 *         description: Successfully created new QuestionSetQuestion entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique identifier for the created QuestionSetQuestion.
 *                     example: 212
 *                   question_set_id:
 *                     type: integer
 *                     description: The ID of the question set associated with this question.
 *                     example: 43
 *                   question_id:
 *                     type: integer
 *                     description: The ID of the question added to the question set.
 *                     example: 6
 *                   created_by:
 *                     type: integer
 *                     description: ID of the user who created this question association.
 *                     example: 43
 *                   modified_by:
 *                     type: integer
 *                     nullable: true
 *                     description: ID of the user who last modified this question association.
 *                     example: 43
 *       400:
 *         description: Bad Request. Invalid input or missing fields.
 *       500:
 *         description: Internal Server Error. Could not create the QuestionSetQuestion entries.
 */


    // Create a new QuestionSetQuestion
    router.post("/", QuestionSetQuestion.create);
  
  /**
 * @swagger
 * /api/questionset/question/{id}:
 *   delete:
 *     summary: Delete all QuestionSetQuestions for a specific Question Set
 *     description: Deletes all QuestionSetQuestion entries associated with a specific Question Set ID.
 *     tags: [QuestionSet Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Question Set ID for which all associated questions should be deleted.
 *         schema:
 *           type: integer
 *           example: 43
 *     responses:
 *       200:
 *         description: Successfully deleted all QuestionSetQuestions for the specified Question Set.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All QuestionSetQuestions for the specified Question Set were deleted successfully."
 *       404:
 *         description: No QuestionSetQuestions found for the specified Question Set ID.
 *       500:
 *         description: Internal Server Error. Could not delete QuestionSetQuestions.
 */
    // Delete a QuestionSetQuestion with id
    router.delete("/:id", QuestionSetQuestion.delete);
  
    /**
 * @swagger
 * /api/questionset/question:
 *   delete:
 *     summary: Delete all QuestionSetQuestions
 *     description: Deletes all entries in the QuestionSetQuestion table.
 *     tags: [QuestionSet Question]
 *     responses:
 *       200:
 *         description: Successfully deleted all QuestionSetQuestions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All QuestionSetQuestions were deleted successfully."
 *       500:
 *         description: Internal Server Error. Could not delete all QuestionSetQuestions.
 */
    // Delete all QuestionSetQuestions
    router.delete("/", QuestionSetQuestion.deleteAll);

   
  
    app.use('/api/questionset/question', router);
  };
  