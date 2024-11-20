const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const QuestionFiles = require("../controller/questionfiles.controller");
  
    var router = require("express").Router();
  
    /**
 * @swagger
 * /api/question/files:
 *   post:
 *     summary: Create a new question file record
 *     tags: [Question Files]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file_name:
 *                 type: string
 *                 description: Name of the file
 *               file_path:
 *                 type: string
 *                 description: Path where the file is stored
 *               user_id:
 *                 type: integer
 *                 description: ID of the user who uploaded the file
 *               status:
 *                 type: integer
 *                 description: Status of the file (1 for active, 0 for inactive)
 *               created_by:
 *                 type: integer
 *                 description: ID of the creator
 *               created_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time when the file was created
 *               modified_by:
 *                 type: integer
 *                 description: ID of the last modifier
 *               modified_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time when the file was last modified
 *               correct_rows:
 *                 type: string
 *                 description: Comma-separated list of correct row numbers
 *               error_rows:
 *                 type: string
 *                 description: Comma-separated list of error row numbers, if any
 *             example:
 *               file_name: "SampleQuestionSet (1).xlsx"
 *               file_path: "../gotestli-web/uploads/SampleQuestionSet (1).xlsx"
 *               user_id: 43
 *               status: 1
 *               created_by: 43
 *               created_date: "2024-09-24T14:40:10Z"
 *               modified_by: 43
 *               modified_date: "2024-09-30T06:54:01Z"
 *               correct_rows: "1,2"
 *               error_rows: ""
 *     responses:
 *       201:
 *         description: Question file successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the newly created question file
 *                 message:
 *                   type: string
 *                   example: "Question file created successfully"
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

    // Create a new QuestionFiles
    router.post("/", QuestionFiles.create);

    /**
 * @swagger
 * /api/question/files/insert/questions:
 *   post:
 *     summary: Insert questions from a file
 *     tags: [Question Files]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: integer
 *                 description: ID of the file containing the questions
 *               filePath:
 *                 type: string
 *                 description: Path to the file containing the questions
 *               userId:
 *                 type: integer
 *                 description: ID of the user uploading the questions
 *             example:
 *               fileId: 12
 *               filePath: "../gotestli-web/uploads/SampleQuestionSet.xlsx"
 *               userId: 43
 *     responses:
 *       200:
 *         description: Questions inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Questions inserted successfully"
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

    router.post('/insert/questions', QuestionFiles.insertQuestions);

    // router.get('/download/samplefile', QuestionFiles.getSampleFile);
  /**
 * @swagger
 * /api/question/files/download:
 *   get:
 *     summary: Download an uploaded file
 *     tags: [Question Files]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of the file to be downloaded
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to be downloaded
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid request, missing or incorrect query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid file type or file name."
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File not found."
 */

    router.get('/download', QuestionFiles.getUploadedFile);
  
    /**
 * @swagger
 * /api/question/files/{id}:
 *   get:
 *     summary: Retrieve a Question File by User ID
 *     tags: [Question Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Question File to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the Question File
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 file_name:
 *                   type: string
 *                   example: "SampleQuestionSet.xlsx"
 *                 file_path:
 *                   type: string
 *                   example: "../uploads/SampleQuestionSet.xlsx"
 *                 user_id:
 *                   type: integer
 *                   example: 43
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 created_by:
 *                   type: integer
 *                   example: 43
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-24T14:40:10.000Z"
 *                 modified_by:
 *                   type: integer
 *                   example: 43
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-30T06:54:01.000Z"
 *                 correct_rows:
 *                   type: string
 *                   example: "1,2"
 *                 error_rows:
 *                   type: string
 *                   example: ""
 *       400:
 *         description: Invalid ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid ID format."
 *       404:
 *         description: Question File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question File not found."
 */

    router.get("/:id",cacheMiddleware,QuestionFiles.findById);

    /**
 * @swagger
 * /api/question/files:
 *   get:
 *     summary: Retrieve a question file by file name
 *     tags: [Question Files]
 *     parameters:
 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the file to search for
 *         example: "SampleQuestionSet.xlsx"
 *     responses:
 *       200:
 *         description: File data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 13
 *                 file_name:
 *                   type: string
 *                   example: "SampleQuestionSet.xlsx"
 *                 file_path:
 *                   type: string
 *                   example: "../uploads/SampleQuestionSet.xlsx"
 *                 user_id:
 *                   type: integer
 *                   example: 43
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 created_by:
 *                   type: integer
 *                   example: 43
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-24T14:40:10.000Z"
 *                 modified_by:
 *                   type: integer
 *                   example: 43
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-30T06:54:01.000Z"
 *                 correct_rows:
 *                   type: string
 *                   example: "1,2"
 *                 error_rows:
 *                   type: string
 *                   example: ""
 *       404:
 *         description: File not found
 */

    router.get("/",cacheMiddleware,QuestionFiles.findByFileName);
    
    // // Delete a QuestionFiles with id
    // router.delete("/instructor/:instructor_id/follower/:follower_id", QuestionFiles.delete);
  
    // // Delete all FollowersLists
    // router.delete("/", QuestionFiles.deleteAll);

   
  
    app.use('/api/question/files', router);
  };
  