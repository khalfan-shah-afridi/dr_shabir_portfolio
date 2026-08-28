const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLER
// =====================================================

const {
  createSubmitPaper,
  getAllSubmitPapers,
  getSubmitPaperById,
  updateSubmitPaper,
  deleteSubmitPaper,
  submitPaper,
  unsubmitPaper,
  showSubmitPaper,
  hideSubmitPaper,
} = require("../controllers/submitPaperController");

// =====================================================
// MULTER
// =====================================================

const upload = require("../upload");

// =====================================================
// GET ALL SUBMITTED PAPERS
// GET /api/submit-papers
// =====================================================

router.get(
  "/",
  getAllSubmitPapers
);

// =====================================================
// GET SINGLE PAPER
// GET /api/submit-papers/:id
// =====================================================

router.get(
  "/:id",
  getSubmitPaperById
);

// =====================================================
// CREATE / SUBMIT NEW PAPER
// POST /api/submit-papers
// =====================================================

router.post(
  "/",
  upload.single("pdf"),
  createSubmitPaper
);

// =====================================================
// UPDATE PAPER
// PUT /api/submit-papers/:id
// =====================================================

router.put(
  "/:id",
  upload.single("pdf"),
  updateSubmitPaper
);

// =====================================================
// SUBMIT PAPER
// PATCH /api/submit-papers/:id/submit
// =====================================================

router.patch(
  "/:id/submit",
  submitPaper
);

// =====================================================
// UNSUBMIT PAPER
// PATCH /api/submit-papers/:id/unsubmit
// =====================================================

router.patch(
  "/:id/unsubmit",
  unsubmitPaper
);

// =====================================================
// SHOW PAPER
// PATCH /api/submit-papers/:id/show
// =====================================================

router.patch(
  "/:id/show",
  showSubmitPaper
);

// =====================================================
// HIDE PAPER
// PATCH /api/submit-papers/:id/hide
// =====================================================

router.patch(
  "/:id/hide",
  hideSubmitPaper
);

// =====================================================
// DELETE PAPER
// DELETE /api/submit-papers/:id
// =====================================================

router.delete(
  "/:id",
  deleteSubmitPaper
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;