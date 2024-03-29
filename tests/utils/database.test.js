const { retreiveDataFromDB, uploadDataToDB } = require("../../utils/database");
const { UserDoesNotExistError, UsernameExistsError } = require("../../error");

// Testing retreiveDataFromDB
test("test data retreival from database -> Should pass", async () => {
  const dataToRetreive = { username: "TestUser" };
  const database = "users";
  const collection = "login-details";
  const data = await retreiveDataFromDB(dataToRetreive, database, collection);
  expect(data).toBeTruthy();
  expect(data).toHaveProperty("username");
  expect(data).toHaveProperty("password");
});

test("test data retreival from database -> Should not pass", async () => {
  const randomJibberishUsername = "dibdovinwovn";
  const dataToRetreive = { username: randomJibberishUsername };
  const database = "users";
  const collection = "login-details";
  return await retreiveDataFromDB(dataToRetreive, database, collection).catch(
    (error) => {
      expect(error).toBeInstanceOf(UserDoesNotExistError);
    }
  );
});
//
test("test upload data to database -> Should not pass", async () => {
  const dataToRetreive = { username: "TestUser" };
  const database = "users";
  const collection = "login-details";
  return uploadDataToDB(dataToRetreive, database, collection).catch((error) => {
    expect(error).toBeInstanceOf(UsernameExistsError);
  });
});
