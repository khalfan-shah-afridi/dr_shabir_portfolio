const express = require("express");

const {
  createResearchPaperSubmission,
  getResearchPaperSubmissions,
  getResearchPaperSubmissionById,
  updateResearchPaperSubmission,
  updateResearchPaperStatus,
  publishResearchPaper,
  deleteResearchPaperSubmission,
} = require("../controllers/researchPaperSubmissionController");

const router = express.Router();

// =====================================================
// TEST ROUTE
// =====================================================
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Research Paper Routes are working",
  });
});

// =====================================================
// PUBLIC — SUBMIT RESEARCH PAPER
// =====================================================
router.post("/", createResearchPaperSubmission);

// =====================================================
// ADMIN — GET ALL SUBMISSIONS
// =====================================================
router.get("/", getResearchPaperSubmissions);

// =====================================================
// ADMIN — PUBLISH RESEARCH PAPER
// IMPORTANT: This must come BEFORE /:id
// =====================================================
router.patch("/:id/publish", publishResearchPaper);

// =====================================================
// ADMIN — UPDATE STATUS
// =====================================================
router.patch("/:id/status", updateResearchPaperStatus);

// =====================================================
// ADMIN — GET SINGLE SUBMISSION
// =====================================================
router.get("/:id", getResearchPaperSubmissionById);

// =====================================================
// ADMIN — UPDATE SUBMISSION
// =====================================================
router.put("/:id", updateResearchPaperSubmission);

// =====================================================
// ADMIN — DELETE SUBMISSION
// =====================================================
router.delete("/:id", deleteResearchPaperSubmission);

// =====================================================
// EXPORT
// =====================================================
module.exports = router;