const data = require("../../lib/data");
const {
  hash,
  parceJSON,
  convertToRandomStringToken,
} = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { user } = require("../../routes");
const handler = {};

handler.checkHandler = (requesPropartice, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requesPropartice.method) > -1) {
    handler._check[requesPropartice.method](requesPropartice, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

handler._check.post = (requesPropartice, callback) => {
  const protocol =
    typeof requesPropartice.body.protocol === "string" &&
    ["http", "https"].indexOf(requesPropartice.body.protocol) > -1
      ? requesPropartice.body.protocol
      : false;
  const url =
    typeof requesPropartice.body.url === "string" &&
    requesPropartice.body.url.trim().length > 0
      ? requesPropartice.body.url
      : false;

  const method =
    typeof requesPropartice.body.method === "string" &&
    ["GET", "PUT", "PUSH", "DELETE"].indexOf(requesPropartice.body.method) > -1
      ? requesPropartice.body.method
      : false;

  const successcode =
    typeof requesPropartice.body.successcode === "object" &&
    requesPropartice.body.successcode instanceof Array
      ? requesPropartice.body.successcode
      : false;
  const timeoutSecond =
    typeof requesPropartice.body.timeoutSecond === "number" &&
    requesPropartice.body.timeoutSecond % 1 === 0 &&
    requesPropartice.body.timeoutSecond >= 1 &&
    requesPropartice.body.timeoutSecond <= 5
      ? requesPropartice.body.timeoutSecond
      : false;

  if (protocol && url && method && successcode && timeoutSecond) {
    const token =
      typeof requesPropartice.headerObject.token === "string"
        ? requesPropartice.headerObject.token
        : false;

    data.read("token", token, (error, tokenData) => {
      if (!error && tokenData) {
        const userMobileNumber = parceJSON(tokenData).mobileNumber;
        data.read("users", userMobileNumber, (error2, userData) => {
          if (!error2 && userData) {
            tokenHandler._token.varify(
              token,
              userMobileNumber,
              (tokenIsValid) => {
                if (tokenIsValid) {
                  const userObejct = parceJSON(userData);
                  const userChecks =
                    typeof userObejct.checks === "object" &&
                    userObejct.checks instanceof Array
                      ? userObejct.checks
                      : [];

                  if (userChecks.length < 5) {
                    let checkId = convertToRandomStringToken(20);
                    checkObject = {
                      id: checkId,
                      mobileNumber: userMobileNumber,
                      protocol: protocol,
                      url: url,
                      method: method,
                      successcode: successcode,
                      timeoutSecond: timeoutSecond,
                    };
                    data.create("checks", checkId, checkObject, (error3) => {
                      if (!error3) {
                        userObejct.checks = userChecks;
                        userObejct.checks.push(checkId);

                        data.update(
                          "users",
                          userMobileNumber,
                          userObejct,
                          (error4) => {
                            if (!error4) {
                              callback(200, checkObject);
                            } else {
                              callback(500, {
                                error:
                                  "Thare was a problem in the serverside 1",
                              });
                            }
                          }
                        );
                      } else {
                        callback(500, {
                          error: "Thare was a problem in the serverside 2",
                        });
                      }
                    });
                  } else {
                    callback(400, {
                      error: "User Has already max check length",
                    });
                  }
                } else {
                  callback(400, {
                    error: "Authentication Problem",
                  });
                }
              }
            );
          } else {
            callback(400, {
              error: "User Not Found",
            });
          }
        });
      } else {
        callback(400, {
          error: "Authentication Problem",
        });
      }
    });
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};

handler._check.get = (requesPropartice, callback) => {
  const id =
    typeof requesPropartice.queryStringObject.id === "string" &&
    requesPropartice.queryStringObject.id.trim().length === 20
      ? requesPropartice.queryStringObject.id
      : false;

  if (id) {
    data.read("checks", id, (error, checkData) => {
      if (!error && checkData) {
        const token =
          typeof requesPropartice.headerObject.token === "string" &&
          requesPropartice.headerObject.token.trim().length === 20
            ? requesPropartice.headerObject.token
            : false;

        const userMobileNumber = parceJSON(checkData).mobileNumber;
        tokenHandler._token.varify(token, userMobileNumber, (tokenIsValid) => {
          if (tokenIsValid) {
            callback(200, parceJSON(checkData));
          } else {
            callback(500, {
              error: "Authentication Faild",
            });
          }
        });
      } else {
        callback(500, {
          error: "Can not find data",
        });
      }
    });
  } else {
    callback(500, {
      error: "Thare was a problem in a Request",
    });
  }
};

handler._check.put = (requesPropartice, callback) => {
  const id =
    typeof requesPropartice.body.id === "string" &&
    requesPropartice.body.id.trim().length === 20
      ? requesPropartice.body.id
      : false;

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requesPropartice.headerObject.token === "string" &&
          requesPropartice.headerObject.token.trim().length === 20
            ? requesPropartice.headerObject.token
            : false;

        const checkDataToObejct = parceJSON(checkData);

        const userMobileNumber = checkDataToObejct.mobileNumber;
        tokenHandler._token.varify(token, userMobileNumber, (tokenIsValid) => {
          if (tokenIsValid) {
            if (requesPropartice.body.protocol) {
              checkDataToObejct.protocol = requesPropartice.body.protocol;
            }
            if (requesPropartice.body.url) {
              checkDataToObejct.url = requesPropartice.body.url;
            }
            if (requesPropartice.body.method) {
              checkDataToObejct.method = requesPropartice.body.method;
            }
            if (requesPropartice.body.successcode) {
              checkDataToObejct.successcode = requesPropartice.body.successcode;
            }
            if (requesPropartice.body.timeoutSecond) {
              checkDataToObejct.timeoutSecond =
                requesPropartice.body.timeoutSecond;
            }

            data.update("checks", id, checkDataToObejct, (err2) => {
              if (!err2) {
                callback(200, { message: "Token is successfully update" });
              } else {
                callback(400, { error: "Thare was a problem" });
              }
            });
          }
        });
      }
    });
  }
};

