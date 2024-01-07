const {
  generateRefferalPayload,
  verifyRefferalLink,
  authenicateAndExpireRefferalLink,
} = require("../../utils/refferal");
const { uploadDataToDB } = require("../../utils/database");
const {
  CannotExpireRefferalError,
  RefferalDoesNotExistError,
} = require("../../error");
let sharedRefferalId;

test("test generate refferal payload -> Should pass", () => {
  const payload = generateRefferalPayload("TestUser");
  sharedRefferalId = payload.refferalId;
  expect(payload).toBeTruthy();
  expect(payload).toHaveProperty("username");
  expect(payload).toHaveProperty("refferalId");
  expect(payload).toHaveProperty("refferalLink");
});

test("test verify refferal link -> Should pass", async () => {
  const payload = {
    username: "TestUser",
    refferalId: sharedRefferalId,
    refferalLink: `0.0.0.0:3000/register/${sharedRefferalId}`,
  };
  await uploadDataToDB(payload, "refferals", "refferal-details");
  const truthyReturn = await verifyRefferalLink(sharedRefferalId);
  expect(truthyReturn).toBeTruthy();
});

test("test verify refferal link -> Should fail", async () => {
  console.log(sharedRefferalId);
  const payload = {
    username: "TestUser",
    refferalId: sharedRefferalId,
    refferalLink: `0.0.0.0:3000/register/${sharedRefferalId}`,
  };
  await uploadDataToDB(payload, "refferals", "refferal-details");
  return await verifyRefferalLink(sharedRefferalId + "randomJibberish").catch(
    (err) => {
      expect(err).toBeInstanceOf(RefferalDoesNotExistError);
    }
  );
});

test("test authenticate and exprire refferal -> Should pass", async () => {
  return await authenicateAndExpireRefferalLink("TestUser", sharedRefferalId);
});

test("test authenticate and exprire refferal -> Should fail", async () => {
  return await authenicateAndExpireRefferalLink(
    "RandomJibbersihUsername",
    sharedRefferalId
  ).catch((err) => {
    expect(err).toBeInstanceOf(CannotExpireRefferalError);
  });
});
