var express = require('express')
var User = require('../models/User');
var Otp = require('../models/otp')
var router = express.Router()
var passport = require('passport');
var nodemailer = require('nodemailer');
const otp = require('../models/otp');


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user,"🤩")
  res.render('index', { title: 'Express' })
})

router.get('/sucess', (req, res) => {
  res.render('sucess')
})

router.get('/failure', (req, res) => {
  res.render('failure')
})

router.get('/auth/github', passport.authenticate('github',{ scope: [ 'email' ] }))

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/users/login' }),

  (req, res) => {
    res.redirect('/expenses/dashboard');
  },
)
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile',"email"] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/expenses/dashboard');
  });

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect("/")
})
//OTP
router.post('/email-send',async (req,res,next)=>{
  await Otp.deleteOne({})
  let data = await User.findOne({email:req.body.email})
  if(data){
    let otpcode =Math.floor(1000 + Math.random() * 9000);
    let otpData = new Otp({
      email:req.body.email,
      code:otpcode,
      expireIn: new Date().getTime()+300*1000
    })
    let otpResponse = await otpData.save();
    console.log(data.code)
    res.redirect('/send-otp/'+data.email);
  }else{
    res.redirect('/users/otp')
  }
  
})
router.post('/change-password',async (req,res)=>{
  let data = await Otp.find({email:req.body.email,code:req.body.otpCode});
  if(data){
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if(diff<0){
      //token expire
    }else{
      let user = await User.findOne({email:req.body.email});
      user.password = req.body.password;
      user.save()
    }
  }
  res.redirect('/users/login');
})
//send email
router.get('/send-otp/:email',async (req,res)=>{
  var email=req.params.email;
  var data = await Otp.findOne({email:email})
var tansporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.GMAIL,
    pass:process.env.GMAIL_PASSWORD
  }
})
var mailOptions = {
  from:process.env.GMAIL,
to:data.email,
subject:"OTP",
text:data.code
};

tansporter.sendMail(mailOptions,function(err,info){
  
  if(err){
    console.log(err)
    res.redirect('/users/otp-form')
  }else{
    console.log('Email send' + info.response)
    res.render('otp',{email:data.email});
  }
})
})  

module.exports = router
