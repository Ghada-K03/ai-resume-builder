import { ArrowUpRight, Sparkles } from "lucide-react";

export default function WelcomeBanner({ onCreate }) {
  return (
    <section className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-tag">
          <Sparkles size={16} />
          AI-Powered Resume Builder
        </div>

        <h2>
          Your next opportunity
          <span> starts here.</span>
        </h2>

        <p>
          Build a professional resume, showcase your skills, and take the next
          step in your career.
        </p>

        <button type="button" className="welcome-create-btn" onClick={onCreate}>
          Create New CV
          <ArrowUpRight size={19} />
        </button>
      </div>

      <div className="welcome-decoration" aria-hidden="true">
        <Sparkles size={100} />
      </div>
    </section>
  );
}
