const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================================
// PDF UPLOAD DIRECTORY
// ======================================================

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "research-papers"
);

// Create directory automatically
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ======================================================
// STORAGE
// ======================================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const originalName = path
      .parse(file.originalname)
      .name
      .replace(/[^a-zA-Z0-9_-]/g, "-");

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const uniqueName = `${Date.now()}-${originalName}${extension}`;

    cb(null, uniqueName);
  },
});

// ======================================================
// FILE FILTER
// ======================================================

const fileFilter = function (req, file, cb) {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const isPdf =
    file.mimetype === "application/pdf" &&
    extension === ".pdf";

  if (isPdf) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

// ======================================================
// MULTER CONFIGURATION
// ======================================================

const researchPublicationUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ======================================================
// EXPORT
// ======================================================

module.exports = researchPublicationUpload;