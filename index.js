require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const user = require("./routes/user");
const recipe = require("./routes/recipe");
const review = require("./routes/review");
const order = require("./routes/order");
const cart = require("./routes/cart");
const errorHandler = require("./middlewares/errorHandler/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static("public"));
// app.use(passport.initialize());
// app.use(passport.session());

// Faceook Oauth
// app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);


// passport.serializeUser(function (user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function (obj, cb) {
//   cb(null, obj);
// });

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: config.facebookAuth.clientID,
//       clientSecret: config.facebookAuth.clientSecret,
//       callbackURL: config.facebookAuth.callbackURL,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       return done(null, profile);
//     }
//   )
// );

// app.use("/", routes);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEYCLOUD,
  api_secret: process.env.API_SECRET,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", user);
app.use("/recipe", recipe);
app.use("/review", review);
app.use("/order", order);
app.use("/cart", cart);

app.get("*", (req, res, next) => {
  res.send("404 Page Not Found");
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server running smoothly on ${port}`));
