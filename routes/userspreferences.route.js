module.exports = app => {
    const UsersPreferences = require("../controller/userspreferences.controller");
  
    var router = require("express").Router();
  
    /**
 * @swagger
 * /api/users/preference:
 *   post:
 *     summary: Create a new User Preference
 *     tags: [Users Preferences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 42
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               created_by:
 *                 type: integer
 *                 example: 42
 *               created_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-17T16:35:34.000Z"
 *               modified_by:
 *                 type: integer
 *                 example: 42
 *               modified_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-17T16:35:34.000Z"
 *     responses:
 *       201:
 *         description: User preference created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 220
 *                 user_id:
 *                   type: integer
 *                   example: 42
 *                 category_id:
 *                   type: integer
 *                   example: 2
 *                 created_by:
 *                   type: integer
 *                   example: 42
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-17T16:35:34.000Z"
 *                 modified_by:
 *                   type: integer
 *                   example: 42
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-17T16:35:34.000Z"
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Server error
 */

    // Create a new UsersPreferences
    router.post("/", UsersPreferences.create);
  
    /**
 * @swagger
 * /api/users/preference/{id}:
 *   get:
 *     summary: Retrieve a User Preference by ID
 *     tags: [Users Preferences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 220
 *         description: The User ID of the user to retrieve Preferences
 *     responses:
 *       200:
 *         description: User preference data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 220
 *                 user_id:
 *                   type: integer
 *                   example: 42
 *                 category_id:
 *                   type: integer
 *                   example: 2
 *                 created_by:
 *                   type: integer
 *                   example: 42
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-17T16:35:34.000Z"
 *                 modified_by:
 *                   type: integer
 *                   example: 42
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-17T16:35:34.000Z"
 *       404:
 *         description: User preference not found
 *       500:
 *         description: Server error
 */

    router.get("/:id",UsersPreferences.findById);
    
    /**
 * @swagger
 * /api/users/preference/{id}:
 *   delete:
 *     summary: Delete a User Preference by ID
 *     tags: [Users Preferences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 220
 *         description: The ID of the user preference to delete
 *     responses:
 *       200:
 *         description: User preference deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User preference deleted successfully
 *       404:
 *         description: User preference not found
 *       500:
 *         description: Server error
 */

    // Delete a UsersPreferences with id
    router.delete("/:id", UsersPreferences.delete);
  
    // Delete all UsersPreferencess
    // router.delete("/", UsersPreferences.deleteAll);

    /**
 * @swagger
 * /api/users/preference/categories/{id}:
 *   get:
 *     summary: Retrieve categories by user ID
 *     description: Returns a list of category IDs associated with a specific user.
 *     tags: [Users Preferences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 42
 *         description: The user ID for which to retrieve category IDs
 *     responses:
 *       200:
 *         description: A list of category IDs associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category_id:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: No categories found for the specified user ID
 *       500:
 *         description: Server error
 */

    // Retrieve a categories with question_id
    router.get("/categories/:id", UsersPreferences.getCategoriesByUserId);
  
    app.use('/api/users/preference', router);
  };
  