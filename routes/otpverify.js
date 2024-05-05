const User = require('../models/user')

const OtpVerify = async(userid,otp) => {
    try {
        return new Promise(async (resolve, reject) => {
            const UserOtp = await User.findOne({_id: userid},{'otp': 1});

            if(otp == UserOtp.otp){
                const verifiedstatus = await User.updateOne({_id: userid}, {verifiedstatus : "true"});
                console.log(verifiedstatus)
                resolve({condition : true, message : "Successfully Verified"})
            }else{
                resolve({condition : false, message : "Otp is Not Matching"})
            }
        })
    } catch (error) {
        console.log("Error from Promise : "+error)
    }
}

module.exports = OtpVerify;