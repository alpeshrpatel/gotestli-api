const connection = require("../config/mysql.db.config");


const ForgotPwdOtp = function (forgotPwdOtp) {
    // this.id = forgotPwdOtp.id;
    this.email = forgotPwdOtp.email;
    this.otp = forgotPwdOtp.otp;
    this.generated_at = forgotPwdOtp.generated_at;
    this.expires_at = forgotPwdOtp.expires_at;
  };

  const insertGeneratedOtp = async (email,hashedOtp,result ) => {
    const query = "INSERT INTO forgot_pwd_otp (email,otp,generated_at,expires_at) values (?,?,?,?)"
    const values = [
        email,
        hashedOtp,
        new Date(),
        new Date(Date.now() + 10 * 60 * 1000), 
      ];
    connection.query(query,values,(err,res) => {
        if (err) {
         
            result(err, null);
            return;
          }
          result(null, { id: res.insertId});
        
    });
  }

  const getOtpByEmail = async (email,result) => {
    connection.query(`select otp from forgot_pwd_otp where email='${email}' order by generated_at desc`,(err,res) => {
        if (err) {
         
            result(err, null);
            return;
          }
          
          result(null, res);
        
    })
  }

  const deleteOtp = async (email,result) => {
    connection.query(`delete from forgot_pwd_otp where email='${email}'`,(err,res) => {
        if (err) {
         
            result(err, null);
            return;
          }
          
          result(null, res);
        
    })
  }

  module.exports= {insertGeneratedOtp, getOtpByEmail,deleteOtp}
    
  