const { sampleHandler } = require("./handler/routehandler/sampleHandler");
const { userHandler } = require("./handler/routehandler/userHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
