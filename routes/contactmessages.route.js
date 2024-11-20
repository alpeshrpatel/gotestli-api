const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const ContactMessages = require("../controller/contactmessages.controller");
  
    var router = require("express").Router();
  
    /**
 * @swagger
 * /api/contact/messages:
 *   post:
 *     summary: Create a new Contact Message
 *     tags: [Contact Messages]
 *     requestBody:
 *       description: Contact message object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "DIPAK KARMUR"
 *               email:
 *                 type: string
 *                 example: "vivek@gmail.com"
 *               message:
 *                 type: string
 *                 example: "Hello, your website is good"
 *     responses:
 *       201:
 *         description: Contact message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 
 *                 name:
 *                   type: string
 *                   example: "DIPAK KARMUR"
 *                 email:
 *                   type: string
 *                   example: "vivek@gmail.com"
 *                 message:
 *                   type: string
 *                   example: "Hello, your website is good"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-15T12:55:00.000Z"
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

    // Create a new ContactMessages
    router.post("/", ContactMessages.create);
  
    /**
 * @swagger
 * /api/contact/messages/{id}:
 *   get:
 *     summary: Retrieve a contact message by ID
 *     tags: [Contact Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact message to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Contact message retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "DIPAK KARMUR"
 *                 email:
 *                   type: string
 *                   example: "vivek@gmail.com"
 *                 message:
 *                   type: string
 *                   example: "Hello, your website is good"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-13T12:50:24.000Z"
 *       404:
 *         description: Contact message not found
 *       500:
 *         description: Internal server error
 */

    router.get("/:id",cacheMiddleware,ContactMessages.findById);
  
    /**
 * @swagger
 * /api/contact/messages:
 *   delete:
 *     summary: Delete all contact messages
 *     tags: [Contact Messages]
 *     responses:
 *       200:
 *         description: All contact messages deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All contact messages were deleted successfully."
 *       500:
 *         description: Internal server error
 */

    // Delete all ContactMessagess
    router.delete("/", ContactMessages.deleteAll);

   
  
    app.use('/api/contact/messages', router);
  };
  