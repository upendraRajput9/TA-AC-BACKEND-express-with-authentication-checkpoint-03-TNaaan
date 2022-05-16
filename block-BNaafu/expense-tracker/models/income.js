var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var incomeSchema = new Schema({
    source:{type:String,default:"salary",required:true},
    amount:{type:Number,required:true},
    date:{type:Date,default:new Date()},
user:{type: Schema.Types.ObjectId,ref:'User'}
},{timestamps:true});

module.exports=mongoose.model('Income',incomeSchema);