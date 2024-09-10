const { validateToken } = require("../services/auth");

function checkForCookie(cookieName) {
  return (req, res, next) => {
    const tokenValue = req.cookies[cookieName];
    if (!tokenValue) {
      return next();
    }
    try {
      const userpayload = validateToken(tokenValue);
      req.user = userpayload;
    } catch (error) {}
    next();
  };
}

module.exports = {
  checkForCookie,
};
