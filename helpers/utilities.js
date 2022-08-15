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

  length = typeof strLength === "number" && length > 0 ? length : false;

  if (length) {
    //edit the token allowed characters
    var a =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
        ""
      );
    var b = [];
    for (var i = 0; i < length; i++) {
      var j = (Math.random() * (a.length - 1)).toFixed(0);
      b[i] = a[j];
    }
    return b.join("");
  } else {
    return false;
  }
};

module.exports = utilities;
