// Model
const LogEntry = require("../models/LogEntry");

// Methods
exports.checkRoute = (req, res) => {
  res.json({
    message: "🌎",
  });
};

exports.createLog = async (req, res, next) => {
  try {
    // console.log(req.body);
    const logEntry = new LogEntry(req.body);
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
};

exports.getAllLog = async (req, res, next) => {
  try {
    const logs = await LogEntry.find();
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
