require("dotenv").config();
const rateLimitter = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { TokenExpiredError } = require("jsonwebtoken");

// Rate limitting at the maximum rate of 5/min

const limiter = rateLimitter({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      Error: "Rate limit exceeded. Please try again later.",
    });
  },
});

const authenticateToken = (req, res, next) => {
  const secretKey = process.env.JWT_SECRET;
  let token;

  if (!req.headers["authorization"])
    return res.status(401).json({ message: "Unauthorized!" });

  token = req.headers["authorization"].split(" ").pop();

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      if (err instanceof TokenExpiredError)
        return res
          .status(403)
          .json({ Error: "Your token has expired, please login again" }); // Forbidden
      return res.status(500).json({ Error: err.message });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken, limiter };
