const mongoose = require("mongoose");

// ==========================================
// SITE SETTINGS (singleton document)
// ==========================================
// Controls whether an entire module is shown on the public portfolio.
// This is separate from per-record "visible" flags, which control
// individual items inside a module.
const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global",
      unique: true,
    },

    modules: {
      personalInformation: { type: Boolean, default: true },
      profile: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      awards: { type: Boolean, default: true },
      certificates: { type: Boolean, default: true },
      mission: { type: Boolean, default: true },
      vision: { type: Boolean, default: true },
      publications: { type: Boolean, default: true },
      conferences: { type: Boolean, default: true },
      references: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      researchResources: { type: Boolean, default: true },
      projectWins: { type: Boolean, default: true },
      supervision: { type: Boolean, default: true },
      reviewer: { type: Boolean, default: true },
      researchInterests: { type: Boolean, default: true },
      documents: { type: Boolean, default: false },
    },
  },
  { timestamps: true, collection: "settings" }
);

module.exports = mongoose.model("Settings", settingsSchema);
