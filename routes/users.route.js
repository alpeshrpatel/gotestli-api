module.exports = app => {
    const users = require("../controller/users.controller");
  
    var router = require("express").Router();
    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Create a new users
     *     tags: [Cataegory]
     *     requestBody:
     *       description: users object to be added
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               address:
     *                 type: string
     *               dateOfBirth:
     *                 type: date
     *               gender:
     *                 type: string
     *               phoneNum:
     *                 type: integer
     *             example:
     *                name: "John Doe"
     *                address: "Colombo - Srilanka "
     *                dateOfBirth: 07/14/1990
     *                gender: "male"
     *                phoneNum: 01145252525
     *     responses:
     *       201:
     *         description: Successful response
     *         content:
     *           application/json:
     *             example:
     *               data: [{}]
     *       400:
     *         description: Invalid request
     */
    // Create a new user
    router.post("/", users.create);

    // generate token for logged in user
    router.get("/generate/token/:id", users.generateToken);
  
    // Retrieve a single users with id
    router.get("/:userid", users.findOne);

    // Retrieve a user data to set in localstorage using uid
    router.get("/uid/:uid",users.findUser)

    // Retrieve all users with id
    router.get("/", users.findAll);
  
    // Update a users with id
    router.put("/:userid", users.updateUser);
  
    // Delete a users with id
    router.delete("/:id", users.delete);
  
    // Delete all userss
    router.delete("/", users.deleteAll);
  
    app.use('/api/users', router);
  };
  