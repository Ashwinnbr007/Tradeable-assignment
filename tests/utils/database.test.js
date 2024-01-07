const { retreiveDataFromDB } = require("../../utils/database");
const { UserDoesNotExistError } = require("../../error");

// Testing retreiveDataFromDB
test("test data retreival from database -> Should pass", async () => {
  const dataToRetreive = { username: "TestUser" };
  const database = "users";
  const collection = "login-details";
  const data = await retreiveDataFromDB(dataToRetreive, database, collection);
  return expect(data).toBeTruthy();
});

test("test data retreival from database -> Should not pass", async () => {
  const randomJibberishUsername = "dibdovinwovn";
  const dataToRetreive = { username: randomJibberishUsername };
  const database = "users";
  const collection = "login-details";
  return retreiveDataFromDB(dataToRetreive, database, collection).catch(
    (error) => {
      expect(error).toBeInstanceOf(UserDoesNotExistError);
    }
  );
});
