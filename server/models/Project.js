const mongoose = require("mongoose");

// ==========================================
// PROJECT SCHEMA
// ==========================================
// NOTE: image / liveUrl / documentationUrl were removed per requirements.
// projectId + grants were added. Old documents that still have the
// removed fields stored in MongoDB will NOT crash the app - Mongoose
// simply ignores fields that are not declared in the schema when the
// document is read back through this model.
const schema = new mongoose.Schema(
  {
    projectId: { type: String, trim: true, unique: true, sparse: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    grants: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    startDate: { type: String, default: "" },
    completionDate: { type: String, default: "" },
    status: { type: String, default: "Completed" },
    visible: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "projects" }
);

// ==========================================
// AUTO-GENERATE PROJECT ID (e.g. PRJ-001)
// ==========================================
schema.pre("validate", async function (next) {
  if (this.projectId && this.projectId.trim()) {
    this.projectId = this.projectId.trim();
    return next();
  }

  try {
    const Project = mongoose.model("Project");
    const count = await Project.countDocuments();
    this.projectId = `PRJ-${String(count + 1).padStart(3, "0")}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Project", schema);
