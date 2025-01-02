const { getOtpByEmail, deleteOtp } = require("../models/forgotpasswordotp.model");
const bcrypt = require('bcryptjs')

exports.verifyOtp = (req, res) => {
      // Validate request
      
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
     const {otp,email} = req.body
    //   const createdDate = generateDateTime();
      // Save Comments in the database
     getOtpByEmail (email , async (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while getting OTP."
          });
        else { 
            console.log(data[0]?.otp)
            const hashedOtp = data[0]?.otp
            const isSameOtp = await bcrypt.compare(otp,hashedOtp)
           if(!isSameOtp){
            res.status(500).send({
                message:
                   "Invalid OTP passed ,check carefully!"
              });
              
          }else{
            deleteOtp(email,(err,data) => {
                if (err){
                    console.log(err)
                    res.status(500).send({
                        message:
                           err
                      });  
                }else {
                    res.send({status:'Verified',message:'Email Verified Successfully!'})
                }
            })
            
            
          }
        };
      });
};