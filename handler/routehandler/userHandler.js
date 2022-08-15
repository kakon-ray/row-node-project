const data = require("../../lib/data");
const { hash, parceJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { user } = require("../../routes");
const handler = {};

handler.userHandler = (requesPropartice, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requesPropartice.method) > -1) {
    handler._user[requesPropartice.method](requesPropartice, callback);
  } else {
    callback(405);
  }
};

handler._user = {};

handler._user.post = (requesPropartice, callback) => {
  const firstName =
    typeof requesPropartice.body.firstName === "string" &&
    requesPropartice.body.firstName.trim().length > 0
      ? requesPropartice.body.firstName
      : false;
  const lastName =
    typeof requesPropartice.body.lastName === "string" &&
    requesPropartice.body.lastName.trim().length > 0
      ? requesPropartice.body.lastName
      : false;
  const mobileNumber =
    typeof requesPropartice.body.mobileNumber === "string" &&
    requesPropartice.body.mobileNumber.trim().length === 11
      ? requesPropartice.body.mobileNumber
      : false;
  const passowrd =
    typeof requesPropartice.body.passowrd === "string" &&
    requesPropartice.body.passowrd.trim().length > 0
      ? requesPropartice.body.passowrd
      : false;
  if (firstName && lastName && mobileNumber && passowrd) {
    // make sure the user already does not already exist
    data.read("users", mobileNumber, (err, user) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          mobileNumber,
          password: hash(passowrd),
        };
        data.create("users", mobileNumber, userObject, (err2) => {
          if (!err2) {
            callback(200, { message: "user was create successfully" });
          } else {
            callback(500, {
              error: "could not create user",
            });
          }
        });
      } else {
        callback(500, {
          error: "There are a problem in serverside",
        });
      }
    });
  } else {
    callback(450, {
      error: "Your request have error",
    });
  }
};

handler._user.get = (requesPropartice, callback) => {
  const mobileNumber =
    typeof requesPropartice.queryStringObject.mobileNumber === "string" &&
    requesPropartice.queryStringObject.mobileNumber.trim().length === 11
      ? requesPropartice.queryStringObject.mobileNumber
      : false;

  console.log(mobileNumber);

  if (mobileNumber) {
    // varify token
    const token =
      typeof requesPropartice.headerObject.token === "string"
        ? requesPropartice.headerObject.token
        : false;

    tokenHandler._token.varify(token, mobileNumber, (tokenID) => {
      if (tokenID) {
        data.read("users", mobileNumber, (err, u) => {
          const user = { ...parceJSON(u) };
          console.log(u);
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, {
              error: "request user was not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authnticated Faild",
        });
      }
    });
  } else {
    callback(404, {
      error: "request user  not found",
    });
  }
};

handler._user.put = (requesPropartice, callback) => {
  const mobileNumber =
    typeof requesPropartice.body.mobileNumber === "string" &&
    requesPropartice.body.mobileNumber.trim().length === 11
      ? requesPropartice.body.mobileNumber
      : false;

  const firstName =
    typeof requesPropartice.body.firstName === "string" &&
    requesPropartice.body.firstName.trim().length > 0
      ? requesPropartice.body.firstName
      : false;
  const lastName =
    typeof requesPropartice.body.lastName === "string" &&
    requesPropartice.body.lastName.trim().length > 0
      ? requesPropartice.body.lastName
      : false;

  const passowrd =
    typeof requesPropartice.body.passowrd === "string" &&
    requesPropartice.body.passowrd.trim().length > 0
      ? requesPropartice.body.passowrd
      : false;

  if (mobileNumber) {
    if (firstName || lastName || passowrd) {
      // varify token
      const token =
        typeof requesPropartice.headerObject.token === "string"
          ? requesPropartice.headerObject.token
          : false;

      tokenHandler._token.varify(token, mobileNumber, (tokenID) => {
        if (tokenID) {
          data.read("users", mobileNumber, (err, u) => {
            const userData = { ...parceJSON(u) };
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (mobileNumber) {
                userData.mobileNumber = mobileNumber;
              }
              if (passowrd) {
                userData.passowrd = passowrd;
              }

              data.update("users", mobileNumber, userData, (err2) => {
                if (!err2) {
                  callback(200, { message: "User Update Success" });
                } else {
                  callback(400, { error: "Thare was a problem" });
                }
              });
            } else {
              callback(404, {
                error: "request user was not found",
              });
            }
          });
        } else {
          callback(403, {
            error: "Authnticated Faild",
          });
        }
      });
    } else {
      callback(400, {
        error: "Invalid Phone Number",
      });
    }

    // varify token end
  } else {
    callback(400, {
      error: "Invalid Phone Number",
    });
  }
};

handler._user.delete = (requesPropartice, callback) => {
  const mobileNumber =
    typeof requesPropartice.queryStringObject.mobileNumber === "string" &&
    requesPropartice.queryStringObject.mobileNumber.trim().length === 11
      ? requesPropartice.queryStringObject.mobileNumber
      : false;

  if (mobileNumber) {
    // varify token
    const token =
      typeof requesPropartice.headerObject.token === "string"
        ? requesPropartice.headerObject.token
        : false;

    tokenHandler._token.varify(token, mobileNumber, (tokenID) => {
      if (tokenID) {
        data.read("users", mobileNumber, (err, userData) => {
          if (!err) {
            data.delete("users", mobileNumber, (err2) => {
              if (!err2) {
                callback(200, { message: "file was deleted" });
              } else {
                callback(400, { error: "File was not delete" });
              }
            });
          } else {
            callback(400, { error: "Thare was a problem serverside" });
          }
        });
      } else {
        callback(403, {
          error: "Authnticated Faild",
        });
      }
    });

    // varification token end
  } else {
    callback(400, { error: "Thare was a problem" });
  }
};

module.exports = handler;
