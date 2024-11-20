const { cacheMiddleware } = require("../middleware/cacheMiddleware");



module.exports = app => {
    const questionset = require("../controller/questionset.controller");
  
    var router = require("express").Router();
  
    /**
 * @swagger
 * /api/questionset:
 *   post:
 *     summary: Create a new QuestionSet
 *     description: Adds a new question set to the database.
 *     tags: [QuestionSet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               org_id:
 *                 type: integer
 *                 description: Organization ID associated with the question set.
 *               title:
 *                 type: string
 *                 description: Title of the question set.
 *               question_set_url:
 *                 type: string
 *                 nullable: true
 *                 description: URL link for the question set.
 *               image:
 *                 type: string
 *                 description: URL of the image representing the question set.
 *               author:
 *                 type: string
 *                 description: Author of the question set.
 *               short_desc:
 *                 type: string
 *                 description: Short description of the question set.
 *               description:
 *                 type: string
 *                 description: Detailed description of the question set.
 *               start_time:
 *                 type: string
 *                 format: time
 *                 nullable: true
 *                 description: Start time of the question set.
 *               end_time:
 *                 type: string
 *                 format: time
 *                 nullable: true
 *                 description: End time of the question set.
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the question set.
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date of the question set.
 *               time_duration:
 *                 type: string
 *                 description: Duration of the question set in minutes.
 *               no_of_question:
 *                 type: integer
 *                 description: Number of questions in the question set.
 *               status_id:
 *                 type: integer
 *                 nullable: true
 *                 description: Status ID of the question set.
 *               is_demo:
 *                 type: integer
 *                 description: Indicates if the question set is a demo (1 for true, 0 for false).
 *               created_by:
 *                 type: string
 *                 description: ID of the user who created the question set.
 *               created_date:
 *                 type: string
 *                 format: date-time
 *                 description: Creation date of the question set.
 *               modified_by:
 *                 type: string
 *                 description: ID of the user who last modified the question set.
 *               modified_date:
 *                 type: string
 *                 format: date-time
 *                 description: Modification date of the question set.
 *               totalmarks:
 *                 type: integer
 *                 description: Total marks for the question set.
 *               pass_percentage:
 *                 type: number
 *                 format: float
 *                 description: Percentage required to pass the question set.
 *               tags:
 *                 type: string
 *                 description: Tags related to the question set.
 *             example:
 *               org_id: 1
 *               title: "Linked List Quiz"
 *               question_set_url: null
 *               image: "https://www.geeksforgeeks.org/wp-content/uploads/gq/2013/03/Linkedlist.png"
 *               author: "Vivek Desai"
 *               short_desc: "Learn the basics of singly linked lists, a fundamental data structure in computer science and programming."
 *               description: ""
 *               start_time: null
 *               end_time: null
 *               start_date: "2024-08-04"
 *               end_date: "2024-08-10"
 *               time_duration: "42"
 *               no_of_question: 5
 *               status_id: null
 *               is_demo: 1
 *               created_by: "43"
 *               created_date: "2024-08-20T20:41:23Z"
 *               modified_by: "43"
 *               modified_date: "2024-09-18T10:23:11Z"
 *               totalmarks: 120
 *               pass_percentage: 30.0
 *               tags: "AWS, Game Development, Mobile Development"
 *     responses:
 *       201:
 *         description: QuestionSet created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QuestionSet created successfully!"
 *                 data:
 *                   $ref: '#/components/schemas/QuestionSet'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating the QuestionSet."
 */

    // Create a new QuestionSet
    router.post("/", questionset.create);
  
    /**
 * @swagger
 * /api/questionset/{id}:
 *   get:
 *     summary: Retrieve a single QuestionSet by ID
 *     description: Fetches a QuestionSet's details using its ID.
 *     tags: [QuestionSet]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the QuestionSet to retrieve
 *     responses:
 *       200:
 *         description: A single QuestionSet object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique ID of the question set.
 *                 org_id:
 *                   type: integer
 *                   description: Organization ID associated with the question set.
 *                 title:
 *                   type: string
 *                   description: Title of the question set.
 *                 question_set_url:
 *                   type: string
 *                   nullable: true
 *                   description: URL link for the question set.
 *                 image:
 *                   type: string
 *                   description: URL of the image representing the question set.
 *                 author:
 *                   type: string
 *                   description: Author of the question set.
 *                 short_desc:
 *                   type: string
 *                   description: Short description of the question set.
 *                 description:
 *                   type: string
 *                   description: Detailed description of the question set.
 *                 start_date:
 *                   type: string
 *                   format: date
 *                   description: Start date of the question set.
 *                 end_date:
 *                   type: string
 *                   format: date
 *                   description: End date of the question set.
 *                 time_duration:
 *                   type: string
 *                   description: Duration of the question set in minutes.
 *                 no_of_question:
 *                   type: integer
 *                   description: Number of questions in the question set.
 *                 totalmarks:
 *                   type: integer
 *                   description: Total marks for the question set.
 *                 pass_percentage:
 *                   type: number
 *                   format: float
 *                   description: Percentage required to pass the question set.
 *                 tags:
 *                   type: string
 *                   description: Tags related to the question set.
 *             example:
 *               id: 43
 *               org_id: 1
 *               title: "Linked List Quiz"
 *               question_set_url: null
 *               image: "https://www.geeksforgeeks.org/wp-content/uploads/gq/2013/03/Linkedlist.png"
 *               author: "Vivek Desai"
 *               short_desc: "Learn the basics of singly linked lists, a fundamental data structure in computer science and programming."
 *               description: ""
 *               start_date: "2024-08-04"
 *               end_date: "2024-08-10"
 *               time_duration: "42"
 *               no_of_question: 5
 *               totalmarks: 120
 *               pass_percentage: 30.0
 *               tags: "AWS, Game Development, Mobile Development"
 *       404:
 *         description: QuestionSet not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QuestionSet not found with id 43."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the QuestionSet."
 */

    // Retrieve a single QuestionSet with id
    router.get("/:id", questionset.findOne);

    /**
 * @swagger
 * /api/questionset:
 *   get:
 *     summary: Retrieve all question sets
 *     description: Fetches a list of all question sets available in the system.
 *     tags: [QuestionSet]
 *     responses:
 *       200:
 *         description: A list of question sets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question_set:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique ID of the question set.
 *                       org_id:
 *                         type: integer
 *                         description: Organization ID associated with the question set.
 *                       title:
 *                         type: string
 *                         description: Title of the question set.
 *                       question_set_url:
 *                         type: string
 *                         nullable: true
 *                         description: URL link for the question set.
 *                       image:
 *                         type: string
 *                         description: URL of the image representing the question set.
 *                       author:
 *                         type: string
 *                         description: Author of the question set.
 *                       short_desc:
 *                         type: string
 *                         description: Short description of the question set.
 *                       description:
 *                         type: string
 *                         description: Detailed description of the question set.
 *                       start_date:
 *                         type: string
 *                         format: date
 *                         description: Start date of the question set.
 *                       end_date:
 *                         type: string
 *                         format: date
 *                         description: End date of the question set.
 *                       time_duration:
 *                         type: string
 *                         description: Duration of the question set in minutes.
 *                       no_of_question:
 *                         type: integer
 *                         description: Number of questions in the question set.
 *                       totalmarks:
 *                         type: integer
 *                         description: Total marks for the question set.
 *                       pass_percentage:
 *                         type: number
 *                         format: float
 *                         description: Percentage required to pass the question set.
 *                       tags:
 *                         type: string
 *                         description: Tags related to the question set.
 *             example:
 *               question_set:
 *                 - id: 43
 *                   org_id: 1
 *                   title: "Linked List Quiz"
 *                   question_set_url: null
 *                   image: "https://www.geeksforgeeks.org/wp-content/uploads/gq/2013/03/Linkedlist.png"
 *                   author: "Vivek Desai"
 *                   short_desc: "Learn the basics of singly linked lists, a fundamental data structure in computer science and programming."
 *                   description: ""
 *                   start_date: "2024-08-04"
 *                   end_date: "2024-08-10"
 *                   time_duration: "42"
 *                   no_of_question: 5
 *                   totalmarks: 120
 *                   pass_percentage: 30.0
 *                   tags: "AWS, Game Development, Mobile Development"
 *                 - id: 44
 *                   org_id: 2
 *                   title: "Data Structures Quiz"
 *                   question_set_url: null
 *                   image: "https://example.com/image.png"
 *                   author: "John Doe"
 *                   short_desc: "Explore various data structures in this quiz."
 *                   description: "A comprehensive quiz covering arrays, stacks, and queues."
 *                   start_date: "2024-08-01"
 *                   end_date: "2024-08-05"
 *                   time_duration: "60"
 *                   no_of_question: 10
 *                   totalmarks: 150
 *                   pass_percentage: 50.0
 *                   tags: "Data Structures, Algorithms"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving question sets."
 */

    //Retrieve all question sets
    router.get("/",cacheMiddleware, questionset.findAll)

    /**
 * @swagger
 * /api/questionset/category/{id}:
 *   get:
 *     summary: Retrieve a question set ID by category ID
 *     description: Fetches the question set ID associated with a specific category ID.
 *     tags: [QuestionSet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category to retrieve the question set ID.
 *     responses:
 *       200:
 *         description: Question set ID retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question_set_id:
 *                   type: integer
 *                   description: ID of the question set associated with the category ID.
 *             example:
 *               question_set_id: 43
 *       404:
 *         description: Question set not found for the given category ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No question set found for the given category ID."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the question set ID."
 */

    // Retrieve a single QuestionSet with id
    router.get("/category/:id",cacheMiddleware, questionset.getQuestionSetIdByCategoryId);

    /**
 * @swagger
 * /api/questionset/questions/{id}:
 *   get:
 *     summary: Retrieve questions of a specific question set
 *     description: Fetches an array of questions associated with a given question set ID.
 *     tags: [QuestionSet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question set to retrieve questions for.
 *     responses:
 *       200:
 *         description: Array of questions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   question_id:
 *                     type: integer
 *                     description: Unique identifier for the question.
 *                   question:
 *                     type: string
 *                     description: The text of the question.
 *                   paragraph_id:
 *                     type: integer
 *                     nullable: true
 *                     description: ID of the associated paragraph, if any.
 *                   question_type_id:
 *                     type: integer
 *                     description: Type identifier for the question.
 *                   pass_percentage:
 *                     type: number
 *                     format: float
 *                     description: Passing percentage for the question set.
 *             example:
 *               - question_id: 6
 *                 question: "Object storage systems store files in a flat organization of containers called what?"
 *                 paragraph_id: null
 *                 question_type_id: 2
 *                 pass_percentage: 30
 *       404:
 *         description: Question set not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No questions found for the given question set ID."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving questions for the question set."
 */

    //Retrieve questions of questionset
    router.get("/questions/:id",cacheMiddleware, questionset.getQuestionSet);

    /**
 * @swagger
 * /api/questionset/instructor/{userId}:
 *   get:
 *     summary: Retrieve question sets created by an instructor
 *     description: Fetches an array of question sets associated with a given instructor's user ID.
 *     tags: [QuestionSet]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID of the instructor to retrieve question sets for.
 *     responses:
 *       200:
 *         description: Array of question sets retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique identifier for the question set.
 *                   title:
 *                     type: string
 *                     description: Title of the question set.
 *                   short_desc:
 *                     type: string
 *                     description: Short description of the question set.
 *                   no_of_question:
 *                     type: integer
 *                     description: Number of questions in the question set.
 *                   time_duration:
 *                     type: string
 *                     description: Duration for completing the question set.
 *                   totalmarks:
 *                     type: integer
 *                     description: Total marks for the question set.
 *                   is_demo:
 *                     type: integer
 *                     enum: [0, 1]
 *                     description: Indicates if the question set is a demo (1) or not (0).
 *             example:
 *               - id: 43
 *                 title: "Linked List Quiz"
 *                 short_desc: "Learn the basics of singly linked lists, a fundamental data structure in computer science and programming."
 *                 no_of_question: 5
 *                 time_duration: "42"
 *                 totalmarks: 120
 *                 is_demo: 1
 *       404:
 *         description: No question sets found for the given instructor ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No question sets found for the given instructor."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving question sets for the instructor."
 */

    // Retrieve question sets of instructor
    router.get("/instructor/:userId",cacheMiddleware, questionset.getQuestionSetsOfInstructor)

    /**
 * @swagger
 * /api/questionset/count/used:
 *   get:
 *     summary: Retrieve count of how many times each question set has been used
 *     description: Fetches an array of question sets with their usage count.
 *     tags: [QuestionSet]
 *     responses:
 *       200:
 *         description: Array of question sets with usage count retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Title of the question set.
 *                   id:
 *                     type: integer
 *                     description: Unique identifier for the question set.
 *                   count:
 *                     type: integer
 *                     description: Number of times the question set has been used.
 *             example:
 *               - title: "test 9"
 *                 id: 69
 *                 count: 37
 *               - title: "Linked List Quiz"
 *                 id: 43
 *                 count: 52
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving question set usage count."
 */

    // Retrieve question sets of instructor
    router.get("/count/used",cacheMiddleware, questionset.getQuetionSetUsedByCount)

    /**
 * @swagger
 * /api/questionset/search/result/{keyword}:
 *   get:
 *     summary: Retrieve question sets by searched keyword
 *     description: Fetches a list of question sets that match the provided search keyword.
 *     tags: [QuestionSet]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         description: The keyword to search question sets by.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of question sets that match the search keyword.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique identifier for the question set.
 *                   org_id:
 *                     type: integer
 *                     description: Organization ID associated with the question set.
 *                   title:
 *                     type: string
 *                     description: Title of the question set.
 *                   question_set_url:
 *                     type: string
 *                     nullable: true
 *                     description: URL for the question set (if available).
 *                   image:
 *                     type: string
 *                     description: URL of the image associated with the question set.
 *                   author:
 *                     type: string
 *                     description: Author of the question set.
 *                   short_desc:
 *                     type: string
 *                     description: Short description of the question set.
 *                   description:
 *                     type: string
 *                     description: Detailed description of the question set.
 *                   start_time:
 *                     type: string
 *                     nullable: true
 *                     format: date-time
 *                     description: Start time of the question set (if available).
 *                   end_time:
 *                     type: string
 *                     nullable: true
 *                     format: date-time
 *                     description: End time of the question set (if available).
 *                   start_date:
 *                     type: string
 *                     format: date-time
 *                     description: Start date of the question set.
 *                   end_date:
 *                     type: string
 *                     format: date-time
 *                     description: End date of the question set.
 *                   time_duration:
 *                     type: string
 *                     description: Time duration in minutes.
 *                   no_of_question:
 *                     type: integer
 *                     description: Number of questions in the question set.
 *                   status_id:
 *                     type: integer
 *                     nullable: true
 *                     description: Status ID of the question set (if available).
 *                   is_demo:
 *                     type: integer
 *                     description: Flag indicating if the question set is a demo.
 *                   created_by:
 *                     type: string
 *                     description: User ID who created the question set.
 *                   created_date:
 *                     type: string
 *                     format: date-time
 *                     description: Date when the question set was created.
 *                   modified_by:
 *                     type: string
 *                     description: User ID who last modified the question set.
 *                   modified_date:
 *                     type: string
 *                     format: date-time
 *                     description: Date when the question set was last modified.
 *                   totalmarks:
 *                     type: integer
 *                     description: Total marks for the question set.
 *                   pass_percentage:
 *                     type: number
 *                     format: float
 *                     description: Pass percentage for the question set.
 *                   tags:
 *                     type: string
 *                     description: Tags associated with the question set.
 *             example:
 *               - id: 43
 *                 org_id: 1
 *                 title: "Linked List Quizz"
 *                 question_set_url: null
 *                 image: "https://www.geeksforgeeks.org/wp-content/uploads/gq/2013/03/Linkedlist.png"
 *                 author: "vivek desai"
 *                 short_desc: "Learn the basics of singly linked lists, a fundamental data structure in computer science and programming."
 *                 description: ""
 *                 start_time: null
 *                 end_time: null
 *                 start_date: "2024-08-03T18:30:00.000Z"
 *                 end_date: "2024-08-09T18:30:00.000Z"
 *                 time_duration: "42"
 *                 no_of_question: 5
 *                 status_id: null
 *                 is_demo: 1
 *                 created_by: "43"
 *                 created_date: "2024-08-20T15:11:23.000Z"
 *                 modified_by: "43"
 *                 modified_date: "2024-09-18T04:53:11.000Z"
 *                 totalmarks: 120
 *                 pass_percentage: 30
 *                 tags: "AWS,Game Development,Mobile Development"
 *       400:
 *         description: Bad Request. Invalid keyword or missing parameter.
 *       404:
 *         description: No question sets found for the provided keyword.
 *       500:
 *         description: Internal Server Error. Could not retrieve question sets.
 */

    // get question set of searched keyword
    router.get("/search/result/:keyword",cacheMiddleware, questionset.getQuetionSetBySearchedKeyword)
/**
 * @swagger
 * /api/questionset/{id}:
 *   put:
 *     summary: Update a QuestionSet by ID
 *     description: Updates the details of an existing QuestionSet using its unique ID.
 *     tags: [QuestionSet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the QuestionSet to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Badge object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               changedQSet:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Title of the QuestionSet.
 *                   short_desc:
 *                     type: string
 *                     description: Short description of the QuestionSet.
 *                   time_duration:
 *                     type: integer
 *                     description: Duration for the QuestionSet in minutes.
 *                   is_demo:
 *                     type: integer
 *                     description: Flag indicating if the QuestionSet is a demo.
 *               userId:
 *                 type: integer
 *                 description: ID of the user (instructor) making the update.
 *     responses:
 *       200:
 *         description: Successfully updated the QuestionSet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the updated QuestionSet.
 *                 title:
 *                   type: string
 *                   description: Updated title of the QuestionSet.
 *                 short_desc:
 *                   type: string
 *                   description: Updated short description of the QuestionSet.
 *                 time_duration:
 *                   type: integer
 *                   description: Updated duration for the QuestionSet in minutes.
 *                 is_demo:
 *                   type: integer
 *                   description: Updated flag indicating if the QuestionSet is a demo.
 *                 userId:
 *                   type: integer
 *                   description: ID of the user (instructor) who updated the QuestionSet.
 *             example:
 *               id: 43
 *               title: "Updated Linked List Quizz"
 *               short_desc: "Advanced concepts in Linked Lists."
 *               time_duration: 60
 *               is_demo: 0
 *               userId: 1001
 *       400:
 *         description: Bad Request. Invalid input data or missing fields.
 *       404:
 *         description: QuestionSet with the given ID not found.
 *       500:
 *         description: Internal Server Error. Could not update the QuestionSet.
 */

    // Update a QuestionSet with id
    router.put("/:id", questionset.update);
  
    /**
 * @swagger
 * /api/questionset/{id}:
 *   delete:
 *     summary: Delete a QuestionSet by ID
 *     description: Deletes a specific QuestionSet using its unique ID.
 *     tags: [QuestionSet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the QuestionSet to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted the QuestionSet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message confirming deletion.
 *             example:
 *               message: "QuestionSet with ID 43 has been successfully deleted."
 *       404:
 *         description: QuestionSet not found. The specified ID does not exist.
 *       500:
 *         description: Internal Server Error. Could not delete the QuestionSet.
 */

    // Delete a QuestionSet with id
    router.delete("/:id", questionset.delete);
  
    /**
 * @swagger
 * /api/questionset:
 *   delete:
 *     summary: Delete all QuestionSets
 *     description: Deletes all QuestionSets in the database.
 *     tags: [QuestionSet]
 *     responses:
 *       200:
 *         description: Successfully deleted all QuestionSets.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message confirming deletion of all QuestionSets.
 *             example:
 *               message: "All QuestionSets have been successfully deleted."
 *       500:
 *         description: Internal Server Error. Could not delete the QuestionSets.
 */

    // Delete all QuestionSets
    router.delete("/", questionset.deleteAll);

  
    app.use('/api/questionset', router);
  };
  