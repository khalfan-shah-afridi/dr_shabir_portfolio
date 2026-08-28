const mongoose = require("mongoose");

// =====================================================
// SUBMIT PAPER SCHEMA
// =====================================================

const submitPaperSchema = new mongoose.Schema(
  {
    // =================================================
    // PAPER TITLE
    // =================================================

    paperTitle: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // JOURNAL NAME
    // =================================================

    journalName: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // AUTHOR NAME
    // =================================================

    authorName: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // SUBMIT DATE
    // =================================================

    submitDate: {
      type: Date,
      required: true,
    },

    // =================================================
    // PAPER STATUS
    // =================================================

    status: {
      type: String,
      enum: [
        "Under Review",
        "Accepted",
        "Rejected",
        "Accepted with Changes",
      ],
      default: "Under Review",
    },

    // =================================================
    // PDF INFORMATION
    // =================================================

    pdf: {
      fileName: {
        type: String,
        default: "",
      },

      filePath: {
        type: String,
        default: "",
      },

      originalName: {
        type: String,
        default: "",
      },
    },

    // =================================================
    // SUBMISSION STATE
    // =================================================

    isSubmitted: {
      type: Boolean,
      default: true,
    },

    // =================================================
    // VISIBILITY
    // =================================================

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// MODEL
// =====================================================

const SubmitPaper = mongoose.model(
  "SubmitPaper",
  submitPaperSchema
);

module.exports = SubmitPaper;