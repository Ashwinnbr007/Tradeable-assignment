const { getClient } = require("../mongoConnection");
const { refferalRegistrationEvent } = require("./registration");
const {
  RefferalDoesNotExistError,
  CannotExpireRefferalError,
} = require("../error");
const { v4: uuid4 } = require("uuid");

// refferalCollection outside functions
// as it is used across functions
const getRefferalCollection = async () => {
  return await getClient().db("refferals").collection("refferal-details");
};

refferalRegistrationEvent.on("refferalUserRegistered", async (refferalId) => {
  const refferalCollection = await getRefferalCollection();
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
    { $inc: { walletCredits: 5000 } }
  );

  if (newRefferalState.maxUses === 0) {
    await refferalCollection.deleteOne({ refferalId: refferalId });
  }
});

async function authenicateAndExpireRefferalLink(username, refferalId) {
  const refferalCollection = await getRefferalCollection();
  const refferal = await refferalCollection.findOne({ refferalId: refferalId });

  if (!refferal) {
    throw new RefferalDoesNotExistError(
      "The given refferal link doesn't exist"
    );
  }

  if (refferal.username !== username) {
    throw new CannotExpireRefferalError(
      "The refferal link can only be expired by the owner of the link"
    );
  }

  await refferalCollection.deleteOne({ refferalId: refferalId });
}

async function verifyRefferalLink(refferalId) {
  const refferalCollection = await getRefferalCollection();
  const refferalExists = await refferalCollection.findOne({
    refferalId: refferalId,
  });

  if (!refferalExists) {
    throw new RefferalDoesNotExistError(
      "The refferal link has either expired or doesn't exist, please use a different refferal link"
    );
  }
  return true;
}

function generateRefferalPayload(username) {
  const refferalId = uuidv4();
  const refferalLink = `0.0.0.0:3000/${refferalId}`;
  const maxUses = 5;
  return {
    username,
    refferalId,
    refferalLink,
    maxUses,
  };
}

module.exports = {
  verifyRefferalLink,
  authenicateAndExpireRefferalLink,
  generateRefferalPayload,
};
