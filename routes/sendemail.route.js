module.exports = app => {
    const sendMail = require('../controller/sendemail.controller');

    var router = require('express').Router();

    router.post('/',sendMail.sendReminder);

    // check status of last click on reminder button
     router.put('/check/status',sendMail.updateReminderStatus);

     // send notification mail to instructor after uploading questions to db
     router.post("/instructor/uploadfile/result", sendMail.sendNotifyMailToInsructor);

     //send mail for get in touch subscription
     router.post("/getintouch/subscribed", sendMail.getInTouchSubscribedMail);

     //send mail whenever new question set published by instructor
     router.post('/followers/update', sendMail.sendUpdateToFollowers);

     //send otp verification mail
     router.post('/send/otp',sendMail.sendOtpMail)

     //send mail for get in touch subscription
     router.post("/getintouch/heerrealtor", sendMail.getInTouchForHeerRealtor);

     //send onboarding mail
     router.post("/org/onboarding/approval", sendMail.getOrganizationOnboarding);

     //send invitation mail for user(student/instructor) /api/sendemail/org/user/invitation/from-admin
     router.post("/org/user/invitation/from-admin", sendMail.getUserInvitation);

    router.post("/refund/request/admin", sendMail.getRefundRequestToAdmin);

    router.post("/refund/request/student", sendMail.getRefundRequestFromStudent);

    app.use('/api/sendemail',router)

};