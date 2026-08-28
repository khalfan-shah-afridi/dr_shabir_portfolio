const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "research-papers"
);

// =====================================================
// CREATE DIRECTORY IF NOT EXISTS
// =====================================================

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =====================================================
// STORAGE CONFIGURATION
// =====================================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    const originalName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const uniqueName =
      `${Date.now()}-${originalName}${extension}`;

    cb(null, uniqueName);
  },
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = [
    "application/pdf",
  ];

  const allowedExtensions = [
    ".pdf",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(extension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF files are allowed."
      ),
      false
    );
  }
};

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const researchPublicationUpload = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// =====================================================
// EXPORT
// =====================================================

module.exports = researchPublicationUpload;