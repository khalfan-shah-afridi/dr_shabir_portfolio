const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const directory = path.join(__dirname, "..", "uploads", "documents");
if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, directory),
  filename: (_req, file, cb) => {
    const safe = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 80);
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}-${safe}.pdf`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === "application/pdf" && ext === ".pdf") return cb(null, true);
  cb(new Error("Only PDF files are allowed."));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } });
module.exports.directory = directory;
