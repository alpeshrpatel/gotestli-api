const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const users = require("../controller/users.controller");
  
    var router = require("express").Router();
   /**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       description: User object to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip_address:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               activation_selector:
 *                 type: string
 *                 nullable: true
 *               activation_code:
 *                 type: string
 *                 nullable: true
 *               forgotten_password_selector:
 *                 type: string
 *                 nullable: true
 *               forgotten_password_code:
 *                 type: string
 *                 nullable: true
 *               forgotten_password_time:
 *                 type: integer
 *                 nullable: true
 *               remember_selector:
 *                 type: string
 *                 nullable: true
 *               remember_code:
 *                 type: string
 *                 nullable: true
 *               created_on:
 *                 type: integer
 *               last_login:
 *                 type: integer
 *               active:
 *                 type: integer
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *                 nullable: true
 *               company:
 *                 type: string
 *                 nullable: true
 *               phone:
 *                 type: string
 *                 nullable: true
 *               profile_pic:
 *                 type: string
 *                 nullable: true
 *               created_by:
 *                 type: string
 *                 nullable: true
 *               created_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               modified_by:
 *                 type: string
 *                 nullable: true
 *               modified_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               is_delete:
 *                 type: integer
 *               uid:
 *                 type: string
 *                 nullable: true
 *               role:
 *                 type: string
 *                 nullable: true
 *               provider:
 *                 type: string
 *                 nullable: true
 *             example:
 *               ip_address: "127.0.0.1"
 *               username: "admin@admin.com"
 *               password: "$2y$12$njXErG4s7Kc0x03e5QFxNe1EyAAoc6ut.o37BZWlqZbL4uBJ5tCjq"
 *               email: "admin@admin.com"
 *               activation_selector: null
 *               activation_code: ""
 *               forgotten_password_selector: null
 *               forgotten_password_code: null
 *               forgotten_password_time: null
 *               remember_selector: null
 *               remember_code: null
 *               created_on: 1268889823
 *               last_login: 1592751745
 *               active: 1
 *               first_name: "Admin"
 *               last_name: "istrator"
 *               company: "ADMIN"
 *               phone: "0"
 *               profile_pic: null
 *               created_by: null
 *               created_date: "2024-01-01T12:00:00Z"
 *               modified_by: null
 *               modified_date: "2024-01-02T12:00:00Z"
 *               is_delete: 0
 *               uid: ""
 *               role: null
 *               provider: null
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid request
 */

    // Create a new user
    router.post("/", users.create);

    /**
 * @swagger
 * /api/users/generate/token/{id}:
 *   get:
 *     summary: Generate JWT token for a logged-in user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to generate the token for
 *     responses:
 *       200:
 *         description: JWT token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Generated JWT token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

    // generate token for logged in user
    router.get("/generate/token/:id", users.generateToken);
  
    /**
 * @swagger
 * /api/users/{userid}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 41
 *                 ip_address:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 username:
 *                   type: string
 *                   example: "gotestli2@gmail.com"
 *                 password:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 email:
 *                   type: string
 *                   example: "gotestli2@gmail.com"
 *                 activation_selector:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 activation_code:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 forgotten_password_selector:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 forgotten_password_code:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 forgotten_password_time:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 remember_selector:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 remember_code:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 created_on:
 *                   type: integer
 *                   example: 1725975480059
 *                 last_login:
 *                   type: integer
 *                   example: 1725975480059
 *                 active:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 first_name:
 *                   type: string
 *                   example: "gotestli23"
 *                 last_name:
 *                   type: string
 *                   example: "swat"
 *                 company:
 *                   type: string
 *                   example: "abc ltd."
 *                 phone:
 *                   type: string
 *                   example: "7567446"
 *                 profile_pic:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 created_by:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-10T13:37:59.000Z"
 *                 modified_by:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-12T05:48:20.000Z"
 *                 is_delete:
 *                   type: integer
 *                   example: 0
 *                 uid:
 *                   type: string
 *                   example: "ChsZ4b7ctQe63FbAtFRFoUTjJVq2"
 *                 role:
 *                   type: string
 *                   example: "student"
 *                 provider:
 *                   type: string
 *                   example: "manual"
 *                 tags:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

    // Retrieve a single users with id
    router.get("/:userid",cacheMiddleware, users.findOne);

    /**
 * @swagger
 * /api/users/uid/{uid}:
 *   get:
 *     summary: Retrieve a user's data by UID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: The UID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 41
 *                 ip_address:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 username:
 *                   type: string
 *                   example: "gotestli2@gmail.com"
 *                 password:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 email:
 *                   type: string
 *                   example: "gotestli2@gmail.com"
 *                 activation_selector:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 activation_code:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 forgotten_password_selector:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 forgotten_password_code:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 forgotten_password_time:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 remember_selector:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 remember_code:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 created_on:
 *                   type: integer
 *                   example: 1725975480059
 *                 last_login:
 *                   type: integer
 *                   example: 1725975480059
 *                 active:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 first_name:
 *                   type: string
 *                   example: "gotestli23"
 *                 last_name:
 *                   type: string
 *                   example: "swat"
 *                 company:
 *                   type: string
 *                   example: "abc ltd."
 *                 phone:
 *                   type: string
 *                   example: "7567446"
 *                 profile_pic:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 created_by:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-10T13:37:59.000Z"
 *                 modified_by:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-12T05:48:20.000Z"
 *                 is_delete:
 *                   type: integer
 *                   example: 0
 *                 uid:
 *                   type: string
 *                   example: "ChsZ4b7ctQe63FbAtFRFoUTjJVq2"
 *                 role:
 *                   type: string
 *                   example: "student"
 *                 provider:
 *                   type: string
 *                   example: "manual"
 *                 tags:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

    // Retrieve a user data to set in localstorage using uid
    router.get("/uid/:uid",cacheMiddleware,users.findUser)

    /**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 41
 *                   ip_address:
 *                     type: string
 *                     nullable: true
 *                     example: "127.0.0.1"
 *                   username:
 *                     type: string
 *                     example: "gotestli2@gmail.com"
 *                   email:
 *                     type: string
 *                     example: "gotestli2@gmail.com"
 *                   first_name:
 *                     type: string
 *                     example: "gotestli23"
 *                   last_name:
 *                     type: string
 *                     example: "swat"
 *                   company:
 *                     type: string
 *                     example: "abc ltd."
 *                   phone:
 *                     type: string
 *                     example: "7567446"
 *                   created_on:
 *                     type: integer
 *                     example: 1725975480059
 *                   last_login:
 *                     type: integer
 *                     example: 1725975480059
 *                   active:
 *                     type: integer
 *                     example: 1
 *                   role:
 *                     type: string
 *                     example: "student"
 *                   provider:
 *                     type: string
 *                     example: "manual"
 *       500:
 *         description: Internal server error
 */

    // Retrieve all users with id
    router.get("/",cacheMiddleware, users.findAll);
  
    /**
 * @swagger
 * /api/users/{userid}:
 *   put:
 *     summary: Update a user's information
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update
 *     requestBody:
 *       description: Fields to update for the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               company:
 *                 type: string
 *                 example: "Tech Corp"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       400:
 *         description: Bad request, invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

    // Update a users with id
    router.put("/:userid", users.updateUser);
  
    /**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
    // Delete a users with id
    router.delete("/:id", users.delete);
  
    /**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: All users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All users deleted successfully"
 *       500:
 *         description: Internal server error
 */
    // Delete all userss
    router.delete("/", users.deleteAll);
  
    app.use('/api/users', router);
  };
  