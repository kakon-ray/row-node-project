// dependencies

const url = require("url");
const http = require("http");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const { notFoundHandler } = require("../handler/routehandler/notFoundHandler");
const { parceJSON } = require("../helpers/utilities");
// module scafholders
const handler = {};

handler.handleRequestRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headerObject = req.headers;

  const requesPropartice = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headerObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });
  req.on("end", (buffer) => {
    realData += decoder.end();

    requesPropartice.body = parceJSON(realData);

    chosenHandler(requesPropartice, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : 500;

      const payloadString = JSON.stringify(payload);
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
