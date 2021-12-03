const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: "1052538138732-pd31cid76k363aolh4cusuvstog1uc68.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://chefbox2021.herokuapp.com/facebook/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return done(err, user);
      //   });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
