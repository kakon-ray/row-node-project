const { sampleHandler } = require("./handler/routehandler/sampleHandler");
const { userHandler } = require("./handler/routehandler/userHandler");
const { tokenHandler } = require("./handler/routehandler/tokenHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
