const Class = require("../../models/class");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");
const { transformClass } = require("./merge");

module.exports = {
  classes: async () => {
    try {
      const classes = await Class.find();
      return classes.map(mtclass => {
        return transformClass(mtclass);
      });
    } catch (err) {
      throw err;
    }
  },
  createClass: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const mtclass = new Class({
      title: args.classInput.title,
      description: args.classInput.description,
      date: dateToString(args.classInput.date),
      time: args.classInput.time,
      creator: req.userId
    });
    let createdClass;
    try {
      const result = await mtclass.save();
      createdClass = transformClass(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdClasses.push(mtclass);
      await creator.save();

      return createdClass;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
