const { getClient } = require("./mongoConnection");
const bcrypt = require("bcrypt");
const { UsernameExistsError, UserDoesNotExistError } = require("./error");

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
};
