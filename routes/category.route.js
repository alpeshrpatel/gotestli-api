const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = (app) => {
  const category = require("../controller/category.controller");

  var router = require("express").Router();
   /**
   * @swagger
   * /api/category:
   *   post:
   *     summary: Create a new category
   *     tags: [Category]
   *     requestBody:
   *       description: Category object to be added
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               org_id:
   *                 type: integer
   *               parent_id:
   *                 type: integer
   *                 nullable: true
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               meta_title:
   *                 type: string
   *               slug:
   *                 type: string
   *               meta_keyword:
   *                 type: string
   *               meta_description:
   *                 type: string
   *               status:
   *                 type: integer
   *               show_menu:
   *                 type: integer
   *               is_parent_id:
   *                 type: integer
   *               is_show_home:
   *                 type: integer
   *               icon:
   *                 type: string
   *               position:
   *                 type: integer
   *               created_by:
   *                 type: string
   *               created_date:
   *                 type: string
   *                 format: date-time
   *               modified_by:
   *                 type: string
   *               modified_date:
   *                 type: string
   *                 format: date-time
   *             example:
   *               org_id: 101
   *               parent_id: null
   *               title: "Sample Category"
   *               description: "A description of the category"
   *               meta_title: "Meta Title"
   *               slug: "sample-category"
   *               meta_keyword: "sample, category"
   *               meta_description: "A brief description for SEO"
   *               status: 1
   *               show_menu: 1
   *               is_parent_id: 1
   *               is_show_home: 0
   *               icon: "category-icon.png"
   *               position: 5
   *               created_by: "admin"
   *               created_date: "2024-01-01T12:00:00Z"
   *               modified_by: "admin"
   *               modified_date: "2024-01-02T12:00:00Z"
   *     responses:
   *       201:
   *         description: Category created
   *         content:
   *           application/json:
   *             example:
   *               data: [{ "id": 1 }]
   *       400:
   *         description: Invalid request
   */

  // Create a new Category
  router.post("/", category.create);

  /**
   * @swagger
   * /api/category/{id}:
   *   get:
   *     summary: Get a category by ID
   *     tags: [Category]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the category
   *     responses:
   *       200:
   *         description: Category retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 org_id:
   *                   type: integer
   *                   example: 10
   *                 parent_id:
   *                   type: integer
   *                   example: 0
   *                 title:
   *                   type: string
   *                   example: "Development"
   *                 description:
   *                   type: string
   *                   example: ""
   *                 meta_title:
   *                   type: string
   *                   example: ""
   *                 slug:
   *                   type: string
   *                   example: "development"
   *                 meta_keyword:
   *                   type: string
   *                   example: ""
   *                 meta_description:
   *                   type: string
   *                   example: ""
   *                 status:
   *                   type: integer
   *                   example: 1
   *                 show_menu:
   *                   type: integer
   *                   example: 1
   *                 is_parent_id:
   *                   type: integer
   *                   example: 0
   *                 is_show_home:
   *                   type: integer
   *                   example: 0
   *                 icon:
   *                   type: string
   *                   example: ""
   *                 position:
   *                   type: integer
   *                   example: 5
   *                 created_by:
   *                   type: string
   *                   example: "admin"
   *                 created_date:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-01-01T12:00:00Z"
   *                 modified_by:
   *                   type: string
   *                   example: "admin"
   *                 modified_date:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-01-02T12:00:00Z"
   *       404:
   *         description: Category not found
   */

  // Retrieve a single Category with id
  router.get("/:id",cacheMiddleware, category.findOne);

  /**
 * @swagger
 * /api/category/parent/categories:
 *   get:
 *     summary: Retrieve all parent categories
 *     tags: [Category]
 *     description: Fetches a list of parent categories with their IDs and titles.
 *     responses:
 *       200:
 *         description: A list of parent categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Development"
 *       404:
 *         description: No parent categories found
 */

  // Retrieve a parent categories
  router.get("/parent/categories",cacheMiddleware, category.findParentCategories);

  /**
 * @swagger
 * /api/category/selected/questionsets/{title}:
 *   get:
 *     summary: Retrieve question sets for a specific category
 *     tags: [Category]
 *     description: Fetches a list of question sets associated with a specified category title.
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the category
 *     responses:
 *       200:
 *         description: A list of question sets for the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 68
 *                   org_id:
 *                     type: integer
 *                     nullable: true
 *                     example: null
 *                   title:
 *                     type: string
 *                     example: "test 81"
 *                   question_set_url:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   image:
 *                     type: string
 *                     example: "https://th.bing.com/th?id=OIP.031SZwuZKZNX56lWrn6zOwHaD4&w=345&h=181&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"
 *                   author:
 *                     type: string
 *                     example: "gotestli3"
 *                   short_desc:
 *                     type: string
 *                     example: "Amazon Web Services (AWS) is the world’s most comprehensive and broadly adopted cloud"
 *                   description:
 *                     type: string
 *                     example: ""
 *                   start_time:
 *                     type: string
 *                     example: "00:00:00"
 *                   end_time:
 *                     type: string
 *                     example: "00:00:00"
 *                   start_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-02T18:30:00.000Z"
 *                   end_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-12T18:30:00.000Z"
 *                   time_duration:
 *                     type: string
 *                     example: "20"
 *                   no_of_question:
 *                     type: integer
 *                     example: 2
 *                   status_id:
 *                     type: integer
 *                     example: 1
 *                   is_demo:
 *                     type: integer
 *                     example: 1
 *                   created_by:
 *                     type: string
 *                     example: "42"
 *                   created_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-05T12:30:35.000Z"
 *                   modified_by:
 *                     type: string
 *                     example: "42"
 *                   modified_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-30T06:34:40.000Z"
 *                   totalmarks:
 *                     type: integer
 *                     example: 110
 *                   pass_percentage:
 *                     type: integer
 *                     example: 12
 *                   tags:
 *                     type: string
 *                     example: "AWS,Angular application"
 *       404:
 *         description: No question sets found for the specified category title
 */

  // Retrieve a selected categories questionsets
  router.get(
    "/selected/questionsets/:title",
    category.findSelectedCategoriesQuestionsets
  );

  /**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Retrieve all categories
 *     tags: [Category]
 *     description: Fetches a list of all categories with their details.
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   org_id:
 *                     type: integer
 *                     example: 10
 *                   parent_id:
 *                     type: integer
 *                     example: 0
 *                   title:
 *                     type: string
 *                     example: "Development"
 *                   description:
 *                     type: string
 *                     example: "Category description"
 *                   meta_title:
 *                     type: string
 *                     example: "Meta Title"
 *                   slug:
 *                     type: string
 *                     example: "development"
 *                   meta_keyword:
 *                     type: string
 *                     example: "meta, keyword"
 *                   meta_description:
 *                     type: string
 *                     example: "Meta description for SEO"
 *                   status:
 *                     type: integer
 *                     example: 1
 *                   show_menu:
 *                     type: integer
 *                     example: 1
 *                   is_parent_id:
 *                     type: integer
 *                     example: 0
 *                   is_show_home:
 *                     type: integer
 *                     example: 0
 *                   icon:
 *                     type: string
 *                     example: "icon.png"
 *                   position:
 *                     type: integer
 *                     example: 5
 *                   created_by:
 *                     type: string
 *                     example: "admin"
 *                   created_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T12:00:00Z"
 *                   modified_by:
 *                     type: string
 *                     example: "admin"
 *                   modified_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-02T12:00:00Z"
 *       404:
 *         description: No categories found
 */

  // Retrieve all Category with id
  router.get("/",cacheMiddleware, category.findAll);

  /**
 * @swagger
 * /api/category/questionset/parent/category/{id}:
 *   get:
 *     summary: Get the parent category of a specific category
 *     tags: [Category]
 *     description: Retrieves the parent category details (ID and title) of a specified category.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to retrieve its parent category
 *     responses:
 *       200:
 *         description: Parent category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 8
 *                 title:
 *                   type: string
 *                   example: "Cloud Computing"
 *       404:
 *         description: Parent category not found
 */

  // get a parent category of category
  router.get(
    "/questionset/parent/category/:id",cacheMiddleware,
    category.getParentCategoryOfQuestionSet
  );

  /**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     description: Deletes a specific category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       404:
 *         description: Category not found
 *       500:
 *         description: Error deleting the category
 */

  // Delete a Category with id
  router.delete("/:id", category.delete);

  /**
 * @swagger
 * /api/category:
 *   delete:
 *     summary: Delete all categories
 *     tags: [Category]
 *     description: Deletes all categories in the database.
 *     responses:
 *       200:
 *         description: All categories deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All categories deleted successfully"
 *       500:
 *         description: Error deleting categories
 */

  // Delete all Categorys
  router.delete("/", category.deleteAll);

  app.use("/api/category", router);
};
