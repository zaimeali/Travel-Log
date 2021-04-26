const { Router } = require("express");

// Methods
const {
  checkRoute,
  createLog,
  getAllLog,
} = require("../controllers/logController");

const router = Router();

// Routes
router.get("/check", checkRoute);

router.get("/", getAllLog);

router.post("/", createLog);

module.exports = router;
