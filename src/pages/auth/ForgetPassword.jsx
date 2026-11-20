import { useState } from "react";
// import { useNavigate } from "react-router-dom"; np
import { Mail, LoaderCircle } from "lucide-react";

import AuthLayout from "./AuthLayout";
import { forgotPassword } from "../../api/authService";

export default function ForgotPassword() {
  // const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || loading) return;

    setLoading(true);
    setError("");

    try {
      await forgotPassword(trimmedEmail);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      description="Enter your email address and we'll help you reset your password."
      heroTitle="Let's Get You"
      heroHighlight="Back On Track"
      heroDescription="Your next career opportunity is waiting for you."
    >
      {success ? (
        <p className="recovery-success" role="status">
          Check your email for a password reset link.
        </p>
      ) : (
        <form className="recovery-form" onSubmit={handleSubmit}>
          <div>
            <label className="recovery-label" htmlFor="forgot-email">
              Email Address
            </label>

            <div className="auth-input-group">
              <Mail size={19} />

              <input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading || !email.trim()}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={19}
                  className="auth-spinner"
                  aria-hidden="true"
                />
                Sending...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
