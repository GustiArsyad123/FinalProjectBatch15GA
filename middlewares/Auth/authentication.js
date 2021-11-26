// Import decode token
const { verifyToken } = require("../../utils/jwt");

// Make validator authentication
class Authentication {
  static isSignedIn(req, res, next) {
    if (!req.headers.token) {
      return res.status(401).json({
        statusCode: 401,
        message: "Please sign in first",
      });
    }
    //   Save token to userData
    let token = req.headers.token;

    let userData = verifyToken(token);
    req.userData = userData;

    next(error);
  }
}

module.exports = Authentication;
