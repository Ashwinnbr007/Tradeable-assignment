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
const apiRouter = express.Router();
const refferalRouter = express.Router();

app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/refferal", refferalRouter);

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Registeration and login
apiRouter.post("/register", async (req, res) => {
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

apiRouter.post("/login", async (req, res) => {
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

// Refferal routes
refferalRouter.post("/generate", authenticateToken, async (req, res) => {
  const { v4: uuidv4 } = require("uuid");
  const refferalId = uuidv4();
  const refferalLink = `0.0.0.0:3000/login/${refferalId}`;
  const payload = {
    username: req.user.username,
    refferalId: refferalId,
    refferalLink: refferalLink,
    maxUses: 5,
  };

  try {
    await uploadDataToDB(payload, "refferals", "refferal-details");
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }

  res.status(201).json({
    message: `Refferal link generated ${refferalLink} for ${req.user.username}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
