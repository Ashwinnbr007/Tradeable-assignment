require("dotenv").config();
const express = require("express");
const { authenticateToken } = require("./middleware");
const { bcryptPassword, uploadDataToDB } = require("./utils");
const jwt = require("jsonwebtoken");
const { connectToMongoDB } = require("./mongoConnection");

const app = express();
const PORT = 3000;
const secretKey = process.env.JWT_SECRET;

app.use(express.json());
connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Registeration and login
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcryptPassword(password);
  const accessToken = jwt.sign({ username }, secretKey, { expiresIn: "1d" });
  const payload = {
    username: username,
    password: hashedPassword,
  };
  await uploadDataToDB(payload, "users", "login-details");

  res.json({
    message: "Successfully regsitered a new user",
    AccessToken: accessToken,
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
