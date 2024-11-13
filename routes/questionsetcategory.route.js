module.exports = app => {
    const QuestionSetCategory = require("../controller/questionsetcategory.controller");
  
    var router = require("express").Router();
  
   /**
 * @swagger
 * /api/questionset/category:
 *   post:
 *     summary: Create a new QuestionSetCategory
 *     description: Adds a new category to a specific question set.
 *     tags: [QuestionSet Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagsId:
 *                 type: string
 *                 description: A comma-separated list of category IDs to associate with the question set.
 *                 example: "1,2,3"
 *               questionSetId:
 *                 type: integer
 *                 description: The ID of the question set associated with these categories.
 *                 example: 43
 *               userId:
 *                 type: integer
 *                 description: The ID of the user creating the category association.
 *                 example: 10
 *     responses:
 *       201:
 *         description: Successfully created a new QuestionSetCategory.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created QuestionSetCategory.
 *                   example: 1
 *                 question_set_id:
 *                   type: integer
 *                   description: The ID of the question set associated with these categories.
 *                   example: 43
 *                 category_id:
 *                   type: integer
 *                   description: The ID of the category associated with the question set.
 *                   example: 5
 *                 created_by:
 *                   type: integer
 *                   description: The ID of the user who created this category association.
 *                   example: 10
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time the category was created.
 *                   example: "2024-08-21T20:57:53Z"
 *                 modified_by:
 *                   type: integer
 *                   nullable: true
 *                   description: The ID of the user who last modified this category association.
 *                   example: null
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: The date and time the category was last modified.
 *                   example: "2024-08-21T20:57:53Z"
 *       400:
 *         description: Bad Request. Invalid input or missing fields.
 *       500:
 *         description: Internal Server Error. Could not create the QuestionSetCategory.
 */

    // Create a new QuestionSetCategory
    router.post("/", QuestionSetCategory.create);
  
  /**
 * @swagger
 * /api/questionset/category/{id}:
 *   delete:
 *     summary: Delete a QuestionSetCategory by ID
 *     description: Deletes a specific QuestionSetCategory based on its unique ID.
 *     tags: [QuestionSet Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the QuestionSetCategory to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the QuestionSetCategory.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QuestionSetCategory deleted successfully."
 *       400:
 *         description: Bad Request. Invalid ID supplied.
 *       404:
 *         description: QuestionSetCategory with the specified ID not found.
 *       500:
 *         description: Internal Server Error. Could not delete the QuestionSetCategory.
 */

    // Delete a QuestionSetCategory with id
    router.delete("/:id", QuestionSetCategory.delete);
  
    /**
 * @swagger
 * /api/questionset/category:
 *   delete:
 *     summary: Delete all QuestionSetCategories
 *     description: Deletes all existing QuestionSetCategories in the database.
 *     tags: [QuestionSet Category]
 *     responses:
 *       200:
 *         description: Successfully deleted all QuestionSetCategories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All QuestionSetCategories have been deleted successfully."
 *       500:
 *         description: Internal Server Error. Could not delete all QuestionSetCategories.
 */

    // Delete all QuestionSetCategorys
    router.delete("/", QuestionSetCategory.deleteAll);

    /**
 * @swagger
 * /api/questionset/category/questionset/{id}:
 *   get:
 *     summary: Retrieve categories by QuestionSet ID
 *     description: Retrieves all category IDs associated with a specified QuestionSet ID.
 *     tags: [QuestionSet Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the QuestionSet to retrieve categories for.
 *         schema:
 *           type: integer
 *           example: 43
 *     responses:
 *       200:
 *         description: Successfully retrieved categories for the specified QuestionSet ID.
 *         content:
 *           application/json:
 *             example:
 *               - category_id: 5
 *               - category_id: 32
 *             properties:
 *               category_id:
 *                 type: integer
 *                 description: The ID of each category associated with the specified QuestionSet.
 *       404:
 *         description: QuestionSet with the specified ID not found.
 *       500:
 *         description: Internal Server Error. Could not retrieve categories for the QuestionSet.
 */

    // Retrieve a categories with question_id
    router.get("/questionset/:id", QuestionSetCategory.getCategoriesByQuestionSetId);
  
    app.use('/api/questionset/category', router);
  };
  