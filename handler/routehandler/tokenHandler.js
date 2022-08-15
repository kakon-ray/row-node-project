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

handler._token.get = (requesPropartice, callback) => {
  // check the token id
  const id =
    typeof requesPropartice.queryStringObject.id === "string" &&
    requesPropartice.queryStringObject.id.trim().length === 20
      ? requesPropartice.queryStringObject.id
      : false;

  console.log(requesPropartice.queryStringObject.id);

  if (id) {
    // find the token id

    data.read("token", id, (err, t) => {
      const tokenData = { ...parceJSON(t) };

      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404, {
          error: "request token was not found",
        });
      }
    });
  } else {
    callback(404, {
      error: "request token  not found",
    });
  }
};

handler._token.put = (requesPropartice, callback) => {
  const id =
    typeof requesPropartice.body.tokenId === "string" &&
    requesPropartice.body.tokenId.trim().length === 20
      ? requesPropartice.body.tokenId
      : false;

  const extend =
    typeof requesPropartice.body.extend === "boolean" &&
    requesPropartice.body.extend === true
      ? true
      : false;

  console.log(id, extend);

  if (id && extend) {
    data.read("token", id, (err, t) => {
      const tokenData = { ...parceJSON(t) };

      if (tokenData.expires > Date.now()) {
        tokenData.expires = Date.now() * 60 * 60 * 1000;

        data.update("token", id, tokenData, (err2) => {
          if (!err2) {
            callback(200, { message: "Token is successfully update" });
          } else {
            callback(400, { error: "Thare was a problem" });
          }
        });
      } else {
        callback(404, {
          error: "Token Is expries",
        });
      }
    });
  } else {
    callback(400, { error: "Is not valid token id and extend " });
  }
};

handler._token.delete = (requesPropartice, callback) => {
  const id =
    typeof requesPropartice.queryStringObject.tokenId === "string" &&
    requesPropartice.queryStringObject.tokenId.trim().length === 20
      ? requesPropartice.queryStringObject.tokenId
      : false;

  console.log(requesPropartice.queryStringObject.tokenId);

  if (id) {
    data.read("token", id, (err, userData) => {
      if (!err) {
        data.delete("token", id, (err2) => {
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
    callback(400, { error: "Thare was a problem" });
  }
};

handler._token.varify = (id, mobileNumber, callback) => {
  data.read("token", id, (err, tokenData) => {
    const parseTokenData = parceJSON(tokenData);
    if (!err && tokenData) {
      if (
        parseTokenData.mobileNumber === mobileNumber &&
        parseTokenData.expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
