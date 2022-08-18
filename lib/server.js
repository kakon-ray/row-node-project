const http = require("http");
const { StringDecoder } = require("string_decoder");
const url = require("url");
const { handleRequestRes } = require("./helpers/handleReqRes");
const data = require("./lib/data");

const app = {};

app.config = {
  port: 5000,
};

app.creatServer = () => {
  const server = http.createServer(app.handleRequest);

  server.listen(app.config.port, () => {
    console.log(`Lisining to port ${app.config.port}`);
  });
};

app.handleRequest = handleRequestRes;

app.creatServer();
