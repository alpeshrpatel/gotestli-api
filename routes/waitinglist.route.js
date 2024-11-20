const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const WaitingList = require("../controller/waitinglist.controller");
  
    var router = require("express").Router();
  
    /**
 * @swagger
 * /api/waitinglist:
 *   post:
 *     summary: Create a new entry in the waiting list
 *     description: Adds a new email to the waiting list with the date it was subscribed.
 *     tags: [Waiting List]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "dipakkarmur45@gmail.com"
 *                 description: The email address of the person subscribing to the waiting list.
 *               date_subscribed:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-30 21:09:53"
 *                 description: The date and time when the email was added to the waiting list.
 *     responses:
 *       201:
 *         description: Successfully created a new entry in the waiting list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 34
 *                 email:
 *                   type: string
 *                   example: "dipakkarmur45@gmail.com"
 *                 date_subscribed:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-30 21:09:53"
 *       400:
 *         description: Invalid input, unable to add to waiting list
 *       500:
 *         description: Server error
 */

    // Create a new WaitingList
    router.post("/", WaitingList.create);
  
    /**
 * @swagger
 * /api/waitinglist/{id}:
 *   get:
 *     summary: Retrieve a waiting list entry by ID
 *     description: Fetches a specific waiting list entry based on the provided ID.
 *     tags: [Waiting List]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the waiting list entry to retrieve.
 *         schema:
 *           type: integer
 *           example: 34
 *     responses:
 *       200:
 *         description: Successfully retrieved the waiting list entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 34
 *                 email:
 *                   type: string
 *                   example: "dipakkarmur45@gmail.com"
 *                 date_subscribed:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-30 21:09:53"
 *       404:
 *         description: Waiting list entry not found
 *       500:
 *         description: Server error
 */

    router.get("/:id",cacheMiddleware,WaitingList.findById);
  
    /**
 * @swagger
 * /api/waitinglist:
 *   delete:
 *     summary: Delete all entries in the waiting list
 *     description: Removes all entries from the waiting list.
 *     tags: [Waiting List]
 *     responses:
 *       200:
 *         description: Successfully deleted all waiting list entries
 *       500:
 *         description: Server error
 */

    // Delete all WaitingLists
    router.delete("/", WaitingList.deleteAll);

   
  
    app.use('/api/waitinglist', router);
  };
  