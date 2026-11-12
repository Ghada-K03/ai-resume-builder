import { FileText, LogIn, UserPlus } from "lucide-react";
export default function AuthNav({ view, onSelect }) {
  return (
    <nav className="auth-nav" aria-label="Authentication">
      <div className="auth-logo">
        <FileText size={36} />
      </div>
      <div className="auth-nav-links">
        <button
          type="button"
          className={view === "signin" ? "active" : ""}
          onClick={() => onSelect("signin")}
        >
          <LogIn size={19} /> <span>Sign In</span>
        </button>
        <button
          type="button"
          className={view === "signup" ? "active" : ""}
          onClick={() => onSelect("signup")}
        >
          <UserPlus size={19} /> <span>Sign Up</span>
        </button>
      </div>
    </nav>
  );
}
