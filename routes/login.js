const User = require('../models/user')
const OtpReverify = require('./otpreverify')

const Login = async(email,password) => {
    try {
        return new Promise(async (resolve, reject) => {
            const emailid = await User.findOne({email : email})
            if(!emailid){
                console.log("Status update")
                resolve({type : "Not registered Email", message : "User Don't Exist"})
            }else if(emailid.verifiedstatus === 'false' && password == emailid.password){
                const otpreverify = await OtpReverify(emailid._id, emailid.email)
                resolve({type : 'otpreverify', uid : emailid._id})
            }
            else if(password == emailid.password){
                console.log("Status update 1")
                resolve({type : "login_success", uid : emailid._id})
            }else{
                console.log("Status update 2")
                resolve({type : "not match", meassage : "Credentials Don't Match"})
            }
        })
    } catch (error) {
        
    }
}

module.exports = Login;