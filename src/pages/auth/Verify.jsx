import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import AuthLayout from "../../pages/auth/AuthLayout";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [code, setCode] = useState(Array(6).fill(""));

  const [error, setError] = useState("");

  const inputsRef = useRef([]);

  // Handle typing each digit
  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;

    const updated = [...code];
    updated[index] = value.slice(-1);

    setCode(updated);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  // Handle keyboard navigation
  function handleKeyDown(index, event) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  // Handle pasting a 6-digit code
  function handlePaste(event) {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const updated = Array(6).fill("");

    pasted.split("").forEach((digit, index) => {
      updated[index] = digit;
    });

    setCode(updated);
    setError("");

    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }

  // Verify entered code
  function handleSubmit(event) {
    event.preventDefault();

    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    // Frontend demo only.
    // Real verification requires a backend.
    navigate("/reset-password", {
      state: { email },
    });
  }

  // Resend verification code
  function handleResend() {
    setCode(Array(6).fill(""));

    setError("");

    inputsRef.current[0]?.focus();
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      description={
        email
          ? `Enter the 6-digit verification code for ${email}.`
          : "Enter your 6-digit verification code."
      }
      heroTitle="One More"
      heroHighlight="Step Ahead"
      heroDescription="You're getting closer to creating your professional future."
    >
      <form className="recovery-form" onSubmit={handleSubmit}>
        <div className="verify-code-inputs" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="recovery-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-submit">
          Verify Code
        </button>
      </form>

      <div className="verify-resend">
        <span>Didn't receive the code?</span>

        <button type="button" onClick={handleResend}>
          <RefreshCw size={15} />
          Resend Code
        </button>
      </div>
    </AuthLayout>
  );
}
