const { getClient } = require("../mongoConnection");

async function flushTestUser() {
  await getClient()
    .db("users")
    .collection("login-details")
    .findOneAndDelete({ username: "TestUser" });
  await getClient()
    .db("users")
    .collection("wallet-balance")
    .findOneAndDelete({ username: "TestUser" });
  await getClient()
    .db("refferals")
    .collection("refferal-details")
    .findOneAndDelete({ username: "TestUser" });
}

module.exports = flushTestUser;
