require("dotenv").config();
const authenticateToken = (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const secretKey = process.env.JWT_SECRET;
  let token;

  try {
    token = req.headers["authorization"].split(" ").pop();
  } catch (error) {
    return res.json({ message: error.toString() });
  }

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
