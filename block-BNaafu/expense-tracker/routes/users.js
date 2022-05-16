var express = require('express')
var User = require('../models/User')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('register')
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    console.log(err,user)
    if(err) return next(err)
    res.redirect('/users/login')
  })
});

router.get('/login',(req,res)=>{
  console.log(res.user)
  res.render('login')
})

//login

router.post('/login', (req, res, next) => {
  
  var { email, password } = req.body
  if (!email || !password) {
    return res.redirect('/users/login')
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err)
    if (!user) {
      return res.redirect('/users/login')
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err)
      if (!result) {
        return res.redirect('/users/login')
      } else {
       
        req.session.userId = user.id
        console.log(req.session.userId)
        res.redirect('/expenses/')
      }
    })
  })
})
module.exports = router
