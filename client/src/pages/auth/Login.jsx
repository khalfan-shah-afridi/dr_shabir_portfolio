import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import api from "../../services/api";

import "./Login.css";

const OTP_SECONDS = 60;

// ==========================================
// FORGOT PASSWORD FLOW
// Step 1: enter email -> OTP sent to that email
// Step 2: enter the 6-digit OTP (valid for 1 minute, resend after expiry)
// Step 3: set a new password
// Step 4: success -> back to login
// ==========================================
function ForgotPassword({ onBack }) {
  const [step, setStep] = useState("email"); // email | otp | reset | success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(OTP_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    if (step !== "otp") return;
    setSecondsLeft(OTP_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step]);

  const requestOtp = async (isResend = false) => {
    setError("");
    setInfo("");

    if (!email.trim()) {
      setError("Please enter your Gmail address.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password/send-otp", {
        email: email.trim().toLowerCase(),
      });
      setOtp("");
      setStep("otp");
      if (isResend) setInfo("A new OTP has been sent.");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (event) => {
    event.preventDefault();
    requestOtp(false);
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");

    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP sent to your email.");
      return;
    }

    if (secondsLeft <= 0) {
      setError("This OTP has expired. Please request a new one.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password/verify-otp", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
      setStep("reset");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password/reset", {
        email: email.trim().toLowerCase(),
        password: newPassword,
      });
      setStep("success");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-heading">
        <div className="login-security-badge">
          <KeyRound size={15} />
          Password Recovery
        </div>

        <h2>
          {step === "email" && "Forgot password?"}
          {step === "otp" && "Enter verification code"}
          {step === "reset" && "Set a new password"}
          {step === "success" && "Password updated"}
        </h2>

        <p>
          {step === "email" &&
            "Enter your Gmail address and we'll send you a one-time code."}
          {step === "otp" &&
            `We sent a 6-digit code to ${email}. It expires in 1 minute.`}
          {step === "reset" && "Choose a new password for your account."}
          {step === "success" &&
            "You can now sign in with your new password."}
        </p>
      </div>

      {error && (
        <motion.div
          className="login-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {info && !error && (
        <motion.div
          className="login-info"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {info}
        </motion.div>
      )}

      {step === "email" && (
        <form className="login-form" onSubmit={handleSendOtp}>
          <div className="login-field">
            <label htmlFor="forgot-email">Gmail Address</label>
            <div className="login-input-wrapper">
              <Mail size={18} />
              <input
                id="forgot-email"
                type="email"
                value={email}
                placeholder="you@gmail.com"
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? (
              <>
                <span className="button-spinner" />
                Sending code...
              </>
            ) : (
              <>
                Send OTP
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>
      )}

      {step === "otp" && (
        <form className="login-form" onSubmit={handleVerifyOtp}>
          <div className="login-field">
            <label htmlFor="forgot-otp">6-Digit OTP</label>
            <div className="login-input-wrapper">
              <KeyRound size={18} />
              <input
                id="forgot-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                placeholder="Enter OTP"
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                autoFocus
              />
            </div>
          </div>

          <div className="otp-timer-row">
            {secondsLeft > 0 ? (
              <span className="otp-timer">
                Code expires in {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </span>
            ) : (
              <span className="otp-timer otp-timer-expired">
                OTP expired
              </span>
            )}

            <button
              type="button"
              className="forgot-password"
              disabled={secondsLeft > 0 || loading}
              onClick={() => requestOtp(true)}
            >
              Resend OTP
            </button>
          </div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={loading || secondsLeft <= 0}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? (
              <>
                <span className="button-spinner" />
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>
      )}

      {step === "reset" && (
        <form className="login-form" onSubmit={handleResetPassword}>
          <div className="login-field">
            <label htmlFor="new-password">New Password</label>
            <div className="login-input-wrapper">
              <LockKeyhole size={18} />
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                placeholder="Enter new password"
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="login-input-wrapper">
              <LockKeyhole size={18} />
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Re-enter new password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? (
              <>
                <span className="button-spinner" />
                Updating...
              </>
            ) : (
              <>
                Update Password
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>
      )}

      {step === "success" && (
        <div className="login-form">
          <div className="otp-success-icon">
            <CheckCircle2 size={40} />
          </div>

          <motion.button
            type="button"
            className="login-button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Back to Sign In
            <ArrowRight size={18} />
          </motion.button>
        </div>
      )}

      {step !== "success" && (
        <button type="button" className="back-to-login" onClick={onBack}>
          <ArrowLeft size={15} />
          Back to Sign In
        </button>
      )}
    </>
  );
}

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [view, setView] = useState("login"); // login | forgot

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);

      await login(
        email.trim().toLowerCase(),
        password
      );

      navigate("/admin", {
        replace: true,
      });
    } catch (loginError) {
      console.error(
        "Login Error:",
        loginError
      );

      const message =
        loginError?.response?.data?.message ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =====================================
          GALAXY NEBULA
      ====================================== */}

      <div
        className="login-nebula login-nebula-blue"
      />

      <div
        className="login-nebula login-nebula-red"
      />

      <div
        className="login-nebula login-nebula-white"
      />

      {/* =====================================
          LOGIN CARD
      ====================================== */}

      <motion.div
        className="login-card"
        initial={{
          opacity: 0,
          y: 35,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >

        {/* BRAND */}

        <div className="login-brand">

          <motion.div
            className="login-logo"
            animate={{
              y: [0, -6, 0],
              rotateY: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            DS
          </motion.div>

          <div>
            <h1>
              Dr. Shabir
            </h1>

            <p>
              Portfolio Administration
            </p>
          </div>

        </div>

        {view === "login" ? (
          <>
        {/* HEADING */}

        <div className="login-heading">

          <div className="login-security-badge">
            <ShieldCheck size={15} />

            Secure Administrator Access
          </div>

          <h2>
            Welcome back
          </h2>

          <p>
            Sign in to manage your
            professional portfolio.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <motion.div
            className="login-error"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            {error}
          </motion.div>
        )}

        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="login-field">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="login-input-wrapper">

              <Mail size={18} />

              <input
                id="email"
                type="email"
                value={email}
                placeholder="Enter admin email"
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                autoComplete="email"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="login-input-wrapper">

              <LockKeyhole size={18} />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                placeholder="Enter password"
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* OPTIONS */}

          <div className="login-options">

            <label className="remember-me">

              <input
                type="checkbox"
                defaultChecked
              />

              <span>
                Remember session
              </span>

            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() => {
                setError("");
                setView("forgot");
              }}
            >
              Forgot password?
            </button>

          </div>

          {/* LOGIN BUTTON */}

          <motion.button
            type="submit"
            className="login-button"
            disabled={loading}
            whileHover={
              !loading
                ? {
                    scale: 1.02,
                  }
                : {}
            }
            whileTap={
              !loading
                ? {
                    scale: 0.97,
                  }
                : {}
            }
          >
            {loading ? (
              <>
                <span className="button-spinner" />

                Signing in...
              </>
            ) : (
              <>
                Sign in

                <ArrowRight size={18} />
              </>
            )}
          </motion.button>

        </form>

          </>
        ) : (
          <ForgotPassword onBack={() => setView("login")} />
        )}

        {/* FOOTER */}

        <div className="login-footer">

          <ShieldCheck size={14} />

          <span>
            Protected administrator area
          </span>

        </div>

      </motion.div>
    </div>
  );
}

export default Login;