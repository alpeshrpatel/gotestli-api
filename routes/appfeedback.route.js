module.exports = app => {
    var router = require("express").Router();
    const AppFeedback = require("../controller/appfeedback.controller");

    router.post('/',AppFeedback.create )


    app.use('/api/app/feedback', router);
}