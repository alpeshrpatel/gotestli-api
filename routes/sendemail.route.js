module.exports = app => {
    const sendMail = require('../controller/sendemail.controller');

    var router = require('express').Router();

    router.post('/',sendMail.sendReminder);

    // check status of last click on reminder button
     router.put('/check/status',sendMail.updateReminderStatus)

    app.use('/api/sendemail',router)

};