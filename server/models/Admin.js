const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ==========================================
    // LOGIN OTP
    // ==========================================
    loginOtp: {
      type: String,
      default: null,
    },

    loginOtpExpires: {
      type: Date,
      default: null,
    },

    // ==========================================
    // RESET PASSWORD OTP
    // ==========================================
    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpires: {
      type: Date,
      default: null,
    },

    // ==========================================
    // OTP VERIFICATION
    // ==========================================
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,

    // IMPORTANT:
    // Explicitly use MongoDB collection "admins"
    collection: "admins",
  }
);

const Admin = mongoose.model(
  "Admin",
  adminSchema
);

module.exports = Admin;