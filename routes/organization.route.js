const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    const Organization = require("../controller/organization.controller");
  
    var router = require("express").Router();
    


    router.post("/", Organization.create);

    router.get("/getall/organizations", Organization.getOrganizations)

    router.put("/approval/status", Organization.updateApproval)

    


   
  
    app.use('/api/org', router);
  };
  