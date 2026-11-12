import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

import AuthLayout from "../../pages/auth/AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) return;

    // Frontend demo: no email is sent.
    navigate("/verify", {
      state: { email: email.trim() },
    });
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      description="Enter your email address and we'll help you reset your password."
      heroTitle="Let's Get You"
      heroHighlight="Back On Track"
      heroDescription="Your next career opportunity is waiting for you."
    >
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
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <button type="submit" className="auth-submit">
          Continue
        </button>
      </form>
    </AuthLayout>
  );
}
