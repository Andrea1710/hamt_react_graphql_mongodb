const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  gender: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    required: true
  },
  planExpiration: {
    type: String,
    required: true
  },
  createdClasses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Class"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
