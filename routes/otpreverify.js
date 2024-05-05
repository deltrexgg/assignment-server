const nodemailer = require('nodemailer');
const User = require('../models/user');
const dotenv = require('dotenv');

const OtpReverify = async(uid, email) => {
    dotenv.config();
    function generateRandomNumber(min, max) {
        if (min > max) {
          throw new Error('Invalid input: Minimum value must be less than or equal to maximum value.');
        }
        const randomDecimal = Math.random();
        const range = max - min + 1;
        const randomNumber = Math.floor(randomDecimal * range) + min;
      
        return randomNumber;
      }
      let otpnum = generateRandomNumber(1000, 9999);
      try {
        const verifiedstatus = await User.updateOne({_id: uid}, {otp : otpnum});       
         const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'deltrexgg@gmail.com',
                pass: process.env.GMAILPASS
            }
        });

        const mailOptions = {
            from: 'deltrexgg@gmail.com',
            to: email,
            subject: 'Your OTP for Reverification',
            text: `Your OTP is: ${otpnum}`
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log('Error occurred:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

      } catch (error) {
       console.log(error) 
      }
}

module.exports = OtpReverify;