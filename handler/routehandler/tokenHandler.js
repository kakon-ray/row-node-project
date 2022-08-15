const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const {
  parceJSON,
  convertToRandomStringToken,
} = require("../../helpers/utilities");
const handler = {};

handler.tokenHandler = (requesPropartice, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requesPropartice.method) > -1) {
    handler._token[requesPropartice.method](requesPropartice, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requesPropartice, callback) => {
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

  if (mobileNumber && passowrd) {
    data.read("users", mobileNumber, (error, u) => {
      if (!error) {
        const userData = parceJSON(u);
        const hashDbUserPass = hash(passowrd);
        if (hashDbUserPass === userData.password) {
          const tokenId = convertToRandomStringToken(20);
          const expires = Date.now() * 60 * 60 * 1000;

          const tokenObject = { mobileNumber, tokenId, expires };

          //   save token database

          data.create("token", tokenId, tokenObject, (error2) => {
            if (!error2) {
              callback(200, tokenObject);
            } else {
              callback(500, { error: "Thare was a Problem in serverside" });
            }
          });
        } else {
          callback(400, { error: "Password Is not match" });
        }
      } else {
        callback(400, { error: "cannot red data" });
      }
    });
  } else {
    callback(400, {
      error: "You have a Problem in a Request",
    });
  }
};

handler._token.get = (requesPropartice, callback) => {};

handler._token.put = (requesPropartice, callback) => {};

handler._token.delete = (requesPropartice, callback) => {};

module.exports = handler;
