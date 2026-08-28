const mongoose = require("mongoose");

const conferenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "International",
        "National",
        "Local",
        "Online",
      ],
      required: true,
    },

    organizer: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    role: {
      type: String,
      default: "",
      trim: true,
    },

    presentationTitle: {
      type: String,
      default: "",
      trim: true,
    },

    paperTitle: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    certificateUrl: {
      type: String,
      default: "",
      trim: true,
    },

    websiteUrl: {
      type: String,
      default: "",
      trim: true,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Conference",
  }
);

module.exports = mongoose.model(
  "Conference",
  conferenceSchema
);