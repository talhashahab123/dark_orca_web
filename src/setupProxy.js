const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  //1st url for proxy
  app.use(proxy("/api", { target: "192.168.100.4:8080" }));
};
