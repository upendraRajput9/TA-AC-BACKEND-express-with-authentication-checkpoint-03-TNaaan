var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var otpSchema = new Schema({
    email:String,
    code:String,
    expireIn:Number
},{timestamps:true});
module.exports = mongoose.model('Otp', otpSchema,"otp")