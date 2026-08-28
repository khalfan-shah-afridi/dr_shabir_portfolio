const fs = require("fs");
const path = require("path");
const Document = require("../models/Document");
const upload = require("../middleware/documentUpload");

const cleanup = (storageName) => {
  if (!storageName) return;
  const file = path.join(upload.directory, storageName);
  if (fs.existsSync(file)) fs.unlinkSync(file);
};

const listDocuments = async (req, res) => {
  try {
    const data = await Document.find().sort({ order: 1, uploadDate: -1 }).lean();
    res.json({ success: true, data, documentTypes: Document.DOCUMENT_TYPES });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const createDocument = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!Document.DOCUMENT_TYPES.includes(body.documentType)) return res.status(400).json({ success: false, message: "Invalid document type." });
    if (!body.title?.trim()) return res.status(400).json({ success: false, message: "Title is required." });
    if (req.file) {
      body.fileName = req.file.originalname;
      body.fileType = req.file.mimetype;
      body.fileSize = req.file.size;
      body.storageName = req.file.filename;
      body.uploadDate = new Date();
    }
    const doc = await Document.create(body);
    res.status(201).json({ success: true, data: doc });
  } catch (error) { if (req.file) cleanup(req.file.filename); res.status(400).json({ success: false, message: error.message }); }
};

const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found." });
    const body = { ...req.body };
    if (body.documentType && !Document.DOCUMENT_TYPES.includes(body.documentType)) return res.status(400).json({ success: false, message: "Invalid document type." });
    Object.keys(body).forEach(k => { if (!["_id", "storageName", "fileName", "fileType", "fileSize", "uploadDate"].includes(k)) doc[k] = body[k]; });
    if (req.file) {
      cleanup(doc.storageName);
      doc.fileName = req.file.originalname;
      doc.fileType = req.file.mimetype;
      doc.fileSize = req.file.size;
      doc.storageName = req.file.filename;
      doc.uploadDate = new Date();
    }
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (error) { if (req.file) cleanup(req.file.filename); res.status(400).json({ success: false, message: error.message }); }
};

const toggleDocument = async (req, res) => {
  try { const doc = await Document.findById(req.params.id); if (!doc) return res.status(404).json({ success:false, message:"Document not found." }); doc.visible = !doc.visible; await doc.save(); res.json({ success:true, data:doc }); }
  catch (error) { res.status(500).json({ success:false, message:error.message }); }
};

const deleteDocument = async (req, res) => {
  try { const doc = await Document.findByIdAndDelete(req.params.id); if (!doc) return res.status(404).json({success:false,message:"Document not found."}); cleanup(doc.storageName); res.json({success:true,message:"Document deleted."}); }
  catch (error) { res.status(500).json({success:false,message:error.message}); }
};

const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || !doc.storageName) return res.status(404).json({ success:false, message:"File not found." });
    const file = path.join(upload.directory, doc.storageName);
    if (!fs.existsSync(file)) return res.status(404).json({ success:false, message:"Stored file is missing." });
    res.setHeader("Content-Type", doc.fileType || "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${String(doc.fileName || "document.pdf").replace(/[\r\n"]/g, "_")}"`);
    res.sendFile(file);
  } catch (error) { res.status(500).json({success:false,message:error.message}); }
};

module.exports = { listDocuments, createDocument, updateDocument, toggleDocument, deleteDocument, downloadDocument };
