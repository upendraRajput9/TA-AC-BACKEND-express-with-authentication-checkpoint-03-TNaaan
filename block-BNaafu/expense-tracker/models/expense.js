var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var expenseSchema = new Schema({
category:{type:String,required:true},
    amount:{type:Number,required:true},
    date:{type:Date,default:new Date()},
user:{type: Schema.Types.ObjectId,ref:'User'}
},{timestamps:true});

module.exports=mongoose.model('Expense',expenseSchema);