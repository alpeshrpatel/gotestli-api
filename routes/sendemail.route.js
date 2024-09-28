module.exports = app => {
    const sendMail = require('../controller/sendemail.controller');

    var router = require('express').Router();

    router.post('/',sendMail.sendReminder);

    app.use('/api/sendemail',router)

};