module.exports = app => {
    const ContactMessages = require("../controller/contactmessages.controller");
  
    var router = require("express").Router();
  
    // Create a new ContactMessages
    router.post("/", ContactMessages.create);
  
    router.get("/:id",ContactMessages.findById);
  
    // Delete all ContactMessagess
    router.delete("/", ContactMessages.deleteAll);

   
  
    app.use('/api/contact/messages', router);
  };
  