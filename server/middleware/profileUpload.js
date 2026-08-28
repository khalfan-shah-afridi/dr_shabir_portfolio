const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================================
// PROFILE IMAGE UPLOAD DIRECTORY
// ======================================================

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "profile"
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
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const uniqueName =
      `${Date.now()}-${originalName}${extension}`;

    cb(null, uniqueName);
  },
});

// ======================================================
// FILE FILTER
// ======================================================

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const isValid =
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(extension);

  if (isValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }
};

// ======================================================
// MULTER CONFIGURATION
// ======================================================

const uploadProfileImage = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ======================================================
// EXPORT
// ======================================================

module.exports = uploadProfileImage;