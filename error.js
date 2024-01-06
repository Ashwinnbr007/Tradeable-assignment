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
class CannotExpireRefferalError extends Error {
  constructor(message) {
    super(message);
    this.name = "CannotExpireRefferalError";
  }
}

module.exports = {
  UsernameExistsError,
  UserDoesNotExistError,
  RefferalDoesNotExistError,
  CannotExpireRefferalError,
};
