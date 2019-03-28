const authResolver = require("./auth");
const classesResolver = require("./classes");
const joiningResolver = require("./joining");
const usersResolver = require("./users");

const rootResolver = {
  ...authResolver,
  ...classesResolver,
  ...joiningResolver,
  ...usersResolver
};

module.exports = rootResolver;
