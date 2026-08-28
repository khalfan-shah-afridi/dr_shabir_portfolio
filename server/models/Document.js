const mongoose = require("mongoose");

const DOCUMENT_TYPES = [
  "10th / Matric",
  "12th / Intermediate",
  "B.Ed.",
  "BS",
  "Master",
  "MPhil",
  "PhD",
  "Postdoc",
  "CNIC",
  "Passport",
  "Other",
];

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    documentType: { type: String, enum: DOCUMENT_TYPES, required: true },
    category: { type: String, default: "Academic", trim: true },
    description: { type: String, default: "", trim: true },
    holderName: { type: String, default: "", trim: true },
    institution: { type: String, default: "", trim: true },
    issueDate: { type: Date, default: null },
    documentNumber: { type: String, default: "", trim: true },
    fileName: { type: String, default: "" },
    fileType: { type: String, default: "application/pdf" },
    fileSize: { type: Number, default: 0 },
    storageName: { type: String, default: "" },
    uploadDate: { type: Date, default: Date.now },
    visible: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "documents" }
);

documentSchema.index({ documentType: 1, visible: 1 });
documentSchema.index({ title: "text", description: "text", institution: "text" });

documentSchema.statics.DOCUMENT_TYPES = DOCUMENT_TYPES;
module.exports = mongoose.model("Document", documentSchema);
