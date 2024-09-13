module.exports = app => {
    const UsersPreferences = require("../controller/userspreferences.controller");
  
    var router = require("express").Router();
  
    // Create a new UsersPreferences
    router.post("/", UsersPreferences.create);
  
    router.get("/:id",UsersPreferences.findById);
    
    // Delete a UsersPreferences with id
    router.delete("/:id", UsersPreferences.delete);
  
    // Delete all UsersPreferencess
    router.delete("/", UsersPreferences.deleteAll);

    // Retrieve a categories with question_id
    router.get("/categories/:id", UsersPreferences.getCategoriesByUserId);
  
    app.use('/api/users/preference', router);
  };
  