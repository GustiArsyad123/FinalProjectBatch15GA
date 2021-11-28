const { verifyToken } = require("../../utils/jwt");
const { user } = require("../../models");

exports.authentication = async (req, res, next) => {
    try {
        const token = req.headers.access_token

    if (token) {
        const payload = verifyToken(token)
        const email = payload.email

        const loginUser = await user.findOne({
        where: {
          email: email,
        }
        });

        if (loginUser) {
          req.userData = payload
          next()
        } else {
            res.status(401).json({
              success: false,
              errors: "Please Login"
            })
        }

    } else {
        res.status(401).json({
          success: false,
          errors: "Please Login"
        })
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: ["Internal Server Error"] });
  }
}