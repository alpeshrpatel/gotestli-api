const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const CheatsheetSocial = require("../controller/cheatsheetsocial.controller");
  
    var router = require("express").Router();
  
  

    // Create a new Comments
    router.post("/", CheatsheetSocial.create);

    router.get('/:cheatsheetid',CheatsheetSocial.getCheatsheetLikes);
  


   
  
    app.use('/api/cheatsheet/social', router);
  };
  