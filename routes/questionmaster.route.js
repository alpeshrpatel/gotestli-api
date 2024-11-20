const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const questionmaster = require("../controller/questionmaster.controller");
  
    var router = require("express").Router();
  
    /**
 * @swagger
 * /api/questionmaster:
 *   post:
 *     summary: Create a new Question
 *     description: Creates a new question with the provided details.
 *     tags: [Question Master]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               org_id:
 *                 type: integer
 *                 description: The ID of the organization creating the question set.
 *                 example: 10
 *               question:
 *                 type: string
 *                 description: The question text.
 *                 example: "What is a greenhouse made from?"
 *               description:
 *                 type: string
 *                 description: The detailed description of the question.
 *                 example: "What is a greenhouse made from?"
 *               paragraph_id:
 *                 type: integer
 *                 description: The ID of the related paragraph, if any.
 *                 example: null
 *               question_type_id:
 *                 type: integer
 *                 description: The ID that represents the type of question.
 *                 example: 2
 *               status_id:
 *                 type: integer
 *                 description: The ID representing the question's status (active/inactive).
 *                 example: 1
 *               max_option_selection:
 *                 type: integer
 *                 description: The maximum number of options a user can select for this question.
 *                 example: null
 *               complexity:
 *                 type: string
 *                 description: The complexity level of the question.
 *                 example: "easy"
 *               marks:
 *                 type: integer
 *                 description: The number of marks assigned for answering the question.
 *                 example: 10
 *               is_negative:
 *                 type: integer
 *                 description: Whether the question has negative marking (1 for true, 0 for false).
 *                 example: 0
 *               negative_marks:
 *                 type: number
 *                 description: The number of negative marks deducted for incorrect answers.
 *                 example: 10.00
 *             required:
 *               - org_id
 *               - question
 *               - question_type_id
 *               - status_id
 *               - complexity
 *               - marks
 *               - is_negative
 *               - negative_marks
 *     responses:
 *       201:
 *         description: Successfully created the new QuestionSet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created question set.
 *                   example: 1
 *                 org_id:
 *                   type: integer
 *                   description: The ID of the organization.
 *                   example: 10
 *                 question:
 *                   type: string
 *                   description: The question text.
 *                   example: "What is a greenhouse made from?"
 *                 description:
 *                   type: string
 *                   description: The detailed description of the question.
 *                   example: "What is a greenhouse made from?"
 *                 paragraph_id:
 *                   type: integer
 *                   description: The ID of the related paragraph, if any.
 *                   example: null
 *                 question_type_id:
 *                   type: integer
 *                   description: The ID that represents the type of question.
 *                   example: 2
 *                 status_id:
 *                   type: integer
 *                   description: The ID representing the question's status (active/inactive).
 *                   example: 1
 *                 max_option_selection:
 *                   type: integer
 *                   description: The maximum number of options a user can select for this question.
 *                   example: null
 *                 complexity:
 *                   type: string
 *                   description: The complexity level of the question.
 *                   example: "easy"
 *                 marks:
 *                   type: integer
 *                   description: The number of marks assigned for answering the question.
 *                   example: 10
 *                 is_negative:
 *                   type: integer
 *                   description: Whether the question has negative marking (1 for true, 0 for false).
 *                   example: 0
 *                 negative_marks:
 *                   type: number
 *                   description: The number of negative marks deducted for incorrect answers.
 *                   example: 10.00
 *       400:
 *         description: Bad Request - Invalid data or missing required fields
 *       500:
 *         description: Server error
 */

    // Create a new QuestionSet
    router.post("/", questionmaster.create);
  
    /**
 * @swagger
 * /api/questionmaster/{id}:
 *   get:
 *     summary: Retrieve a single QuestionSet by ID
 *     description: Retrieves a single question set based on the provided ID. The response contains only the question text.
 *     tags: [Question Master]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the question set to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the question set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: string
 *                   description: The question text for the given question set.
 *                   example: "What is a greenhouse made from?"
 *       404:
 *         description: QuestionSet not found with the provided ID
 *       500:
 *         description: Server error
 */

    // Retrieve a single QuestionSet with id
    router.get("/:id",cacheMiddleware, questionmaster.findOne);
  
    /**
 * @swagger
 * /api/questionmaster:
 *   get:
 *     summary: Retrieve all QuestionSets
 *     description: Retrieves a list of all question sets available in the database.
 *     tags: [Question Master]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of question sets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the question set
 *                     example: 1
 *                   question:
 *                     type: string
 *                     description: The question text for the question set
 *                     example: "What is a greenhouse made from?"
 *                   description:
 *                     type: string
 *                     description: Additional description for the question set
 *                     example: "This question is related to basic biology."
 *                   complexity:
 *                     type: string
 *                     description: The complexity level of the question
 *                     example: "easy"
 *                   marks:
 *                     type: integer
 *                     description: Marks assigned to the question
 *                     example: 10
 *                   created_by:
 *                     type: integer
 *                     description: ID of the user who created the question set
 *                     example: 10
 *                   created_date:
 *                     type: string
 *                     format: date-time
 *                     description: The date when the question set was created
 *                     example: "2020-05-05T00:26:59"
 *       500:
 *         description: Server error
 */

    // Retrieve a single QuestionSet with id
    router.get("/",cacheMiddleware, questionmaster.findAll);

    /**
 * @swagger
 * /api/questionmaster/paragraph/{id}:
 *   get:
 *     summary: Retrieve a paragraph associated with a question
 *     description: Retrieves a paragraph from another table based on the question's ID.
 *     tags: [Question Master]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the question for which the paragraph is retrieved.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the paragraph related to the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paragraph_id:
 *                   type: integer
 *                   description: The ID of the paragraph
 *                   example: 3
 *                 paragraph_text:
 *                   type: string
 *                   description: The text content of the paragraph
 *                   example: "A greenhouse is typically made of glass or clear plastic to allow sunlight to pass through and heat the plants inside."
 *                 created_by:
 *                   type: integer
 *                   description: ID of the user who created the paragraph
 *                   example: 10
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   description: The date when the paragraph was created
 *                   example: "2020-05-05T00:26:59"
 *       404:
 *         description: Paragraph not found for the provided question ID
 *       500:
 *         description: Server error
 */

    // Retrieve a paragraph of question
    router.get("/paragraph/:id",cacheMiddleware, questionmaster.findParagraph)
    
   /**
 * @swagger
 * /api/questionmaster/{id}:
 *   put:
 *     summary: Update a specific QuestionSet
 *     description: Updates a question in the question master based on the provided question ID.
 *     tags: [Question Master]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the question to be updated.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: The question details to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The new question text.
 *                 example: "What is a greenhouse made of?"
 *               description:
 *                 type: string
 *                 description: The description of the question.
 *                 example: "A greenhouse is a building that is used to grow plants."
 *               paragraph_id:
 *                 type: integer
 *                 description: The ID of the associated paragraph, if any.
 *                 example: 3
 *               question_type_id:
 *                 type: integer
 *                 description: The type of the question (e.g., multiple choice, true/false).
 *                 example: 2
 *               status_id:
 *                 type: integer
 *                 description: The status of the question (e.g., active, inactive).
 *                 example: 1
 *               max_option_selection:
 *                 type: integer
 *                 description: The maximum number of options a user can select (if applicable).
 *                 example: 4
 *               complexity:
 *                 type: string
 *                 description: The complexity level of the question.
 *                 example: "easy"
 *               marks:
 *                 type: integer
 *                 description: The marks awarded for the question.
 *                 example: 10
 *               is_negative:
 *                 type: integer
 *                 description: Whether the question has negative marking (0 for no, 1 for yes).
 *                 example: 0
 *               negative_marks:
 *                 type: number
 *                 description: The negative marks for the question, if applicable.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully updated the question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the updated question.
 *                   example: 1
 *                 question:
 *                   type: string
 *                   description: The updated question text.
 *                   example: "What is a greenhouse made of?"
 *                 description:
 *                   type: string
 *                   description: The updated description of the question.
 *                   example: "A greenhouse is a building that is used to grow plants."
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the question was last updated.
 *                   example: "2024-11-08T12:00:00Z"
 *       400:
 *         description: Invalid input, object invalid
 *       404:
 *         description: Question with the specified ID not found
 *       500:
 *         description: Server error
 */

    // Update a QuestionSet with id
    router.put("/:id", questionmaster.update);
  
    /**
 * @swagger
 * /api/questionmaster/{id}:
 *   delete:
 *     summary: Delete a specific Question by ID
 *     description: Deletes a question in the question master by the provided question ID.
 *     tags: [Question Master]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the question to be deleted.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming the deletion.
 *                   example: "Question with ID 1 has been deleted."
 *       404:
 *         description: Question with the specified ID not found
 *       500:
 *         description: Server error
 */



    // Delete a QuestionSet with id
    router.delete("/:id", questionmaster.delete);
  
    /**
 * @swagger
 * /api/questionmaster:
 *   delete:
 *     summary: Delete all Questions
 *     description: Deletes all questions in the question master.
 *     tags: [Question Master]
 *     responses:
 *       200:
 *         description: Successfully deleted all questions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming all questions were deleted.
 *                   example: "All questions have been deleted."
 *       500:
 *         description: Server error
 */
    // Delete all QuestionSets
    router.delete("/", questionmaster.deleteAll);
  
    app.use('/api/questionmaster', router);
  };
  