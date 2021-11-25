const { user } = require("../../models/user");
const encryption = require("../utils/encryption");
const { generateToken } = require("../utils/jwt");

class SignIn {
  static async signIn(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    const data = await user.findOne({ where: { email: email } });
    if (!data) {
      return res.status(400).json({ message: "email yang diisi salah" });
    }

    let isPassValid = encryption.isPassValid(password, data.password);
    if (!isPassValid) {
      return res.status(401).json({ message: "kata sandi yang dimasukkan salah" });
    }

    const { id, firstname, lastname } = data;

    const payload = {
      id,
      email,
      firstname,
      lastname,
    };

    const token = generateToken(payload);
    return res.status(200).json({ message: "login succes", token });
  }
}

module.exports = SignIn;
