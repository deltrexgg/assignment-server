const User = require('../models/user')

const LoginUpdate = async(uid, loginupdate) => {
    console.log("Login Update", uid, loginupdate)

    User.findOneAndUpdate(
        { _id: uid }, 
        { $push: { loginhistory: loginupdate } }, 
        { new: true } 
      )
      .then(updatedUser => {
        console.log('Updated user:', updatedUser);
      })
      .catch(err => {
        console.error('Error updating user:', err);
      });
}

module.exports = LoginUpdate;