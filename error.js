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
class RefferalDoesNotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = "RefferalDoesNotExistError";
  }
}

module.exports = {
  UsernameExistsError,
  UserDoesNotExistError,
  RefferalDoesNotExistError,
};
