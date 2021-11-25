require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const jwt = require("jsonwebtoken")

const createToken = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.SECRET)
    return token
  } catch (error) {
    return error
  }
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return error
  }
}

module.exports = {
  createToken,
  verifyToken
}