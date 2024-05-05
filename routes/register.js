const User = require('../models/user');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const Register = async (name, email, password) => {
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
        const databaseEmail = await User.findOne({ email: email }, { '_id': 0, 'email': 1 });

        if (databaseEmail) {
            return { condition: false, message: "Email exists" };
        } else {

            const newuser = new User({
                user: name,
                password: password,
                email: email,
                otp: otpnum,
                verifiedstatus: false
            });

            return new Promise((resolve, reject) => {
                newuser.save().then(async () => {
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
                        subject: 'Your OTP for Verification',
                        text: `Your OTP is: ${otpnum}`
                    };

                    transporter.sendMail(mailOptions, async (error, info) => {
                        if (error) {
                            console.log('Error occurred:', error);
                            reject(error); // Reject promise if sending email fails
                        } else {
                            console.log('Email sent:', info.response);
                            const userid = await User.findOne({ email: email }, {_id : 1});
                            console.log(userid)
                            resolve({ condition: true, userid: userid._id }); // Resolve promise with result
                        }
                    });
                }).catch(error => {
                    console.error('Error saving user:', error);
                    reject(error); // Reject promise if saving user fails
                });
            });
        }
    } catch (error) {
        console.error('Catch error:', error);
        return { condition: false, message: "Catch error: " + error };
    }
}

module.exports = Register;
