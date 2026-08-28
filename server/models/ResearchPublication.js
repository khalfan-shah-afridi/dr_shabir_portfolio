const mongoose = require("mongoose");

// =====================================================
// RESEARCH PUBLICATION SCHEMA
// =====================================================

const researchPublicationSchema = new mongoose.Schema(
  {
    // ===================================================
    // BASIC PUBLICATION INFORMATION
    // ===================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    authors: {
      type: String,
      trim: true,
      default: "",
    },

    journal: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // BIBLIOGRAPHIC INFORMATION
    // ===================================================

    volume: {
      type: String,
      trim: true,
      default: "",
    },

    issue: {
      type: String,
      trim: true,
      default: "",
    },

    pages: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // PUBLICATION DATE
    // ===================================================

    publicationDate: {
      type: Date,
      default: null,
    },

    // ===================================================
    // DOI
    // ===================================================

    doi: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // KEYWORDS
    // ===================================================

    keywords: {
      type: [String],
      default: [],
    },

    // ===================================================
    // ABSTRACT
    // ===================================================

    abstract: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // CITATION
    // ===================================================

    citation: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // EXTERNAL PAPER URL
    // ===================================================

    paperUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // UPLOADED PDF
    // ===================================================

    pdfUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // PUBLIC VISIBILITY
    // ===================================================

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

const ResearchPublication =
  mongoose.model(
    "ResearchPublication",
    researchPublicationSchema
  );

module.exports = ResearchPublication;