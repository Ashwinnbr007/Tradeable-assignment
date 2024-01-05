async function bcryptPassword(plainTextPassword) {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainTextPassword, saltRounds);
  return hash;
}

function verifyUsernameAndPassword() {
  //TODO : 1. make sure the username doesn't exist already
}

async function uploadDataToDB(payload, database, collectionName) {
  if (collectionName === "login-details") {
    verifyUsernameAndPassword();
  }
  const { getClient } = require("./mongoConnection");
  const db = getClient().db(database);
  const collection = db.collection(collectionName);
  await collection.insertOne(payload);
}
module.exports = { bcryptPassword, uploadDataToDB };
