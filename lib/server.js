const http = require("http");
const { StringDecoder } = require("string_decoder");
const url = require("url");
const { handleRequestRes } = require("../helpers/handleReqRes");
const data = require("../lib/data");

const server = {};

server.config = {
  port: 5000,
};

server.creatServer = () => {
  const createServerVariable = http.createServer(server.handleRequest);

  createServerVariable.listen(server.config.port, () => {
    console.log(`Lisining to port ${server.config.port}`);
  });
};

server.handleRequest = handleRequestRes;

server.init = () => {
  server.creatServer();
};

module.exports = server;
