const { uploadDataToDB } = require("../utils/database");
const { bcryptPassword } = require("../utils/registration");

async function initaliseATestUser() {
  const username = "TestUser";
  const password = await bcryptPassword("some-random-password");
  const testUserpayload = { username, password };

  const walletPayload = { username, walletCredits: 0 };
  await uploadDataToDB(testUserpayload, "users", "login-details");
  await uploadDataToDB(walletPayload, "users", "wallet-balance");
}

module.exports = initaliseATestUser;
