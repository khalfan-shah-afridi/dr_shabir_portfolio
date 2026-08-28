const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  level: { type: String, required: true, trim: true }, degree: { type: String, required: true, trim: true },
  field: { type: String, default: "", trim: true }, institution: { type: String, default: "", trim: true },
  startYear: { type: Number, default: null }, endYear: { type: Number, default: null }, description: { type: String, default: "" },
  certificate: { type: String, default: "" }, visible: { type: Boolean, default: true }, order: { type: Number, default: 0 }
}, { timestamps: true, collection: "education" });
module.exports = mongoose.model("Education", schema);
