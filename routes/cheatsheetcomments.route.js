const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const CheatsheetComment = require("../controller/cheatsheetcomments.controller");
  
    var router = require("express").Router();
  
  

    // Create a new Comments
    router.post("/", CheatsheetComment.create);

    router.get('/:cheatsheetid',CheatsheetComment.getCheatsheetCommentById);

    router.get('/replies', cacheMiddleware, CheatsheetComment.getRepliesByCommentId);

    router.put("/:id", CheatsheetComment.update);

    router.delete("/:id", CheatsheetComment.remove);

    router.delete("/reply/:id", CheatsheetComment.removeReply);
  


   
  
    app.use('/api/cheatsheet/comment', router);
  };
  