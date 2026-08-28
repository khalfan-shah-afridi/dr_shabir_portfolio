const express = require("express");

const {
  getConferences,
  getPublicConferences,
  createConference,
  updateConference,
  deleteConference,
  toggleConferenceVisibility,
} = require("../controllers/conferenceController");

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

router.get(
  "/public",
  getPublicConferences
);

// ==========================================
// ADMIN
// ==========================================

router.get(
  "/",
  protect,
  getConferences
);

router.post(
  "/",
  protect,
  createConference
);

router.put(
  "/:id",
  protect,
  updateConference
);

router.delete(
  "/:id",
  protect,
  deleteConference
);

router.patch(
  "/:id/toggle-visibility",
  protect,
  toggleConferenceVisibility
);

module.exports = router;