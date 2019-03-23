const authResolver = require("./auth");
const classesResolver = require("./classes");
const joiningResolver = require("./joining");

const rootResolver = {
  ...authResolver,
  ...classesResolver,
  ...joiningResolver
};

module.exports = rootResolver;
