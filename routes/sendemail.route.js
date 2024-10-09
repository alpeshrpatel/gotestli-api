module.exports = app => {
    const sendMail = require('../controller/sendemail.controller');

    var router = require('express').Router();

    router.post('/',sendMail.sendReminder);

    // check status of last click on reminder button
     router.put('/check/status',sendMail.updateReminderStatus);

     // send notification mail to instructor after uploading questions to db
     router.post("/instructor/uploadfile/result", sendMail.sendNotifyMailToInsructor);

    app.use('/api/sendemail',router)

};