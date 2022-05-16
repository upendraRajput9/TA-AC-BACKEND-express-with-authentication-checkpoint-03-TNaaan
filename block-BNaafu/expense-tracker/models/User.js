var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    age:{type:Number},
    phone:{type:Number},
    country:{type:String},
    income:[{type: Schema.Types.ObjectId , ref:"Income"}],
    expense:[{type: Schema.Types.ObjectId , ref:"Expense"}]
},{timestamps:true});


userSchema.pre('save',function(next){
    if(this.password&&this.isModified('password')){
        bcrypt.hash(this.password,10,(err,hashing)=>{
            if(err) return next(err);
            this.password = hashing;
            console.log(this.password);
            return next()
        })
    }else{
        return next()
    }
    })
    
    userSchema.methods.verifyPassword = function(password,cb){
        bcrypt.compare(password,this.password,(err,result)=>{
            return cb(err,result)
        })
    } 
    
    
    
    
module.exports = mongoose.model('User',userSchema);




