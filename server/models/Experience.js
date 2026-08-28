const mongoose = require("mongoose");

// ==========================================
// EXPERIENCE SCHEMA
// ==========================================
const schema = new mongoose.Schema(
  {
    position: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    department: { type: String, default: "" },
    category: { type: String, enum: ["Teaching","Administration","Focal Person","Project Director","General"], default: "General" },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    visible: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "experience" }
);

// If marked as "current", always force endDate to null so the
// public portfolio / CV correctly render "Present".
schema.pre("save", function (next) {
  if (this.current) this.endDate = null;
  next();
});

schema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  if (update.current === true) update.endDate = null;
  this.setUpdate(update);
  next();
});

module.exports = mongoose.model("Experience", schema);
