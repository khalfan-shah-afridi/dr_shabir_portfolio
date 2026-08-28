const Admin = require("../models/Admin");
const OTP = require("../models/OTP");
const RefreshToken = require("../models/RefreshToken");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

// ==========================================
// CREATE ACCESS TOKEN
// ==========================================
const createAccessToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// ==========================================
// CREATE REFRESH TOKEN
// ==========================================
const createRefreshToken = async (admin) => {
  const token = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await RefreshToken.create({
    adminId: admin._id,
    token,
    expiresAt,
  });

  return token;
};

// ==========================================
// ADMIN REGISTER
// ==========================================
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingAdmin = await Admin.findOne({
      email: cleanEmail,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const admin = await Admin.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Register Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN LOGIN
// ==========================================
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = createAccessToken(admin);

    const refreshToken = await createRefreshToken(
      admin
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ==========================================
// SEND OTP
// ==========================================
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await OTP.deleteMany({
      email: cleanEmail,
    });

    await OTP.create({
      email: cleanEmail,
      otp,
      expiresAt,
    });

    await sendEmail(
      cleanEmail,
      "Dr Muhammad Shabir Afridi Portfolio - OTP",
      `Your OTP is: ${otp}

This OTP is valid for 10 minutes.

If you did not request this OTP, please ignore this email.

Dr Muhammad Shabir Afridi Portfolio`
    );

    console.log(`OTP sent to ${cleanEmail}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP",
      error: error.message,
    });
  }
};

// ==========================================
// VERIFY OTP
// ==========================================
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const otpRecord = await OTP.findOne({
      email: cleanEmail,
      otp: otp.toString().trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
      error: error.message,
    });
  }
};

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const tokenRecord = await RefreshToken.findOne({
      token: refreshToken,
    }).populate("adminId");

    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    if (tokenRecord.expiresAt < new Date()) {
      await RefreshToken.deleteOne({
        _id: tokenRecord._id,
      });

      return res.status(401).json({
        success: false,
        message: "Refresh token has expired",
      });
    }

    if (!tokenRecord.adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found",
      });
    }

    const newAccessToken = createAccessToken(
      tokenRecord.adminId
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(
      "Refresh Access Token Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to refresh access token",
      error: error.message,
    });
  }
};

// ==========================================
// LOGOUT
// ==========================================
const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.deleteOne({
        token: refreshToken,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// ==========================================
// CHANGE PASSWORD
// ==========================================
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current password, new password and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    const adminId = req.admin.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    const isCurrentPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        admin.password
      );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        admin.password
      );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    admin.password = hashedPassword;

    await admin.save();

    // Revoke all refresh sessions
    await RefreshToken.deleteMany({
      adminId: admin._id,
    });

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.error(
      "Change Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to change password",
      error: error.message,
    });
  }
};

// ==========================================
// SEND CHANGE EMAIL OTP
// ==========================================
const sendChangeEmailOTP = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({
        success: false,
        message: "New email is required",
      });
    }

    const cleanNewEmail = newEmail
      .toLowerCase()
      .trim();

    // Get currently logged-in admin
    const admin = await Admin.findById(
      req.admin.id
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    // Same email check
    if (cleanNewEmail === admin.email) {
      return res.status(400).json({
        success: false,
        message:
          "New email must be different from current email",
      });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({
      email: cleanNewEmail,
      _id: {
        $ne: admin._id,
      },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "This email is already in use",
      });
    }

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Remove old OTP
    await OTP.deleteMany({
      email: cleanNewEmail,
    });

    // Save OTP
    await OTP.create({
      email: cleanNewEmail,
      otp,
      expiresAt,
    });

    // Send OTP to NEW email
    await sendEmail(
      cleanNewEmail,
      "Change Admin Email - OTP",
      `Your email change OTP is: ${otp}

This OTP is valid for 10 minutes.

If you did not request an email change, please ignore this email.

Dr Muhammad Shabir Afridi Portfolio`
    );

    console.log(
      `Email change OTP sent to ${cleanNewEmail}`
    );

    return res.status(200).json({
      success: true,
      message:
        "OTP sent to the new email successfully",
    });
  } catch (error) {
    console.error(
      "Send Change Email OTP Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send email change OTP",
      error: error.message,
    });
  }
};

// ==========================================
// CHANGE EMAIL
// ==========================================
const changeEmail = async (req, res) => {
  try {
    const {
      newEmail,
      currentPassword,
      otp,
    } = req.body;

    if (
      !newEmail ||
      !currentPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New email, current password and OTP are required",
      });
    }

    const cleanNewEmail = newEmail
      .toLowerCase()
      .trim();

    // Get logged-in admin
    const admin = await Admin.findById(
      req.admin.id
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    // Verify current password
    const passwordCorrect =
      await bcrypt.compare(
        currentPassword,
        admin.password
      );

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    // New email must be different
    if (cleanNewEmail === admin.email) {
      return res.status(400).json({
        success: false,
        message:
          "New email must be different from current email",
      });
    }

    // Check email availability
    const existingAdmin = await Admin.findOne({
      email: cleanNewEmail,
      _id: {
        $ne: admin._id,
      },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "This email is already in use",
      });
    }

    // Find OTP sent to NEW email
    const otpRecord = await OTP.findOne({
      email: cleanNewEmail,
      otp: otp.toString().trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (
      otpRecord.expiresAt < new Date()
    ) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Update email
    admin.email = cleanNewEmail;

    await admin.save();

    // Delete used OTP
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    // Revoke all refresh tokens
    await RefreshToken.deleteMany({
      adminId: admin._id,
    });

    return res.status(200).json({
      success: true,
      message:
        "Email changed successfully. Please login again.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(
      "Change Email Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to change email",
      error: error.message,
    });
  }
};


// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================
const sendForgotPasswordOTP = async (req, res) => {
  try {
    const email = String(req.body?.email || "").toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const admin = await Admin.findOne({ email });

    // Keep the account lookup private.
    if (!admin) {
      return res.status(200).json({
        success: true,
        message: "If the account exists, an OTP has been sent.",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save the new OTP state first so verification is tied to the latest request.
    admin.resetOtp = otp;
    admin.resetOtpExpires = expiresAt;
    admin.isOtpVerified = false;
    await admin.save();

    try {
      await sendEmail(
        email,
        "Password Reset OTP - Dr Muhammad Shabir Afridi Portfolio",
        `Your password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\nDr Muhammad Shabir Afridi Portfolio`
      );
    } catch (emailError) {
      // Do not leave a usable OTP behind when Gmail delivery fails.
      admin.resetOtp = null;
      admin.resetOtpExpires = null;
      admin.isOtpVerified = false;
      await admin.save();

      console.error("[forgot-password/send-otp] Gmail error:", emailError);
      return res.status(500).json({
        success: false,
        message: "Unable to send reset OTP. Check Gmail SMTP/App Password configuration.",
        error: emailError.message,
      });
    }

    console.log(`Password reset OTP sent to ${email}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your Gmail.",
      expiresInSeconds: 600,
    });
  } catch (error) {
    console.error("[forgot-password/send-otp] Server error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send reset OTP",
      error: error.message,
    });
  }
};

