const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const Reviews = require("../controller/reviews.controller");
  
    var router = require("express").Router();
  
    /**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new Review
 *     description: Adds a new review entry for a specific question set.
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review_id:
 *                 type: integer
 *                 description: Unique identifier for the review.
 *                 example: 1
 *               questionset_id:
 *                 type: integer
 *                 nullable: true
 *                 description: The ID of the question set associated with this review.
 *                 example: 43
 *               content_quality:
 *                 type: integer
 *                 nullable: true
 *                 description: Rating for content quality.
 *                 example: 5
 *               satisfaction:
 *                 type: integer
 *                 nullable: true
 *                 description: Satisfaction rating for the question set.
 *                 example: 4
 *               difficulty:
 *                 type: integer
 *                 nullable: true
 *                 description: Difficulty level of the question set.
 *                 example: 3
 *               review:
 *                 type: string
 *                 nullable: true
 *                 description: Review text provided by the user.
 *                 example: "Excellent set of questions!"
 *               created_by:
 *                 type: integer
 *                 nullable: true
 *                 description: ID of the user who created this review.
 *                 example: 41
 *               created_date:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time the review was created.
 *                 example: "2024-10-20T23:35:27Z"
 *               modified_by:
 *                 type: integer
 *                 nullable: true
 *                 description: ID of the user who last modified this review.
 *                 example: 41
 *               modified_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: The date and time the review was last modified.
 *                 example: "2024-10-20T23:35:27Z"
 *     responses:
 *       201:
 *         description: Successfully created a new review.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionset_id:
 *                   type: integer
 *                   nullable: true
 *                   description: The ID of the question set associated with this review.
 *                   example: 43
 *                 content_quality:
 *                   type: integer
 *                   nullable: true
 *                   description: Rating for content quality.
 *                   example: 5
 *                 satisfaction:
 *                   type: integer
 *                   nullable: true
 *                   description: Satisfaction rating.
 *                   example: 4
 *                 difficulty:
 *                   type: integer
 *                   nullable: true
 *                   description: Difficulty rating.
 *                   example: 3
 *                 review:
 *                   type: string
 *                   nullable: true
 *                   description: Review text.
 *                   example: "Great set of questions!"
 *                 created_by:
 *                   type: integer
 *                   nullable: true
 *                   description: ID of the user who created this review.
 *                   example: 41
 *                 modified_by:
 *                   type: integer
 *                   nullable: true
 *                   description: ID of the user who last modified this review.
 *                   example: 41    
 *       400:
 *         description: Bad Request. Invalid input or missing fields.
 *       500:
 *         description: Internal Server Error. Could not create the review.
 */

    // Create a new Reviews
    router.post("/", Reviews.create);

    /**
 * @swagger
 * /api/reviews/rating/qset/{id}:
 *   get:
 *     summary: Calculate the average rating of a specific QuestionSet
 *     description: Retrieves the average rating for a QuestionSet based on user reviews.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the QuestionSet for which the rating is being calculated.
 *         example: 43
 *     responses:
 *       200:
 *         description: Successfully retrieved the rating for the QuestionSet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rating:
 *                   type: string
 *                   description: The average rating for the specified QuestionSet.
 *                   example: "5.00000000"
 *       404:
 *         description: QuestionSet not found.
 *       500:
 *         description: Internal Server Error. Could not calculate the rating.
 */

     //rating calculation of one questionset
     router.get('/rating/qset/:id',cacheMiddleware,Reviews.getRating);

     router.get('/get/rating/ratingmeter/:id',Reviews.getRatingMeterData)

     /**
 * @swagger
 * /api/reviews/qset/{qsetid}/user/{userid}:
 *   get:
 *     summary: Retrieve a user's review for a specific QuestionSet
 *     description: Fetches the rating and review provided by a user for a specific QuestionSet.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: qsetid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the QuestionSet.
 *         example: 43
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose review is being retrieved.
 *         example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's review for the QuestionSet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review_id:
 *                   type: integer
 *                   description: The unique identifier for the review.
 *                   example: 1
 *                 questionset_id:
 *                   type: integer
 *                   description: The ID of the QuestionSet.
 *                   example: 43
 *                 content_quality:
 *                   type: integer
 *                   description: The user's rating for content quality (1-5).
 *                   example: 5
 *                 satisfaction:
 *                   type: integer
 *                   description: The user's satisfaction rating (1-5).
 *                   example: 4
 *                 difficulty:
 *                   type: integer
 *                   description: The user's difficulty rating (1-5).
 *                   example: 3
 *                 review:
 *                   type: string
 *                   description: The user's written review.
 *                   example: "Detailed and well-explained content."
 *                 created_by:
 *                   type: integer
 *                   description: The ID of the user who created this review.
 *                   example: 10
 *                 created_date:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the review was created.
 *                   example: "2024-10-20T23:35:27Z"
 *                 modified_by:
 *                   type: integer
 *                   nullable: true
 *                   description: The ID of the user who last modified this review.
 *                   example: 10
 *                 modified_date:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: The date and time when the review was last modified.
 *                   example: "2024-10-21T10:45:00Z"
 *       404:
 *         description: User review not found for the specified QuestionSet.
 *       500:
 *         description: Internal Server Error. Could not retrieve the user's review.
 */

     // get rating of user using userId,questionset_id
     router.get('/qset/:qsetid/user/:userid',Reviews.getUserReview)

     router.get('/average/rating/:insId',Reviews.getAverageratingForDshb)

     /**
 * @swagger
 * /api/reviews/update/qset/{qsetid}/user/{userid}:
 *   put:
 *     summary: Update a user's review for a specific QuestionSet
 *     description: Updates the ratings and review provided by a user for a specific QuestionSet.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: qsetid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the QuestionSet.
 *         example: 43
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose review is being updated.
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               satisfaction:
 *                 type: integer
 *                 description: The updated satisfaction rating (1-5).
 *                 example: 4
 *               difficulty:
 *                 type: integer
 *                 description: The updated difficulty rating (1-5).
 *                 example: 3
 *               content_quality:
 *                 type: integer
 *                 description: The updated content quality rating (1-5).
 *                 example: 5
 *               review:
 *                 type: string
 *                 description: The updated written review.
 *                 example: "Great explanation and well-organized."
 *     responses:
 *       200:
 *         description: Successfully updated the user's review.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message for successful update.
 *                   example: "Review updated successfully."
 *                 updated_review:
 *                   type: object
 *                   properties:
 *                     questionset_id:
 *                       type: integer
 *                       description: The ID of the QuestionSet.
 *                       example: 43
 *                     user_id:
 *                       type: integer
 *                       description: The ID of the user who updated this review.
 *                       example: 10
 *                     satisfaction:
 *                       type: integer
 *                       description: The updated satisfaction rating.
 *                       example: 4
 *                     difficulty:
 *                       type: integer
 *                       description: The updated difficulty rating.
 *                       example: 3
 *                     content_quality:
 *                       type: integer
 *                       description: The updated content quality rating.
 *                       example: 5
 *                     review:
 *                       type: string
 *                       description: The updated review text.
 *                       example: "Great explanation and well-organized."
 *       400:
 *         description: Bad Request. Invalid input data.
 *       404:
 *         description: Review not found for the specified QuestionSet and User ID.
 *       500:
 *         description: Internal Server Error. Could not update the review.
 */

     // update review
     router.put('/update/qset/:qsetid/user/:userid',Reviews.updateReview)
  
  
    app.use('/api/reviews', router);
  };
  