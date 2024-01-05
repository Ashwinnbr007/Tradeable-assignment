require("dotenv").config();
const express = require("express");
const { authenticateToken } = require("./middleware");
const {
  bcryptPassword,
  uploadDataToDB,
  retreiveDataFromDB,
  decryptPassword,
} = require("./utils");
const errorModule = require("./error");
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
  const payload = {
    username: username,
    password: hashedPassword,
  };
  try {
    await uploadDataToDB(payload, "users", "login-details");
  } catch (error) {
    if (error instanceof errorModule.UsernameExistsError) {
      return res.status(409).json({ Error: error.message });
    }
    return res.status(500).json({ Error: error.message });
  }

  res.status(201).json({
    message: "Successfully regsitered a new user",
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let data;
  try {
    data = await retreiveDataFromDB(
      { username: username },
      "users",
      "login-details"
    );
  } catch (error) {
    if (error instanceof errorModule.UserDoesNotExistError)
      return res.status(404).json({ Error: error.message });
    res.status(500).json({ Error: error.message });
  }
  const match = await decryptPassword(password, data.password);
  if (match) {
    const accessToken = jwt.sign({ username }, secretKey, { expiresIn: "1d" });
    return res.json({
      message: "Successfully logged in!",
      accessToken: accessToken,
    });
  }
  res.status(401).json({ message: "Invalid password. Try Again!" });
});

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
