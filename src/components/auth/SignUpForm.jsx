import { useState } from "react";
import { UserRound, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
export default function SignUpForm({ onSignIn }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setForm("");
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Password do not match.");
      return;
    }
    console.log("Sign up Submitted:", {
      name: form.name,
      email: form.email,
    });
    alert("Account form submitted Successfully!");
  }
  return (
    <form className="auth-form signup-form" onSubmit={handleSubmit}>
      <div className="auth-form-top">
        <span>Already have an account?</span>
        <button type="button" onClick={onSignIn}>
          Sign In
        </button>
      </div>
      <h1>Create Account</h1>
      <div className="auth-fields">
        <div className="auth-input-group">
          <UserRound size={20} aria-hidden="true" />
          <input
            type="text"
            name="name"
            aria-label="Full name"
            placeholder="Full name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-input-group">
          <Mail size={20} aria-hidden="true" />
          <input
            type="email"
            name="email"
            aria-label="Email"
            placeholder="Email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-input-group">
          <LockKeyhole size={20} aria-hidden="true" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            aria-label="Password"
            minLength={8}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((previous) => !previous)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="auth-input-group">
          <LockKeyhole size={20} aria-hidden="true" />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            aria-label="Confirm Password"
            minLength={8}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((previous) => !previous)}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <button type="submit" className="auth-submit">
          Create Account
        </button>
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
    </form>
  );
}
