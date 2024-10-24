module.exports = app => {
    const QuestionFiles = require("../controller/questionfiles.controller");
  
    var router = require("express").Router();
  
    // Create a new QuestionFiles
    router.post("/", QuestionFiles.create);

    router.post('/insert/questions', QuestionFiles.insertQuestions);

    // router.get('/download/samplefile', QuestionFiles.getSampleFile);

    router.get('/download', QuestionFiles.getUploadedFile);
  
    router.get("/:id",QuestionFiles.findById);

    router.get("/",QuestionFiles.findByFileName);
    
    // // Delete a QuestionFiles with id
    // router.delete("/instructor/:instructor_id/follower/:follower_id", QuestionFiles.delete);
  
    // // Delete all FollowersLists
    // router.delete("/", QuestionFiles.deleteAll);

   
  
    app.use('/api/question/files', router);
  };
  