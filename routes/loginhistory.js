const User = require('../models/user')

const LoginHistory = async(uid) => {
    try {
        return new Promise(async (resolve, reject) => {
            const history = await User.findOne({_id : uid})
            resolve({type: 'login_history', data : history.loginhistory, username : history.user})
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = LoginHistory