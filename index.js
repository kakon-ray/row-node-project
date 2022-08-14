const http = require("http");
const { StringDecoder } = require("string_decoder");
const url = require("url");
const { handleRequestRes } = require("./helpers/handleReqRes");
const data = require("./lib/data");

const app = {};

// //data write to file
// data.create(
//   "test",
//   "newFile",
//   { name: "Bangladesh", language: "Bangla" },
//   (error) => {
//     console.log("errror was", error);
//   }
// );

// // data read to file
// data.read("test", "newFile", (error, data) => {
//   if (!error) {
//     console.log(data);
//   } else {
//     console.log(error);
//   }
// });

// data.update(
//   "test",
//   "newFile",
//   { name: "Bangladesh", language: "Bangla, English and Hindi" },
//   (error) => {
//     console.log("errror was", error);
//   }
// );

// data.delete("test", "newFile", (error) => {
//   if (!error) {
//     console.log("Successfully Delete");
//   } else {
//     console.log(error);
//   }
// });

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
