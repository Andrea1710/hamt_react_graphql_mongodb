const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../../models/user");

module.exports = {
  createUser: async args => {
    const errors = [];
    if (!validator.isEmail(args.userInput.email)) {
      errors.push({ message: "Email is invalid" });
    }
    if (
      validator.isEmpty(args.userInput.password) ||
      !validator.isLength(args.userInput.password, { min: 5 })
    ) {
      errors.push({
        message: "Password too short (It should be at least of 5 characters"
      });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      throw error;
    }

    try {
      const existingUser = await User.findOne({
        email: args.userInput.email
      });
      if (existingUser) {
        throw new Error("An User with this email exists already");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        name: args.userInput.name,
        email: args.userInput.email,
        password: hashedPassword,
        date: new Date(args.userInput.date),
        gender: args.userInput.gender,
        plan: args.userInput.plan
      });

      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  createUserAdmin: async args => {
    const errors = [];
    if (!validator.isEmail(args.adminInput.email)) {
      errors.push({ message: "Email is invalid" });
    }
    if (
      validator.isEmpty(args.adminInput.password) ||
      !validator.isLength(args.adminInput.password, { min: 5 })
    ) {
      errors.push({
        message: "Password too short (It should be at least of 5 characters"
      });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      throw error;
    }

    try {
      const existingUser = await User.findOne({
        email: args.adminInput.email
      });
      if (existingUser) {
        throw new Error("An User with this email exists already");
      }
      const hashedPassword = await bcrypt.hash(args.adminInput.password, 12);

      const user = new User({
        name: args.adminInput.name,
        email: args.adminInput.email,
        password: hashedPassword,
        date: new Date(args.adminInput.date),
        gender: args.adminInput.gender,
        plan: args.adminInput.plan,
        planExpiration: args.adminInput.planExpiration
      });

      const result = await user.save();

      console.log(result);

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User does not exist");
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      {
        expiresIn: "1h"
      }
    );

    return {
      username: user.name,
      email: user.email,
      plan: user.plan,
      planExpiration: user.planExpiration,
      userId: user.id,
      token: token,
      tokenExpiration: 1
    };
  },

  cancelUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    try {
      const user = await User.findById(args.userId);
      if (!user) {
        throw new Error("User not found");
      }

      await User.deleteOne({ _id: args.userId });

      return user;
    } catch (err) {
      throw err;
    }
  }
};
