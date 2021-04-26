// Packages
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

// Models
const LogEntry = require("./models/LogEntry");

// Routes
const logRoutes = require("./api/logRoutes");

// Custom Middleware
const { notFound, errorHandler } = require("./middlewares");

// Initialize App
app = express();

// DB Connection
mongoose
  .connect(process.env.DB_URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is Connected"))
  .catch((err) => console.log(err.message));

// Middlewares
app.use(morgan("common")); // logger
app.use(helmet()); // for securing by adding and removing headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // for just accepting request from this ip/url
  })
);
app.use(express.json()); // for json req (body-parser)

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.use("/api/logs", logRoutes);

// Not Found Middleware
app.use(notFound);

// Error Handling Middleware
app.use(errorHandler);

// Listen
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
