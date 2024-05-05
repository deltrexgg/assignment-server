const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {type:String, required: true},
    email: {type: String, required: true},
    password: {type:String, required: true},
    otp: {type:String, required: true},
    verifiedstatus: {type:String, required: true},
    loginhistory: [String],
})

const user = mongoose.model('user',userSchema);
module.exports = user;