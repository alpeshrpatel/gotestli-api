const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const Badge = require("../controller/badge.controller");
  
    var router = require("express").Router();
  
    /**
 * @swagger
 * /api/badge/qsetid/{id}/userid/{userId}:
 *   put:
 *     summary: Create a new badge for a user
 *     tags: [Badge]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question set
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to assign the badge to
 *     requestBody:
 *       description: Badge object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               badge_name:
 *                 type: string
 *                 example: "Legend"
 *               count:
 *                 type: integer
 *                 example: 83
 *               category_id:
 *                 type: integer
 *                 example: 8
 *               questionset_id:
 *                 type: integer
 *                 example: 44
 *               user_id:
 *                 type: integer
 *                 example: 41
 *               created_by:
 *                 type: string
 *                 example: "41"
 *               modified_by:
 *                 type: string
 *                 example: "41"
 *               created_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-18 23:50:10"
 *               modified_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-11-04 16:55:38"
 *     responses:
 *       200:
 *         description: Badge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                
 *                 badge_name:
 *                   type: string
 *                   example: "Legend"
 *                 count:
 *                   type: integer
 *                   example: 83
 *                 category_id:
 *                   type: integer
 *                   example: 8
 *                 questionset_id:
 *                   type: integer
 *                   example: 44
 *                 user_id:
 *                   type: integer
 *                   example: 41
 *                 created_by:
 *                   type: string
 *                   example: "41"
 *                 modified_by:
 *                   type: string
 *                   example: "41"
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-18 23:50:10"
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-04 16:55:38"
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Question set or user not found
 *       500:
 *         description: Internal server error
 */

    // Create a new Badge
    router.put("/qsetid/:id/userid/:userId", Badge.create);

    /**
 * @swagger
 * /api/badge/{id}:
 *   get:
 *     summary: Get badges of a user
 *     tags: [Badge]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose badges are to be retrieved
 *     responses:
 *       200:
 *         description: List of badges for the specified user
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 badge_id:
 *                   type: integer
 *                   example: 107
 *                 badge_name:
 *                   type: string
 *                   example: "Trailblazer"
 *                 count:
 *                   type: integer
 *                   example: 8
 *                 category_id:
 *                   type: integer
 *                   example: 2
 *                 questionset_id:
 *                   type: integer
 *                   example: 44
 *                 user_id:
 *                   type: integer
 *                   example: 41
 *                 created_by:
 *                   type: string
 *                   example: "41"
 *                 modified_by:
 *                   type: string
 *                   example: "41"
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-18T18:20:10.000Z"
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-08T07:07:42.000Z"
 *                 title:
 *                   type: string
 *                   example: "Web Development"
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: No badges found for the specified user
 *       500:
 *         description: Internal server error
 */

    //get a badges of a user
    router.get("/:id",cacheMiddleware, Badge.getBadges);
  
  
   
  
    app.use('/api/badge', router);
  };
  