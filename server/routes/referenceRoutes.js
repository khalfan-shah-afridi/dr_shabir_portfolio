const express = require("express");

const {
  getReferences,
  getPublicReferences,
  createReference,
  updateReference,
  deleteReference,
  toggleReferenceVisibility,
} = require("../controllers/referenceController");

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

router.get(
  "/public",
  getPublicReferences
);

// ==========================================
// ADMIN
// ==========================================

router.get(
  "/",
  protect,
  getReferences
);

router.post(
  "/",
  protect,
  createReference
);

router.put(
  "/:id",
  protect,
  updateReference
);

router.delete(
  "/:id",
  protect,
  deleteReference
);

router.patch(
  "/:id/toggle-visibility",
  protect,
  toggleReferenceVisibility
);

module.exports = router;