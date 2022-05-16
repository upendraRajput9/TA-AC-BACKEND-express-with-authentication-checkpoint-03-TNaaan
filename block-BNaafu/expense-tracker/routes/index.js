var express = require('express')
var router = express.Router()
var passport = require('passport')

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
    res.redirect('/sucess')
  },
)
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile',"email"] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect("/")
})

module.exports = router
