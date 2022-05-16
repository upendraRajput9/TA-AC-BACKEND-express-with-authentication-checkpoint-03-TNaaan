var passport = require('passport')
var User = require('../models/User')
var GitHubStrategy = require('passport-github2').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    function(accessToken, refreshToken, profile, done){
        console.log("😎",profile.displayName,profile._json.email)
      console.log(accessToken, refreshToken, profile)
      var profileData = {
        name: profile.displayName,
        email: profile._json.email,
      }
      User.findOne({ email: profile._json.email }, (err, user) => {
        
        if (err) return done(err)
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err)
            return done(null, addedUser)
          })
        } else {
          return done(null, user)
        }
      })
    },
  ),
)

passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/callback"
},
(accessToken, refreshToken, profile, done)=>{
    console.log(profile)
    var profileData={
        name:profile.displayName,
        email:profile._json.email,

    }
    User.findOne({email:profile._json.email},(err,user)=>{
        if(err) return done(err);
        if(!user){
            User.create(profileData,(err,addedUser)=>{
                if(err) return done(err);
                return done(null,addedUser)
            })
        }
        done(null,user)
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, 'name email username', function (err, user) {
    done(err, user)
  })
})
