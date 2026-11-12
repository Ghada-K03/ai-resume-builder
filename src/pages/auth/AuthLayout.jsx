import { ArrowLeft, Sparkles } from "lucide-react";
import "../../styles/auth.css";
import "../../styles/recovery.css";

import { useNavigate } from "react-router-dom";
export default function AuthLayout({
  title,
  description,
  heroTitle = "Your Future",
  heroHighlight = "Starts Here",
  heroDescription = "Build your professional story with confidence.",
  children,
}) {
  const navigate = useNavigate();
  return (
    <main className="auth-page">
      <div className="auth-card recovery-card">
        <aside className="recovery-sidebar">
          <button
            type="button"
            className="recovery-sidebar-back"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft size={18} />
            <span>Back to Sign In</span>
          </button>
        </aside>

        <div className="auth-hero-container">
          <section className="auth-hero">
            <div className="hero-brand">
              <Sparkles size={24} />
              <span>AI Resume Builder</span>
            </div>

            <div className="hero-message">
              <h2>
                {heroTitle} <span>{heroHighlight}</span>
              </h2>

              <p>{heroDescription}</p>
            </div>
          </section>
        </div>

        <section className="recovery-content">
          <h1>{title}</h1>
          <p className="recovery-description">{description}</p>

          {children}
        </section>
      </div>
    </main>
  );
}
