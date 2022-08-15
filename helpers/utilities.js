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

// token conventing
utilities.convertToRandomStringToken = (strLength) => {
  let length = strLength;

  length = typeof strLength === "number" && length > 0 ? strLength : false;

  if (length) {
    return Math.random().toString(strLength).substr(2);
  } else {
    return false;
  }
};

module.exports = utilities;
