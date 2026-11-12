import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import AuthLayout from "../auth/AuthLayout";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Demo only: password is not changed.
    setError("");
    setSuccess(true);
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
          </p>

          <button
            type="button"
            className="auth-submit"
            onClick={() => navigate("/login")}
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
              />
            </div>
          </div>

          {error && (
            <p className="recovery-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-submit">
            Reset Password
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
