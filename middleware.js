const authenticateToken = (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const secretKey = "key";
  const token = req.headers["authorization"].split(" ").pop();

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
