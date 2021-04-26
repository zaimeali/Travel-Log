const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const requiredString = {
  type: String,
  required: true,
};

const requiredNumber = {
  type: Number,
  required: true,
};

const logEntrySchema = Schema(
  {
    title: requiredString,
    description: requiredString,
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    comments: String,
    image: String,
    // image: {
    //   data: Buffer,
    //   contentType: String,
    // },
    latitude: {
      ...requiredNumber,
      min: -90,
      max: 90,
    },
    longitude: {
      ...requiredNumber,
      min: -180,
      max: 180,
    },
    visitDate: {
      required: true,
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("LogEntry", logEntrySchema);
