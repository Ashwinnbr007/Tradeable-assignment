require("dotenv").config();
const authenticateToken = (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const secretKey = process.env.JWT_SECRET;
  let token;

  if (!req.headers["authorization"])
    return res.status(401).json({ message: "Unauthorized!" });

  token = req.headers["authorization"].split(" ").pop();

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
