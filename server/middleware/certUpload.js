const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================================
// CERTIFICATE / AWARD PDF UPLOAD DIRECTORY
// ======================================================
// Shared by Award and Certificate modules: both only ever
// store a single PDF certificate file (image / separate
// verification & credential fields were removed).

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "certificates"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const originalName = path
      .parse(file.originalname)
      .name.replace(/[^a-zA-Z0-9-_]/g, "-");
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${originalName}${extension}`;
    cb(null, uniqueName);
  },
});

const fileFilter = function (req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const isPdf = file.mimetype === "application/pdf" && extension === ".pdf";
  if (isPdf) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

const uploadCertificatePdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

uploadCertificatePdf.directory = uploadDirectory;

module.exports = uploadCertificatePdf;
