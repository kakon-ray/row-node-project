const handler = {};

handler.sampleHandler = (requesPropartice, callback) => {
  console.log(requesPropartice);

  callback(200, {
    message: "This is a sample url",
  });
};

module.exports = handler;
