const { getClient } = require("./mongoConnection");
const bcrypt = require("bcrypt");
const EventEmitter = require("events");
const {
  UsernameExistsError,
  UserDoesNotExistError,
  RefferalDoesNotExistError,
} = require("./error");
const refferalRegistrationEvent = new EventEmitter();

refferalRegistrationEvent.on("refferalUserRegistered", async (refferalId) => {
  const refferalCollection = await getClient()
    .db("refferals")
    .collection("refferal-details");
  const walletCollection = await getClient()
    .db("users")
    .collection("wallet-balance");
  const newRefferalState = await refferalCollection.findOneAndUpdate(
    { refferalId: refferalId },
    { $inc: { maxUses: -1 } },
    { returnDocument: "after" }
  );
  await walletCollection.findOneAndUpdate(
    { username: newRefferalState.username },
    { $inc: { walletBalance: 5000 } }
  );

  if (newRefferalState.maxUses === 0) {
    await refferalCollection.deleteOne({ refferalId: refferalId });
  }
});

async function handleRegistration(req, res, refferalId) {
  const { username, password, walletCredits } = req.body;
  const hashedPassword = await bcryptPassword(password);
  const userRegistrationPayload = {
    username: username,
    password: hashedPassword,
  };
  const walletRegistrationPayload = {
    username: username,
    walletBalance: walletCredits ? walletCredits : 0,
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

async function verifyAndUpdateRefferalLink(refferalId) {
  const refferalCollection = await getClient()
    .db("refferals")
    .collection("refferal-details");
  const refferalExists = await refferalCollection.findOne({
    refferalId: refferalId,
  });

  if (!refferalExists) {
    throw new RefferalDoesNotExistError(
      "The refferal link has either expired or doesn't exist, please use a different refferal link"
    );
  }
}

async function bcryptPassword(plainTextPassword) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainTextPassword, saltRounds);
  return hash;
}

async function decryptPassword(userInputPassword, passwordHash) {
  return await bcrypt.compare(userInputPassword, passwordHash);
}

async function retreiveDataFromDB(dataToRetreive, database, collectionName) {
  const data = await getClient()
    .db(database)
    .collection(collectionName)
    .findOne(dataToRetreive);
  if (!data) {
    throw new UserDoesNotExistError("The specific user does not exist");
  }
  return data;
}

async function uploadDataToDB(payload, database, collectionName) {
  const db = getClient().db(database);
  const collection = db.collection(collectionName);
  if (collectionName === "login-details") {
    const userExists = await collection.findOne({
      username: payload["username"],
    });
    if (userExists) {
      throw new UsernameExistsError("Username already exists");
    }
  }
  await collection.insertOne(payload);
}

module.exports = {
  bcryptPassword,
  uploadDataToDB,
  retreiveDataFromDB,
  decryptPassword,
  handleRegistration,
  verifyAndUpdateRefferalLink,
};
