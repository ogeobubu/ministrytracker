const mongoose = require("mongoose");

const ministrySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    evangelism: {
      type: Number,
    },
    saved: {
      type: Number,
    },
    filled: {
      type: Number,
    },
    healed: {
      type: Number,
    },
    discipleship: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Ministry = mongoose.model("Ministry", ministrySchema);

module.exports = Ministry;
