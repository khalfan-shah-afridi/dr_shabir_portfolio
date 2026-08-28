import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Send,
  ShieldCheck,
  UserRound,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";

import "./AdminSettings.css";

function AdminSettings() {
  const {
    admin,
    changePassword,
    sendChangeEmailOTP,
    changeEmail,
  } = useAuth();

  const [activeSection, setActiveSection] =
    useState(null);

  // ==========================================
  // PASSWORD STATE
  // ==========================================
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");

  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  // ==========================================
  // EMAIL STATE
  // ==========================================
  const [newEmail, setNewEmail] =
    useState("");

  const [emailOtp, setEmailOtp] =
    useState("");

  const [emailPassword, setEmailPassword] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [otpLoading, setOtpLoading] =
    useState(false);

  const [emailLoading, setEmailLoading] =
    useState(false);

  const [emailError, setEmailError] =
    useState("");

  const [emailSuccess, setEmailSuccess] =
    useState("");

  // ==========================================
  // OPEN SECTION
  // ==========================================
  const openSection = (section) => {
    setActiveSection(section);

    setPasswordError("");
    setPasswordSuccess("");

    setEmailError("");
    setEmailSuccess("");
  };

  // ==========================================
  // BACK TO OVERVIEW
  // ==========================================
  const closeSection = () => {
    setActiveSection(null);

    setPasswordError("");
    setPasswordSuccess("");

    setEmailError("");
    setEmailSuccess("");
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const response =
        await changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        });

      setPasswordSuccess(
        response?.message ||
          "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setPasswordError(
        error?.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ==========================================
  // SEND EMAIL OTP
  // ==========================================
  const handleSendEmailOTP = async () => {
    setEmailError("");
    setEmailSuccess("");

    const cleanEmail =
      newEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setEmailError(
        "Please enter your new email address."
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      setEmailError(
        "Please enter a valid email address."
      );
      return;
    }

    if (
      cleanEmail ===
      admin?.email?.toLowerCase()
    ) {
      setEmailError(
        "New email must be different from your current email."
      );
      return;
    }

    try {
      setOtpLoading(true);

      const response =
        await sendChangeEmailOTP(
          cleanEmail
        );

      setOtpSent(true);

      setEmailSuccess(
        response?.message ||
          "OTP sent successfully to your new email."
      );
    } catch (error) {
      console.error(
        "Send email OTP error:",
        error
      );

      setEmailError(
        error?.response?.data?.message ||
          "Unable to send OTP."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // ==========================================
  // CHANGE EMAIL
  // ==========================================
  const handleChangeEmail = async (event) => {
    event.preventDefault();

    setEmailError("");
    setEmailSuccess("");

    const cleanEmail =
      newEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setEmailError(
        "Please enter your new email."
      );
      return;
    }

    if (!otpSent) {
      setEmailError(
        "Please send an OTP to your new email first."
      );
      return;
    }

    if (!emailOtp.trim()) {
      setEmailError(
        "Please enter the OTP."
      );
      return;
    }

    if (!emailPassword) {
      setEmailError(
        "Please enter your current password."
      );
      return;
    }

    try {
      setEmailLoading(true);

      const response =
        await changeEmail({
          newEmail: cleanEmail,
          currentPassword: emailPassword,
          otp: emailOtp.trim(),
        });

      setEmailSuccess(
        response?.message ||
          "Email changed successfully."
      );

      setNewEmail("");
      setEmailOtp("");
      setEmailPassword("");
      setOtpSent(false);
    } catch (error) {
      console.error(
        "Change email error:",
        error
      );

      setEmailError(
        error?.response?.data?.message ||
          "Unable to change email."
      );
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="settings-page">

      {/* ======================================
          HEADER
      ====================================== */}
      <motion.div
        className="settings-page-header"
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
      >
        <div>
          <span className="settings-kicker">
            ACCOUNT SETTINGS
          </span>

          <h2>
            Security & Account
          </h2>

          <p>
            Manage your administrator account,
            credentials and security preferences.
          </p>
        </div>

        <div className="settings-protected-badge">
          <ShieldCheck size={17} />
          Protected Area
        </div>
      </motion.div>

      {/* ======================================
          ACCOUNT CARD
      ====================================== */}
      <motion.div
        className="account-card glass-card"
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.08,
          duration: 0.45,
        }}
      >
        <div className="account-card-left">

          <div className="account-avatar-large">
            DS
          </div>

          <div className="account-details">
            <span>
              ADMINISTRATOR
            </span>

            <h3>
              {admin?.name || "Dr. Shabir"}
            </h3>

            <p>
              {admin?.email ||
                "No email available"}
            </p>
          </div>

        </div>

        <div className="account-verified">
          <span className="verified-dot" />
          Active Account
        </div>
      </motion.div>

      {/* ======================================
          CONTENT
      ====================================== */}
      <AnimatePresence mode="wait">
        {!activeSection ? (
          <motion.div
            key="overview"
            className="security-overview"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -12,
            }}
          >
            <div className="security-heading">
              <div>
                <span>
                  SECURITY
                </span>

                <h3>
                  Account protection
                </h3>
              </div>

              <ShieldCheck size={22} />
            </div>

            <div className="security-cards">

              {/* PASSWORD CARD */}
              <motion.button
                type="button"
                className="security-option"
                onClick={() =>
                  openSection("password")
                }
                whileHover={{
                  y: -6,
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <div className="security-option-icon password-icon">
                  <LockKeyhole size={23} />
                </div>

                <div className="security-option-content">
                  <div className="security-option-top">
                    <h4>
                      Change Password
                    </h4>

                    <ArrowRight size={19} />
                  </div>

                  <p>
                    Update your administrator
                    password and strengthen
                    account security.
                  </p>

                  <span>
                    Password protection
                  </span>
                </div>
              </motion.button>

              {/* EMAIL CARD */}
              <motion.button
                type="button"
                className="security-option"
                onClick={() =>
                  openSection("email")
                }
                whileHover={{
                  y: -6,
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <div className="security-option-icon email-icon">
                  <Mail size={23} />
                </div>

                <div className="security-option-content">
                  <div className="security-option-top">
                    <h4>
                      Change Email
                    </h4>

                    <ArrowRight size={19} />
                  </div>

                  <p>
                    Verify a new email address
                    using a secure OTP.
                  </p>

                  <span>
                    Email verification
                  </span>
                </div>
              </motion.button>

            </div>

            {/* SECURITY NOTE */}
            <div className="security-note">
              <ShieldCheck size={17} />

              <div>
                <strong>
                  Your account is protected
                </strong>

                <p>
                  Password and email changes
                  require authentication. Email
                  changes also require OTP
                  verification.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeSection}
            className="security-detail-card glass-card"
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -20,
            }}
          >
            {/* DETAIL HEADER */}
            <div className="detail-header">

              <button
                type="button"
                className="back-button"
                onClick={closeSection}
              >
                <ArrowLeft size={18} />
                Back to Security
              </button>

              <div className="detail-title">
                <div
                  className={`detail-icon ${
                    activeSection ===
                    "password"
                      ? "password-icon"
                      : "email-icon"
                  }`}
                >
                  {activeSection ===
                  "password" ? (
                    <LockKeyhole
                      size={24}
                    />
                  ) : (
                    <Mail size={24} />
                  )}
                </div>

                <div>
                  <span>
                    SECURITY SETTINGS
                  </span>

                  <h3>
                    {activeSection ===
                    "password"
                      ? "Change Password"
                      : "Change Email"}
                  </h3>
                </div>
              </div>
            </div>

            {/* ==================================
                PASSWORD FORM
            =================================== */}
            {activeSection ===
              "password" && (
              <form
                className="security-form"
                onSubmit={
                  handleChangePassword
                }
              >
                <p className="form-description">
                  Enter your current password
                  and create a new secure
                  password.
                </p>

                {passwordError && (
                  <div className="form-message error-message">
                    <AlertCircle
                      size={17}
                    />
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="form-message success-message">
                    <CheckCircle2
                      size={17}
                    />
                    {passwordSuccess}
                  </div>
                )}

                <div className="security-field">
                  <label>
                    Current Password
                  </label>

                  <div className="secure-input">
                    <LockKeyhole
                      size={18}
                    />

                    <input
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        currentPassword
                      }
                      onChange={(event) =>
                        setCurrentPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter current password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          !showCurrentPassword
                        )
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="security-field">
                  <label>
                    New Password
                  </label>

                  <div className="secure-input">
                    <LockKeyhole
                      size={18}
                    />

                    <input
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter new password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="security-field">
                  <label>
                    Confirm New Password
                  </label>

                  <div className="secure-input">
                    <LockKeyhole
                      size={18}
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        confirmPassword
                      }
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm new password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="security-submit"
                  disabled={
                    passwordLoading
                  }
                  whileHover={{
                    y: passwordLoading
                      ? 0
                      : -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                >
                  <LockKeyhole
                    size={18}
                  />

                  {passwordLoading
                    ? "Updating..."
                    : "Update Password"}

                  {!passwordLoading && (
                    <ArrowRight
                      size={18}
                    />
                  )}
                </motion.button>
              </form>
            )}

            {/* ==================================
                EMAIL FORM
            =================================== */}
            {activeSection ===
              "email" && (
              <form
                className="security-form"
                onSubmit={
                  handleChangeEmail
                }
              >
                <p className="form-description">
                  Verify your new email address
                  before changing the account
                  email.
                </p>

                {emailError && (
                  <div className="form-message error-message">
                    <AlertCircle
                      size={17}
                    />
                    {emailError}
                  </div>
                )}

                {emailSuccess && (
                  <div className="form-message success-message">
                    <CheckCircle2
                      size={17}
                    />
                    {emailSuccess}
                  </div>
                )}

                <div className="security-field">
                  <label>
                    Current Email
                  </label>

                  <div className="readonly-email">
                    <Mail size={18} />

                    <span>
                      {admin?.email ||
                        "No current email"}
                    </span>

                    <strong>
                      Verified
                    </strong>
                  </div>
                </div>

                <div className="security-field">
                  <label>
                    New Email Address
                  </label>

                  <div className="email-input-row">

                    <div className="secure-input">
                      <Mail
                        size={18}
                      />

                      <input
                        type="email"
                        value={newEmail}
                        onChange={(event) =>
                          setNewEmail(
                            event.target
                              .value
                          )
                        }
                        placeholder="Enter new email address"
                      />
                    </div>

                    <motion.button
                      type="button"
                      className="otp-send-button"
                      onClick={
                        handleSendEmailOTP
                      }
                      disabled={
                        otpLoading
                      }
                      whileHover={{
                        y: otpLoading
                          ? 0
                          : -2,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                    >
                      <Send
                        size={17}
                      />

                      {otpLoading
                        ? "Sending..."
                        : "Send OTP"}
                    </motion.button>

                  </div>
                </div>

                {otpSent && (
                  <motion.div
                    className="otp-panel"
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <div className="otp-panel-title">
                      <CheckCircle2
                        size={17}
                      />

                      OTP sent successfully
                    </div>

                    <p>
                      Check your new email
                      inbox and enter the
                      6-digit verification
                      code below.
                    </p>
                  </motion.div>
                )}

                {otpSent && (
                  <>
                    <div className="security-field">
                      <label>
                        Verification OTP
                      </label>

                      <div className="secure-input otp-input">
                        <ShieldCheck
                          size={18}
                        />

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={emailOtp}
                          onChange={(event) =>
                            setEmailOtp(
                              event.target.value
                                .replace(
                                  /\D/g,
                                  ""
                                )
                            )
                          }
                          placeholder="Enter 6-digit OTP"
                        />
                      </div>
                    </div>

                    <div className="security-field">
                      <label>
                        Current Password
                      </label>

                      <div className="secure-input">
                        <LockKeyhole
                          size={18}
                        />

                        <input
                          type="password"
                          value={
                            emailPassword
                          }
                          onChange={(event) =>
                            setEmailPassword(
                              event.target
                                .value
                            )
                          }
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      className="security-submit"
                      disabled={
                        emailLoading
                      }
                      whileHover={{
                        y: emailLoading
                          ? 0
                          : -2,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                    >
                      <ShieldCheck
                        size={18}
                      />

                      {emailLoading
                        ? "Verifying..."
                        : "Verify & Change Email"}

                      {!emailLoading && (
                        <ArrowRight
                          size={18}
                        />
                      )}
                    </motion.button>
                  </>
                )}
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminSettings;