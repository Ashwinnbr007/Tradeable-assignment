class UsernameExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "UsernameExistsError";
  }
}
class UserDoesNotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserDoesNotExistError";
  }
}

module.exports = { UsernameExistsError, UserDoesNotExistError };
