const bcrypt = require("bcrypt");
const { uploadDataToDB } = require("./database");
const EventEmitter = require("events");
const refferalRegistrationEvent = new EventEmitter();
const { UsernameExistsError } = require("../error");

async function bcryptPassword(plainTextPassword) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainTextPassword, saltRounds);
  return hash;
}

async function decryptPassword(userInputPassword, passwordHash) {
  return await bcrypt.compare(userInputPassword, passwordHash);
}

async function handleRegistration(req, res, refferalId) {
  const { username, password, walletCredits } = req.body;
  const hashedPassword = await bcryptPassword(password);
  const userRegistrationPayload = {
    username: username,
    password: hashedPassword,
  };
  const walletRegistrationPayload = {
    username: username,
    walletCredits: walletCredits ? walletCredits : 0,
  };
  try {
    await uploadDataToDB(userRegistrationPayload, "users", "login-details");
    await uploadDataToDB(walletRegistrationPayload, "users", "wallet-balance");
    if (refferalId) {
      refferalRegistrationEvent.emit("refferalUserRegistered", refferalId);
    }
    res.status(201).json({
      message: "Successfully registered a new user",
    });
  } catch (error) {
    if (error instanceof UsernameExistsError) {
      return res.status(409).json({ Error: error.message });
    }
    return res.status(500).json({ Error: error.message });
  }
}

module.exports = {
  handleRegistration,
  refferalRegistrationEvent,
  decryptPassword,
};
