const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const joiningSchema = new Schema(
  {
    mtclass: {
      type: Schema.Types.ObjectId,
      ref: "Class"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Joining", joiningSchema);
