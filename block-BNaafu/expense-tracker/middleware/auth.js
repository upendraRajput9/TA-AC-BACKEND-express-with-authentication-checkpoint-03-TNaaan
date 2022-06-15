var User=require('../models/User');

module.exports={
    loggedInUser:(req,res,next)=>{
        console.log(req.session.passport)
        if(req.session && req.session.userId&&req.session.passport){
            next();
        }else{
            res.redirect('/users/login');
        }
    },

    userInfo:(req,res,next)=>{
        var userId=req.session && req.session.userId;
        if(req.session.passport){
             userId=req.session.passport.user
        }
        if(userId){
            User.findById(userId,'name email',(err,user)=>{
                if(err) return next(err);
                req.user=user;
                res.locals.user=user;
                next();
            })
        }else{
            req.user=null;
            res.locals.user=null;
            next()
        }
    }
}