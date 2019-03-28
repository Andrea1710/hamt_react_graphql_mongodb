const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map(user => {
        return {
          ...user._doc,
          _id: user.id,
          date: dateToString(user._doc.date)
        };
      });
    } catch (err) {
      throw err;
    }
  }
};
