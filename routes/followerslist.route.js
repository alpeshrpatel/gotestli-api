const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const FollowersList = require("../controller/followerslist.controller");
  
    var router = require("express").Router();
  
    /**
 * @swagger
 * /api/followers/list:
 *   post:
 *     summary: Create a new entry in the followers list
 *     tags: [Followers List]
 *     requestBody:
 *       description: Follower record to be added to the list
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instructor_id:
 *                 type: integer
 *                 description: ID of the instructor being followed
 *               follower_id:
 *                 type: integer
 *                 description: ID of the follower
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date when the follower started following
 *             example:
 *               instructor_id: 42
 *               follower_id: 41
 *               date: "2024-09-18T04:06:08Z"
 *     responses:
 *       201:
 *         description: Successfully created a new follower record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique ID of the newly created follower record
 *                   example: 32
 *                 instructor_id:
 *                   type: integer
 *                   description: ID of the instructor being followed
 *                 follower_id:
 *                   type: integer
 *                   description: ID of the follower
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: Date when the follower started following
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

    // Create a new FollowersList
    router.post("/", FollowersList.create);
  
    /**
 * @swagger
 * /api/followers/list/{id}:
 *   get:
 *     summary: Retrieve a follower record by ID
 *     tags: [Followers List]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the follower record to retrieve
 *     responses:
 *       200:
 *         description: Follower record found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique ID of the follower record
 *                   example: 32
 *                 instructor_id:
 *                   type: integer
 *                   description: ID of the instructor being followed
 *                   example: 42
 *                 follower_id:
 *                   type: integer
 *                   description: ID of the follower
 *                   example: 41
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: Date when the follower started following
 *                   example: "2024-09-18T04:06:08Z"
 *       404:
 *         description: Follower record not found
 *       500:
 *         description: Internal server error
 */

    router.get("/:id",cacheMiddleware,FollowersList.findById);
    
    router.get("/follower/detail/:id",cacheMiddleware,FollowersList.getFollowerDetail)

    router.get("/instructor/follower/:id",FollowersList.getInsFollowerCnt)
    /**
 * @swagger
 * /api/followers/list/instructor/{instructor_id}/follower/{follower_id}:
 *   delete:
 *     summary: Delete a follower record by instructor and follower ID
 *     tags: [Followers List]
 *     parameters:
 *       - in: path
 *         name: instructor_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the instructor
 *       - in: path
 *         name: follower_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the follower
 *     responses:
 *       200:
 *         description: Follower record successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Follower record deleted successfully"
 *       404:
 *         description: Follower record not found
 *       500:
 *         description: Internal server error
 */

    // Delete a FollowersList with id
    router.delete("/instructor/:instructor_id/follower/:follower_id", FollowersList.delete);
  
    /**
 * @swagger
 * /api/followers/list:
 *   delete:
 *     summary: Delete all follower records
 *     tags: [Followers List]
 *     responses:
 *       200:
 *         description: All follower records successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All follower records deleted successfully"
 *       500:
 *         description: Internal server error
 */

    // Delete all FollowersLists
    router.delete("/", FollowersList.deleteAll);

   
  
    app.use('/api/followers/list', router);
  };
  