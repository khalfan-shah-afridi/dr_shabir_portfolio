const mongoose = require("mongoose");

const researchPaperSubmissionSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    affiliation: {
      type: String,
      trim: true,
      default: "",
    },

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

    researchArea: {
      type: String,
      trim: true,
      default: "",
    },

    abstract: {
      type: String,
      required: true,
      trim: true,
    },

    keywords: {
      type: String,
      trim: true,
      default: "",
    },

    paperFile: {
      type: String,
      default: "",
    },

    additionalNotes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "Accepted",
        "Rejected",
        "Published",
      ],
      default: "Pending",
    },

    adminNotes: {
      type: String,
      trim: true,
      default: "",
    },

    publicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResearchPublication",
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ResearchPaperSubmission",
  researchPaperSubmissionSchema,
  "Submitted / Unpublished Papers"
);