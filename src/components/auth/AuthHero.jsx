import { Sparkle } from "lucide-react";
export default function AuthHero({ view }) {
  const isSignIn = view === "signin";
  return (
    <section className="auth-hero" aria-label="AI Resume Builder">
      <div className="hero-brand">
        <Sparkle size={24} aria-label="true" />
        <span>AI Resume Builder</span>
      </div>
      <div className="hero-message" key={view}>
        <h2>
          {isSignIn ? (
            <>
              Welcom <span>back</span>
            </>
          ) : (
            <>
              Join <span>us today</span>
            </>
          )}
        </h2>
        <p>
          {isSignIn
            ? "Plese enter your credentials to access your account"
            : "Create your account and bulid your professional resume with AI"}
        </p>
      </div>
    </section>
  );
}
