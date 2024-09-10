const jwt = require("jsonwebtoken");

const secret = "spiderman$123";

const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    profileImgUrl: user.profileImgUrl,
  };
  const token = jwt.sign(payload, secret);
  return token;
};

const validateToken = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};

module.exports = {
  createTokenForUser,
  validateToken,
};
