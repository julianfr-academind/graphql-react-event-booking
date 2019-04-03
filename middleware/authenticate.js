const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.get("Authorization");

  if (!authorization) {
    req.isAuth = false;
    return next();
  }

  const token = authorization.split(" ")[1];

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, "somesupersecretkey");

    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }

    req.isAuth = true;
    req.user = decodedToken.user;
    next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }
}