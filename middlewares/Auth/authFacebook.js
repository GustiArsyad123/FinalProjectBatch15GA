const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");

app.use(passport.initialize());
app.use(passports.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID_FB_AUTH,
      clientSecret: process.env.CLIENT_SECRET_FB_AUTH,
      callbackURL: "https://chefbox2021.herokuapp.com/user/facebook/callback",
      profileFields: ["id", "displayName", "name", "gender", "picture.type(large)", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

module.exports = passport;
