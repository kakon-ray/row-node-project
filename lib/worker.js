const url = require("url");
const worker = {};
const data = require("./data");
const { parceJSON } = require("../helpers/utilities");
const { hostname } = require("os");
const http = require("http");
const https = require("https");
const { sendTwilioSms } = require("../helpers/notifications");
worker.getherALlChecks = () => {
  // get all the checks
  data.list("checks", (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((element) => {
        // read the chek data
        data.read("checks", element, (err2, checkData) => {
          if (!err2 && checkData) {
            // pass the data next process
            const allValidatorChecksDataToParch = parceJSON(checkData);
            worker.validatorCheckData(allValidatorChecksDataToParch);
          } else {
            console.log("Error:Reading one of the check data");
          }
        });
      });
    } else {
      console.log("Error Cound not find any checks");
    }
  });
};

worker.validatorCheckData = (getAllCheckData) => {
  if (getAllCheckData && getAllCheckData.id) {
    getAllCheckData.state =
      typeof getAllCheckData.state === "string" &&
      ["up", "down"].indexOf(getAllCheckData.state) > -1
        ? getAllCheckData.state
        : "down";

    getAllCheckData.lastChecked =
      typeof getAllCheckData.lastChecked === "number" &&
      getAllCheckData.lastChecked > 0
        ? getAllCheckData.lastChecked
        : false;

    worker.perFormCheck(getAllCheckData);
  } else {
    console.log("Error:Check was invalide or not formated");
  }
};

// perform check

worker.perFormCheck = (getAllCheckData) => {
  const checkOutCome = {
    error: false,
    responseCode: false,
  };

  let outComeSent = false;
  // host name and full url orginal data

  let parseUrl = url.parse(
    getAllCheckData.protocol + "://" + getAllCheckData.url,
    true
  );

  const hostName = parseUrl.hostname;
  const path = parseUrl.path;

  const requestDetails = {
    protocol: getAllCheckData.protocol + ":",
    hostname: hostName,
    method: getAllCheckData.method.toUpperCase(),
    path: path,
    timeout: getAllCheckData.timeoutSecond * 100,
  };

  const protocolToUse = getAllCheckData.protocol === "http" ? http : https;

  let req = protocolToUse.request(requestDetails, (res) => {
    const status = res.statusCode;

    checkOutCome.responseCode = status;
    if (!outComeSent) {
      worker.processCheckOutCome(getAllCheckData, checkOutCome);
      outComeSent = true;
    }
  });

  req.on("error", (e) => {
    const checkOutCome = {
      error: true,
      value: e,
    };

    if (!outComeSent) {
      worker.processCheckOutCome(getAllCheckData, checkOutCome);
      outComeSent = true;
    }
  });
  req.on("timeout", (e) => {
    const checkOutCome = {
      error: true,
      value: "timeout",
    };
    if (!outComeSent) {
      worker.processCheckOutCome(getAllCheckData, checkOutCome);
      outComeSent = true;
    }
  });

  req.end();
};

worker.processCheckOutCome = (getAllCheckData, checkOutCome) => {
  let state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    getAllCheckData.successcode.indexOf(checkOutCome.responseCode) > -1
      ? "up"
      : "down";

  let alertWanted =
    getAllCheckData.lastChecked && getAllCheckData.state !== state
      ? true
      : false;

  // update the check data

  let newCheckData = getAllCheckData;
  newCheckData.sta = state;
  newCheckData.lastChecked = Date.now();

  // update the database

  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        // send the checkdata next
        worker.alertToStatusChange(newCheckData);
      } else {
        console.log("Alert is not needed ");
      }
    } else {
      console.log("Error: trying to save check save data ");
    }
  });
};

worker.alertToStatusChange = (newCheckData) => {
  const msg = `New check data for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  } : // ${newCheckData.url} is currently ${newCheckData.state}`;

  sendTwilioSms(newCheckData.mobileNumber, msg, (err) => {
    if (!err) {
      console.log(`user was alert to state change to sms ${msg}`);
    } else {
      console.log("Thare was a problem sms to send ");
    }
  });
};

worker.loop = () => {
  setInterval(() => {
    worker.getherALlChecks();
  }, 5000);
};
worker.init = () => {
  worker.getherALlChecks();

  worker.loop();
};

module.exports = worker;
