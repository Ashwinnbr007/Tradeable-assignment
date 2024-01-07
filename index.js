require("dotenv").config();
const express = require("express");
// Middlewares
const { authenticateToken, limiter } = require("./middleware");
// Utils
const { uploadDataToDB, retreiveDataFromDB } = require("./utils/database");
const { decryptPassword, handleRegistration } = require("./utils/registration");
const {
  verifyRefferalLink,
  authenicateAndExpireRefferalLink,
} = require("./utils/refferal");
// Custom errors
const errorModule = require("./error");
// DatabaseConnection
const { connectToMongoDB } = require("./mongoConnection");

const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;
const secretKey = process.env.JWT_SECRET;

// Routers and global middlewares
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
apiRouter.post("/register", limiter, async (req, res) => {
  await handleRegistration(req, res);
});

apiRouter.post("/register/:refferalId", limiter, async (req, res) => {
  const referralId = req.params.refferalId.split(" ").pop();
  try {
    await verifyRefferalLink(referralId);
  } catch (error) {
    return res.status(404).json({ Error: error.message });
  }
  await handleRegistration(req, res, referralId);
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

// Balance
apiRouter.get("/balance", authenticateToken, async (req, res) => {
  const { username } = req.user;
  let data;
  try {
    data = await retreiveDataFromDB(
      { username: username },
      "users",
      "wallet-balance"
    );
  } catch (error) {
    if (error instanceof errorModule.UserDoesNotExistError)
      return res.status(404).json({ Error: error.message });
    res.status(500).json({ Error: error.message });
  }
  res.json(data);
});

// Refferal routes
refferalRouter.post(
  "/generate",
  authenticateToken,
  limiter,
  async (req, res) => {
    const { v4: uuidv4 } = require("uuid");
    const refferalId = uuidv4();
    const refferalLink = `0.0.0.0:3000/register/${refferalId}`;
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
  }
);

refferalRouter.post("/verify", limiter, async (req, res) => {
  const { refferalLink } = req.body;
  try {
    await verifyRefferalLink(refferalLink.split("/").pop());
  } catch (err) {
    if (err instanceof errorModule.RefferalDoesNotExistError)
      return res.status(404).json({ Error: "The refferal link is invalid" });
    return res.status(500).json({ Error: error.message });
  }
  return res.json({ message: "The refferal link is valid" });
});

refferalRouter.post("/expire", authenticateToken, async (req, res) => {
  const { username } = req.user;
  const { refferalLink } = req.body;
  try {
    await authenicateAndExpireRefferalLink(
      username,
      refferalLink.split("/").pop()
    );
  } catch (err) {
    if (err instanceof errorModule.CannotExpireRefferalError) {
      return res.status(401).json({ Error: err.message });
    } else if (err instanceof errorModule.RefferalDoesNotExistError) {
      return res.status(404).json({ Error: err.message });
    }
    return res.status(500).json({ Error: err.message });
  }
  res.json({ message: "Refferal link successfully removed" });
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
