const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getProfile,
  getPublicProfile,
  createProfile,
  updateProfile,
  deleteProfileImage,
  toggleProfileVisibility,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// PROFILE UPLOAD DIRECTORY
// ==========================================

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "profile"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension =
      path.extname(file.originalname);

    const baseName =
      path
        .basename(
          file.originalname,
          extension
        )
        .replace(/[^a-zA-Z0-9-_]/g, "-");

    cb(
      null,
      `${Date.now()}-${baseName}${extension}`
    );
  },
});

// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG and WEBP images are allowed."
      )
    );
  }
};

// ==========================================
// UPLOAD
// ==========================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ==========================================
// PUBLIC PROFILE
// ==========================================

router.get(
  "/public",
  getPublicProfile
);

// ==========================================
// ADMIN PROFILE
// ==========================================

// Get complete profile

router.get(
  "/",
  protect,
  getProfile
);

// Create profile

router.post(
  "/",
  protect,
  upload.single("profileImage"),
  createProfile
);

// Update profile

router.put(
  "/",
  protect,
  upload.single("profileImage"),
  updateProfile
);

// Delete profile image

router.delete(
  "/image",
  protect,
  deleteProfileImage
);

// Publish / Unpublish

router.patch(
  "/toggle-visibility",
  protect,
  toggleProfileVisibility
);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;