const express = require("express");
const app = express();
const PORT = 3000;
const { authenticateToken } = require("./middleware.js");
const jwt = require("jsonwebtoken");
const secretKey = "key";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Login route
app.post("/login", (req, res) => {
  const { username } = req.body;
  const user = { username };
  const accessToken = jwt.sign(user, secretKey, { expiresIn: "1h" });
  res.json({ accessToken });
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
