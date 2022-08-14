const handler = {};

handler.notFoundHandler = (requesPropartice, callback) => {
  console.log(requesPropartice);

  callback(200, {
    message: "Your request url is not found",
  });
};

module.exports = handler;
