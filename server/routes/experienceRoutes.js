const express = require("express");
const protect = require("../middleware/authMiddleware");
const c = require("../controllers/experienceController");

const r = express.Router();

r.get("/public", c.getPublicExperiences);
r.get("/", protect, c.getExperiences);
r.get("/:id", protect, c.getExperienceById);
r.post("/", protect, c.createExperience);
r.put("/:id", protect, c.updateExperience);
r.delete("/:id", protect, c.deleteExperience);
r.patch("/:id/toggle", protect, c.toggleExperience);

module.exports = r;
