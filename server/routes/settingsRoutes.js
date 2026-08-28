const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getSettings, updateSettings } = require("../controllers/settingsController");

const router = express.Router();

// Public - the public portfolio needs to know which modules are enabled
router.get("/", getSettings);

// Admin - the admin panel also reads settings using this same route
// (protect is intentionally NOT required for GET so the public site can read it)
router.put("/", protect, updateSettings);

module.exports = router;
