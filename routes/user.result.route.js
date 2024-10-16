module.exports = (app) => {
  const userresult = require("../controller/user.result.controller");
  const jwt = require("jsonwebtoken");

  var router = require("express").Router();

  const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    
    if (authHeader) {
      const token = authHeader.split(" ")[1]; 

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

       
        // req.user = user;
        next();
      });
    } else {
      res.status(401).json({ message: "Token is missing" });
    }
  };

  // Create a new QuestionSet
  router.post("/", authenticateJWT, userresult.create);

  // Retrieve a single QuestionSet with id
  router.get("/:id", authenticateJWT, userresult.findOne);

  // Retrieve a single QuestionSet with id
  router.get("/user/:userid", authenticateJWT, userresult.findByUserId);

  // Retrieve a single QuestionSet with id
  router.get(
    "/user/:userid/questionset/:questionsetid",
    authenticateJWT,
    userresult.findQuestionSetByUserId
  );

  // Retrieve a history of results of user
  router.get(
    "/history/user/:userid/questionset/:questionsetid",
    authenticateJWT,
    userresult.getHistoryOfUser
  );

  // Retrieve users list who attempted quiz
  router.get(
    "/students/list/:questionSetId",
    authenticateJWT,
    userresult.getStudentsList
  );
  
  // Retrieve data for dashboard
  router.get(
    "/student/dashboard/analysis/:userId",
    authenticateJWT,
    userresult.getDshbDataAnalysis
  );

  // Update a QuestionSet with id
  //  router.put("/calculate/finalresult", userresult.calculate);

  // Update a QuestionSet with id
  router.put("/:id", authenticateJWT, userresult.update);

  // Update a QuestionSet with id
  router.put("/calculate/finalresult", authenticateJWT, userresult.calculate);

  // Delete a QuestionSet with id
  router.delete("/:id", authenticateJWT, userresult.delete);

  // Delete all QuestionSets
  router.delete("/", authenticateJWT, userresult.deleteAll);

  app.use("/api/userresult", router);
};
