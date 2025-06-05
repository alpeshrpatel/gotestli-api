const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
   const QuestionFiles = require("../controller/questionfiles.controller");

   var router = require("express").Router();
   const multer = require('multer');
   const upload = multer({ dest: 'uploads/' });
   const path = require('path');
   const fs = require('fs');
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

   router.get("/:id", QuestionFiles.findById);

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

   router.get("/", cacheMiddleware, QuestionFiles.findByFileName);

   // // Delete a QuestionFiles with id
   // router.delete("/instructor/:instructor_id/follower/:follower_id", QuestionFiles.delete);

   // // Delete all FollowersLists
   // router.delete("/", QuestionFiles.deleteAll);

   router.post("/preview/excelfile", upload.single('file'), QuestionFiles.previewAndValidateExcel);


   // Add this to your Express.js routes file

   // const express = require('express');
   // const path = require('path');
   // const fs = require('fs');
   // const router = express.Router();



   // Route to download PDF reports
   router.get('/download/report/:filename', (req, res) => {
      try {
         const filename = req.params.filename;

         // Validate filename to prevent directory traversal attacks
         if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({ message: 'Invalid filename' });
         }

         // Construct the file path (adjust according to your file storage structure)
         const filePath = path.join(__dirname, '../reports', filename);

         // Check if file exists
         if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
         }

         // Get file stats
         const stat = fs.statSync(filePath);

         // Set appropriate headers
         res.setHeader('Content-Type', 'application/pdf');
         res.setHeader('Content-Length', stat.size);
         res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

         // Stream the file
         const fileStream = fs.createReadStream(filePath);
         fileStream.pipe(res);

         // Handle stream errors
         fileStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            if (!res.headersSent) {
               res.status(500).json({ message: 'Error streaming file' });
            }
         });

      } catch (error) {
         console.error('Error downloading file:', error);
         res.status(500).json({ message: 'Internal server error' });
      }
   });

   // Alternative route for direct file serving (if you prefer this approach)
   router.get('/reports/:filename', (req, res) => {
      try {
         const filename = req.params.filename;
         const token = req.query.token; // Get token from query params for direct links

         // Validate filename
         if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({ message: 'Invalid filename' });
         }

         // Construct file path
         const filePath = path.join(__dirname, '../reports', filename);

         // Check if file exists
         if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
         }

         // Serve the file
         res.sendFile(filePath);

      } catch (error) {
         console.error('Error serving file:', error);
         res.status(500).json({ message: 'Internal server error' });
      }
   });

   // Optional: Route to clean up old PDF files
   router.delete('/cleanup/reports', (req, res) => {
      try {
         const reportsDir = path.join(__dirname, '../reports');
         const files = fs.readdirSync(reportsDir);
         const now = Date.now();
         const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

         let deletedCount = 0;

         files.forEach(file => {
            const filePath = path.join(reportsDir, file);
            const stats = fs.statSync(filePath);

            if (now - stats.mtime.getTime() > maxAge) {
               fs.unlinkSync(filePath);
               deletedCount++;
            }
         });

         res.json({
            message: `Cleaned up ${deletedCount} old report files`,
            deletedCount
         });

      } catch (error) {
         console.error('Error cleaning up files:', error);
         res.status(500).json({ message: 'Error cleaning up files' });
      }
   });



   app.use('/api/question/files', router);
};
