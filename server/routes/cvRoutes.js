const express = require("express");
const protect = require("../middleware/authMiddleware");
const c = require("../controllers/cvController");

const r = express.Router();

// CV data/generation is Admin-only: it can include private/unpublished
// records and is not meant to be reachable from the public site.
r.get("/settings", protect, c.getCVSettings);
r.put("/settings", protect, c.updateCVSettings);
r.get("/data", protect, c.getCVData);
r.get("/download", protect, c.downloadCV);

module.exports = r;
