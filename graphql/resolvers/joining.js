const Class = require("../../models/class");
const Joining = require("../../models/joining");
const User = require("../../models/user");
const { transformJoining, transformClass } = require("./merge");

module.exports = {
  joinings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    try {
      if (req.userId === "5c9451446232f74543d6bc9c") {
        const joiningsAdmin = await Joining.find();
        return joiningsAdmin.map(joining => {
          return transformJoining(joining);
        });
      } else {
        const joiningsUser = await Joining.find({ user: req.userId });

        return joiningsUser.map(joining => {
          return transformJoining(joining);
        });
      }
    } catch (err) {
      throw err;
    }
  },

  joinClass: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const fetchedClass = await Class.findOne({ _id: args.classId });
    const joining = new Joining({
      user: req.userId,
      mtclass: fetchedClass
    });
    const result = await joining.save();
    return transformJoining(result);
  },

  joinCancel: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const joining = await Joining.findById(args.joiningId).populate(
        "mtclass"
      );
      const mtclass = transformClass(joining.mtclass);
      await Joining.deleteOne({ _id: args.joiningId });
      return mtclass;
    } catch (err) {
      throw err;
    }
  }
};
