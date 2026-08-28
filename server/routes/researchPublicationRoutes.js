const express = require("express");

const {
  getResearchPublications,
  getPublicResearchPublications,
  getResearchPublicationById,
  createResearchPublication,
  updateResearchPublication,
  deleteResearchPublication,
  updateResearchPublicationVisibility,
} = require("../controllers/researchPublicationController");

const researchPublicationUpload = require(
  "../middleware/researchPublicationUpload"
);

const router = express.Router();

router.get("/public", getPublicResearchPublications);

// =====================================================
// GET ALL RESEARCH PUBLICATIONS
// =====================================================

router.get(
  "/",
  getResearchPublications
);

// =====================================================
// GET SINGLE RESEARCH PUBLICATION
// =====================================================

router.get(
  "/:id",
  getResearchPublicationById
);

// =====================================================
// CREATE RESEARCH PUBLICATION
// =====================================================

router.post(
  "/",
  researchPublicationUpload.single("pdf"),
  createResearchPublication
);

// =====================================================
// UPDATE RESEARCH PUBLICATION
// =====================================================

router.put(
  "/:id",
  researchPublicationUpload.single("pdf"),
  updateResearchPublication
);

// =====================================================
// DELETE RESEARCH PUBLICATION
// =====================================================

router.delete(
  "/:id",
  deleteResearchPublication
);

// =====================================================
// UPDATE VISIBILITY
// =====================================================

router.patch(
  "/:id/visibility",
  updateResearchPublicationVisibility
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;