handler._check.delete = (requesPropartice, callback) => {
  const id =
    typeof requesPropartice.queryStringObject.id === "string" &&
    requesPropartice.queryStringObject.id.trim().length === 20
      ? requesPropartice.queryStringObject.id
      : false;

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requesPropartice.headerObject.token === "string" &&
          requesPropartice.headerObject.token.trim().length === 20
            ? requesPropartice.headerObject.token
            : false;

        const userMobileNumber = parceJSON(checkData).mobileNumber;

        tokenHandler._token.varify(token, userMobileNumber, (tokenIsValid) => {
          if (tokenIsValid) {
            data.delete("checks", id, (err2) => {
              if (!err2) {
                // callback(200, { message: "Update successfully Completed" });

                data.read("users", userMobileNumber, (err3, userData) => {
                  if (!err3 && userData) {
                    let userDataToObject = parceJSON(userData);
                    let userChecks = userDataToObject.checks;
                    userChecks = userChecks.filter((item) => item !== id);
                    userDataToObject.checks = userChecks;
                    data.update(
                      "users",
                      userMobileNumber,
                      userDataToObject,
                      (err4) => {
                        if (!err4) {
                          callback(500, { message: "All update successfully" });
                        } else {
                          callback(500, {
                            error: "User data not found Problem",
                          });
                        }
                      }
                    );
                  } else {
                    callback(500, { error: "User data not found Problem" });
                  }
                });
              } else {
                callback(500, { error: "Update Problem" });
              }
            });
          }
        });
      } else {
        callback(500, { error: "Thare was a problem in red check" });
      }
    });
  } else {
    callback(400, { error: "No query parameter found" });
  }
};

module.exports = handler;
