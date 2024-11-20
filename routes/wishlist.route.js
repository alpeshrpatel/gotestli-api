const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const WishList = require("../controller/wishList.controller");
  
    var router = require("express").Router();
  
    // Create a new WishList
    /**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Create a new WishList entry
 *     description: Adds a new WishList entry with the given details.
 *     tags: [WishList]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionset_id:
 *                 type: integer
 *                 example: 44
 *               user_id:
 *                 type: integer
 *                 example: 45
 *               created_by:
 *                 type: integer
 *                 example: 45
 *               modified_by:
 *                 type: integer
 *                 example: 45
 *               created_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-28 09:36:07"
 *               modified_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-28 09:36:07"
 *     responses:
 *       201:
 *         description: Successfully created a new WishList entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 71
 *                 questionset_id:
 *                   type: integer
 *                   example: 44
 *                 user_id:
 *                   type: integer
 *                   example: 45
 *                 created_by:
 *                   type: integer
 *                   example: 45
 *                 modified_by:
 *                   type: integer
 *                   example: 45
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-28 09:36:07"
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-28 09:36:07"
 *       400:
 *         description: Bad request, missing required fields or invalid data
 *       500:
 *         description: Server error
 */

    router.post("/", WishList.create);
  
    /**
 * @swagger
 * /api/wishlist/{id}:
 *   get:
 *     summary: Retrieve a WishList entry by UserID
 *     description: Fetches a WishList entry using the provided UserID.
 *     tags: [WishList]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The UserID of the WishList entry to retrieve.
 *         schema:
 *           type: integer
 *           example: 71
 *     responses:
 *       200:
 *         description: Successfully retrieved the WishList of a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 71
 *                 questionset_id:
 *                   type: integer
 *                   example: 44
 *                 user_id:
 *                   type: integer
 *                   example: 45
 *                 created_by:
 *                   type: integer
 *                   example: 45
 *                 modified_by:
 *                   type: integer
 *                   example: 45
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-28 09:36:07"
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-28 09:36:07"
 *       404:
 *         description: WishList entry not found for the given UserID
 *       500:
 *         description: Server error
 */

    router.get("/:id",WishList.findById);

     /**
 * @swagger
 * /api/wishlist/getqsetid/{id}:
 *   get:
 *     summary: Retrieve a WishList entry by UserID
 *     description: Fetches a WishList entry using the provided UserID.
 *     tags: [WishList]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The UserID of the WishList entry to retrieve.
 *         schema:
 *           type: integer
 *           example: 71
 *     responses:
 *       200:
 *         description: Successfully retrieved the WishList of a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 71
 *                 questionset_id:
 *                   type: integer
 *                   example: 44
 *                 user_id:
 *                   type: integer
 *                   example: 45
 *                 created_by:
 *                   type: integer
 *                   example: 45
 *                 modified_by:
 *                   type: integer
 *                   example: 45
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-28 09:36:07"
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-28 09:36:07"
 *       404:
 *         description: WishList entry not found for the given UserID
 *       500:
 *         description: Server error
 */

     router.get("/getqsetid/:id",WishList.getQsetId);
  
    /**
 * @swagger
 * /api/wishlist/qset/{questionSetId}/user/{userId}:
 *   delete:
 *     summary: Delete a WishList entry by QuestionSet ID and User ID
 *     description: Deletes a specific WishList entry using the provided `questionSetId` and `userId`.
 *     tags: [WishList]
 *     parameters:
 *       - in: path
 *         name: questionSetId
 *         required: true
 *         description: The ID of the Question Set related to the WishList entry.
 *         schema:
 *           type: integer
 *           example: 44
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user related to the WishList entry.
 *         schema:
 *           type: integer
 *           example: 45
 *     responses:
 *       200:
 *         description: Successfully deleted the WishList entry
 *       404:
 *         description: WishList entry not found for the provided QuestionSet ID and User ID
 *       500:
 *         description: Server error
 */

    // Delete WishLists
    router.delete("/qset/:questionSetId/user/:userId", WishList.deleteOne);

   
  
    app.use('/api/wishlist', router);
  };
  