const verifyForgotPasswordOTP = async (req,res) => {
  try {
    const email=String(req.body.email||"").toLowerCase().trim(); const otp=String(req.body.otp||"").trim();
    const admin=await Admin.findOne({email});
    if(!admin || !admin.resetOtp || admin.resetOtp!==otp || !admin.resetOtpExpires || admin.resetOtpExpires<new Date()) return res.status(400).json({success:false,message:"Invalid or expired OTP"});
    admin.isOtpVerified=true; admin.resetOtp=null; admin.resetOtpExpires=null; await admin.save();
    res.json({success:true,message:"OTP verified successfully"});
  } catch(error){ console.error("[forgot-password/verify-otp]", error); res.status(500).json({success:false,message: error.message || "Unable to verify reset OTP"});}
};

const resetPassword = async (req,res) => {
  try {
    const email=String(req.body.email||"").toLowerCase().trim(); const password=String(req.body.password||"");
    if(password.length<6) return res.status(400).json({success:false,message:"Password must be at least 6 characters"});
    const admin=await Admin.findOne({email});
    if(!admin || !admin.isOtpVerified) return res.status(400).json({success:false,message:"Verify OTP before resetting password"});
    admin.password=await bcrypt.hash(password,12); admin.isOtpVerified=false; await admin.save();
    res.json({success:true,message:"Password reset successfully. You can now login."});
  } catch(error){ console.error("[forgot-password/reset]", error); res.status(500).json({success:false,message: error.message || "Unable to reset password"});}
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
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
};