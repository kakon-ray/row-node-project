const { sampleHandler } = require("./handler/routehandler/sampleHandler");
const { userHandler } = require("./handler/routehandler/userHandler");
const { tokenHandler } = require("./handler/routehandler/tokenHandler");
const { checkHandler } = require("./handler/routehandler/checkHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
