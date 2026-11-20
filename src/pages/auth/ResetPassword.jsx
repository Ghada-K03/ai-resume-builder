import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import AuthLayout from "../auth/AuthLayout";
import { resetPassword } from "../../api/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const invalidLink = !email || !token;

  async function handleSubmit(event) {
    event.preventDefault();

    if (invalidLink) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      description="Create a new password to continue your journey."
      heroTitle="A Fresh"
      heroHighlight="Start Awaits"
      heroDescription="Your professional journey continues here."
    >
      {success ? (
        <div className="recovery-form">
          <p className="recovery-success" role="status">
            <CheckCircle2
              size={18}
              style={{
                verticalAlign: "middle",
                marginRight: 8,
              }}
            />
            Password reset successfully!
          </p>

          <button
            type="button"
            className="auth-submit"
            onClick={() => navigate("/login", { replace: true })}
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <form className="recovery-form" onSubmit={handleSubmit}>
          <div>
            <label className="recovery-label" htmlFor="new-password">
              New Password
            </label>

            <div className="auth-input-group">
              <LockKeyhole size={19} />

              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                autoComplete="new-password"
                minLength={8}
                required
                disabled={loading || invalidLink}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label className="recovery-label" htmlFor="confirm-new-password">
              Confirm Password
            </label>

            <div className="auth-input-group">
              <LockKeyhole size={19} />

              <input
                id="confirm-new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
                autoComplete="new-password"
                minLength={8}
                required
                disabled={loading || invalidLink}
              />
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </div>
          </div>

          {invalidLink && (
            <p className="recovery-error" role="alert">
              Invalid reset link. Please request a new one.
            </p>
          )}

          {error && (
            <p className="recovery-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading || invalidLink}
          >
            {loading ? (
              <>
                <LoaderCircle size={19} className="auth-spinner" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}

      <button
        type="button"
        className="recovery-back"
        onClick={() => navigate("/login")}
      >
        <ArrowLeft size={18} />
        Back to Sign In
      </button>
    </AuthLayout>
  );
}
