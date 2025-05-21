const { cacheMiddleware } = require("../middleware/cacheMiddleware");

module.exports = app => {
    
  
    var router = require("express").Router();
    var CronJob = require("../controller/cronservice.controller");
  
  
    router.post("/", CronJob.startCronJob);

    // router.get('/type/:type/question/:id',CronJob);
  
    app.use('/api/cron/job', router);
  };
  