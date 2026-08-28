const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  sendOTP,
  verifyOTP,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
  refreshAccessToken,
  logoutAdmin,
  changePassword,
  sendChangeEmailOTP,
  changeEmail,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// ADMIN REGISTER
// ==========================================
router.post("/register", registerAdmin);

// ==========================================
// ADMIN LOGIN
// ==========================================
router.post("/login", loginAdmin);

// ==========================================
// GENERAL OTP
// ==========================================
router.post("/send-otp", sendOTP);

// ==========================================
// VERIFY GENERAL OTP
// ==========================================
router.post("/verify-otp", verifyOTP);

router.post("/forgot-password/send-otp", sendForgotPasswordOTP);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOTP);
router.post("/forgot-password/reset", resetPassword);

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================
router.post("/refresh", refreshAccessToken);

// ==========================================
// LOGOUT
// ==========================================
router.post("/logout", logoutAdmin);

// ==========================================
// ADMIN PROFILE
// ==========================================
router.get("/profile", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Protected admin route accessed successfully",
    admin: req.admin,
  });
});

// ==========================================
// CHANGE PASSWORD
// ==========================================
router.put(
  "/change-password",
  protect,
  changePassword
);

// ==========================================
// SEND CHANGE EMAIL OTP
// ==========================================
router.post(
  "/send-change-email-otp",
  protect,
  sendChangeEmailOTP
);

// ==========================================
// CHANGE EMAIL
// ==========================================
router.put(
  "/change-email",
  protect,
  changeEmail
);

module.exports = router;