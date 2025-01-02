module.exports = app => {
    var router = require("express").Router();
    const ForgetPwdOtp = require("../controller/forgetpasswordotp.controller");

    router.post('/verify/otp',ForgetPwdOtp.verifyOtp )


    app.use('/api/forgetpwd', router);
}