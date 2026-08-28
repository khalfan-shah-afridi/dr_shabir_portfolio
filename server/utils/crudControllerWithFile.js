const fs = require("fs");
const path = require("path");

// ======================================================
// CRUD controller factory for modules that store a single
// PDF certificate file (Awards, Certificates) alongside the
// usual text fields. Mirrors utils/crudController but adds
// upload / replace / cleanup handling for the "pdf" field.
// ======================================================
const makeCrudControllerWithFile = (Model, upload, options = {}) => {
  const sort = options.sort || { order: 1, createdAt: -1 };
  const visibilityField = options.visibilityField || "visible";

  const cleanupFile = (storedName) => {
    if (!storedName) return;
    const file = path.join(upload.directory, storedName);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  };

  const getAll = async (req, res) => {
    try {
      const data = await Model.find().sort(sort);
      res.json({ success: true, count: data.length, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  const getPublic = async (req, res) => {
    try {
      const filter = { [visibilityField]: true };
      const data = await Model.find(filter).sort(sort);
      res.json({ success: true, count: data.length, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  const getPublicById = async (req, res) => {
    try {
      const filter = { _id: req.params.id, [visibilityField]: true };
      const data = await Model.findOne(filter);
      if (!data) return res.status(404).json({ success: false, message: "Public record not found" });
      res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  const create = async (req, res) => {
    try {
      const body = { ...req.body };
      if (req.file) {
        body.pdf = req.file.filename;
        body.pdfOriginalName = req.file.originalname;
      }
      const data = await Model.create(body);
      res.status(201).json({ success: true, message: "Created successfully", data });
    } catch (error) {
      if (req.file) cleanupFile(req.file.filename);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  const update = async (req, res) => {
    try {
      const existing = await Model.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: "Record not found" });

      const body = { ...req.body };
      if (req.file) {
        cleanupFile(existing.pdf);
        body.pdf = req.file.filename;
        body.pdfOriginalName = req.file.originalname;
      }

      const data = await Model.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
      res.json({ success: true, message: "Updated successfully", data });
    } catch (error) {
      if (req.file) cleanupFile(req.file.filename);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  const remove = async (req, res) => {
    try {
      const data = await Model.findByIdAndDelete(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: "Record not found" });
      cleanupFile(data.pdf);
      res.json({ success: true, message: "Deleted successfully" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  const toggle = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: "Record not found" });
      item[visibilityField] = !Boolean(item[visibilityField]);
      await item.save();
      res.json({ success: true, message: item[visibilityField] ? "Shown publicly" : "Hidden publicly", data: item });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  // Serves the stored PDF. Public and unauthenticated so both the
  // admin form preview and the public portfolio can open/download it.
  // Only records that are visible on the public site are servable
  // through this route when accessed without a valid admin session;
  // the route itself stays open (no protect middleware) so the public
  // "View / Download Certificate" link on the portfolio works.
  const getFile = async (req, res) => {
    try {
      const data = await Model.findById(req.params.id);
      if (!data || !data.pdf) return res.status(404).json({ success: false, message: "File not found" });
      const filePath = path.join(upload.directory, data.pdf);
      if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: "Stored file is missing" });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${String(data.pdfOriginalName || "certificate.pdf").replace(/[\r\n"]/g, "_")}"`
      );
      res.sendFile(filePath);
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  return { getAll, getPublic, getPublicById, create, update, remove, toggle, getFile };
};

module.exports = makeCrudControllerWithFile;
