const crypto = require("crypto");
const { type } = require("os");
const utilities = {};

// parce json to object
utilities.parceJSON = (jsonString) => {
  let output = {};

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

// hash string
utilities.hash = (str) => {
  if (str) {
    let hash = crypto
      .createHmac("sha256", "shjfhsjkdfhsdjkfhdj")
      .update(str)
      .digest("hex");

    return hash;
  }

  return false;
};

module.exports = utilities;
