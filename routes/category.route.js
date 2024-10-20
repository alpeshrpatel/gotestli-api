module.exports = app => {
    const category = require("../controller/category.controller");
  
    var router = require("express").Router();
    /**
     * @swagger
     * /category:
     *   post:
     *     summary: Create a new category
     *     tags: [Cataegory]
     *     requestBody:
     *       description: Category object to be added
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
    // Create a new Category
    router.post("/", category.create);
  
    // Retrieve a single Category with id
    router.get("/:id", category.findOne);

    // Retrieve a parent categories
    router.get("/parent/categories",category.findParentCategories);

    // Retrieve a selected categories questionsets
    router.get("/selected/questionsets/:title",category.findSelectedCategoriesQuestionsets);
    
    // Retrieve all Category with id
    router.get("/", category.findAll);
  
    // get a parent category of category
    router.get("/questionset/parent/category/:id",category.getParentCategoryOfQuestionSet);
  
    // Delete a Category with id
    router.delete("/:id", category.delete);
  
    // Delete all Categorys
    router.delete("/", category.deleteAll);
  
    app.use('/api/category', router);
  };
  