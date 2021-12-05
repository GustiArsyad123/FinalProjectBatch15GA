const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { user } = require("../models");
const { encodePin } = require("../utils/bcrypt");
const { createToken } = require("../utils/index");

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Logic to signin
exports.facebook = (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user, info) => {
    if (err) {
      return next({ message: err.message, statusCode: 401 });
    }

    if (!user) {
      return next({ message: info.message, statusCode: 401 });
    }

    req.user = user;

    // const token = jwt.sign(
    //   {
    //     user: req.user,
    //   },
    //   process.env.SECRET
    // );

    const payload = {
      id: req.user.id,
      userName: req.user.idfacebook,
      email: req.user.idfacebook,
      idfacebook: req.user.idfacebook
    };
    const token = createToken(payload);

    return res.status(200).json({
      message: "Success",
      token,
    });
  })(req, res);
};

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: "246708500889479",
      clientSecret: "3f7a44e7149337c6ad443e1fdfc29646",
      callbackURL: "https://chefbox2021.herokuapp.com/user/facebook",
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)"
      ],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log(profile);
        const image = profile._json.picture.data.url;
        const { fisrt_name, last_name, id } = profile._json;

        let data = await user.findOne({
          where: { idfacebook: id },
        });
        console.log(data);
        let pass = "Abcd123456@";
        pass = encodePin(pass);
        if (data == null) {
          await user.create({
            firstName: fisrt_name,
            lastName: last_name,
            userName: id,
            image,
            email: id,
            password: pass,
            idfacebook: id
          });

          data = await user.findOne({ where: { idfacebook: id } });
          console.log(data);
        }
        profile = data;
        return done(null, profile, { message: "Login success!" });
      } catch (error) {
        console.log(error);
        return done(error, false, { message: "User can't be created" });
      }
    }
  )
);

// Logic to signin
exports.google = (req, res, next) => {
  passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (err, user, info) => {
      if (err) {
        return next({ message: err.message, statusCode: 401 });
      }

      if (!user) {
        return next({ message: info.message, statusCode: 401 });
      }

      req.user = user;

      // const token = jwt.sign(
      //   {
      //     user: req.user,
      //   },
      //   process.env.SECRET
      // );

      const payload = {
        id: req.user.id,
        userName: req.user.userName,
        email: req.user.email
      };
      const token = createToken(payload);

      return res.status(200).json({
        message: "Success",
        token,
      });
    }
  )(req, res, next);
};

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:
        "622026911045-f3r27uj8ka75p6s4iv7eagpmv0vdlll8.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://chefbox2021.herokuapp.com/user/google",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log(profile);
        // const image = profile.photos.value;
        const { email, name, sub, picture } = profile._json;

        let data = await user.findOne({
          where: { userName: sub },
        });
        
        let pass = "Abcd123456@";
        pass = encodePin(pass);
        if (data == null) {
          await user.create({
            firstName: name,
            userName: sub,
            email,
            image: picture,
            password: pass
          });

          data = await user.findOne({ where: { email: email } });
          console.log("INI DATA", data);
        }

        profile = data;

        return done(null, profile, { message: "Login success!" });
      } catch (error) {
        return done(error, false, { message: "User can't be created" });
      }
    }
  )
);
