const { cacheMiddleware, cache } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const options = require("../controller/questionoptions.controller");
  
    var router = require("express").Router();
  
  
    /**
 * @swagger
 * /api/options/{id}:
 *   get:
 *     summary: Retrieve options for a specific question by question ID
 *     description: Fetches options associated with a specific question by its question ID.
 *     tags: [Options]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the question for which to retrieve options.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved options for the specified question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question_option:
 *                   type: string
 *                   description: Options related to the question.
 *                   example: "Option A, Option B, Option C"
 *       404:
 *         description: Question with the specified ID not found or has no options
 *       500:
 *         description: Server error
 */

    // Retrieve a single options with id
    router.get("/:id", options.findOne);

    /**
 * @swagger
 * /api/options:
 *   get:
 *     summary: Retrieve all question options
 *     description: Fetches a list of all question options.
 *     tags: [Options]
 *     responses:
 *       200:
 *         description: Successfully retrieved all question options.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question_options:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique identifier for the option.
 *                         example: 1
 *                       question_id:
 *                         type: integer
 *                         description: The ID of the question associated with this option.
 *                         example: 1
 *                       question_option:
 *                         type: string
 *                         description: Text of the option.
 *                         example: "Wood"
 *                       is_correct_answer:
 *                         type: integer
 *                         description: Indicates if the option is the correct answer (1 = correct, 0 = incorrect).
 *                         example: 0
 *                       created_by:
 *                         type: integer
 *                         description: ID of the user who created this option.
 *                         example: 10
 *                       created_date:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of option creation.
 *                         example: "2020-05-05T00:28:41"
 *                       modified_by:
 *                         type: integer
 *                         description: ID of the user who last modified this option.
 *                         example: 10
 *                       modified_date:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of last modification.
 *                         example: "2020-05-05T00:28:41"
 *       500:
 *         description: Server error
 */

    // Retrieve all the options
    router.get("/",cacheMiddleware, options.findAll);

  /**
 * @swagger
 * /api/options/{id}:
 *   delete:
 *     summary: Delete an option by ID
 *     description: Deletes a question option by its unique ID.
 *     tags: [Options]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the option to delete.
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the option.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Option was deleted successfully!"
 *       404:
 *         description: Option not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Option not found with id 1."
 *       500:
 *         description: Server error.
 */

    // Delete a options with id
    router.delete("/:id", options.delete);
  
    /**
 * @swagger
 * /api/options:
 *   delete:
 *     summary: Delete all options
 *     description: Deletes all question options from the database.
 *     tags: [Options]
 *     responses:
 *       200:
 *         description: All options were deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All options were deleted successfully!"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting all options."
 */

    // Delete all optionss
    router.delete("/", options.deleteAll);

    router.post("/",options.create)
 
    app.use('/api/options', router);
  };
  