import { useState } from "react";
import AuthNav from "./AuthNav";
import AuthHero from "./AuthHero";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
export default function AuthCard() {
  const [view, setView] = useState("signin");
  const signup = view === "signup";
  return (
    <div className={`auth-card ${view}`}>
      <AuthNav view={view} onSelect={setView} />
      <div className="auth-hero-container">
        <AuthHero view={view} />
      </div>
      <section className="auth-form-window">
        <div className="auth-form-track">
          <div className="auth-form-slide" inert={signup} aria-hidden={signup}>
            <SignInForm onSignUp={() => setView("signup")} />
          </div>
          <div
            className="auth-form-slide"
            inert={!signup}
            aria-hidden={!signup}
          >
            <SignUpForm onSignIn={() => setView("signin")} />
          </div>
        </div>
      </section>
    </div>
  );
}
