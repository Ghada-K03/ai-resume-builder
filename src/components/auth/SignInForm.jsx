import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";

import { loginUser } from "../../api/authService";

export default function SignInForm({ onSignUp }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      // Verify the token location using Swagger.
      const token =
        result?.data?.token ??
        result?.data?.access_token ??
        result?.token ??
        result?.access_token;

      if (!token || typeof token !== "string") {
        throw new Error("Login succeeded, but no access token was found.");
      }

      // Temporary session storage for development.
      sessionStorage.setItem("cv-access-token", token);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to sign in. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <div className="auth-form-top">
        New here?{" "}
        <button type="button" onClick={onSignUp}>
          Sign Up
        </button>
      </div>

      <h1>Sign In</h1>

      <p className="auth-subtitle">
        Welcome back! Enter your details to continue.
      </p>

      <form className="auth-fields" onSubmit={submit}>
        <label className="auth-input-group">
          <Mail size={19} />
          <input
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="auth-input-group">
          <LockKeyhole size={19} />
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            className="password-toggle"
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? <Eye size={19} /> : <EyeOff size={19} />}
          </button>
        </label>

        <button
          className="forgot-password"
          type="button"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </button>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="auth-divider">
        <span>Or continue with</span>
      </div>

      <div className="social-buttons">
        <button
          type="button"
          aria-label="Continue with Google"
          title="Google login coming soon"
          disabled
        >
          <FcGoogle size={24} />
        </button>

        <button
          type="button"
          aria-label="Continue with Facebook"
          title="Facebook login coming soon"
          disabled
        >
          <FaFacebookF size={21} />
        </button>

        <button
          type="button"
          aria-label="Continue with Apple"
          title="Apple login coming soon"
          disabled
        >
          <FaApple size={24} />
        </button>
      </div>
    </div>
  );
}
