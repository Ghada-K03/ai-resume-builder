import { Search, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function DashboardHeader({ search, onSearchChange }) {
  const navigate = useNavigate();
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-title">
        <h1>Dashboard</h1>
        <p>Manage your resumes and professional journey.</p>
      </div>

      <div className="dashboard-header-actions">
        <label className="dashboard-search">
          <Search size={19} />

          <input
            type="search"
            placeholder="Search resumes..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search resumes"
          />
        </label>

        <button
          type="button"
          className="dashboard-avatar"
          onClick={() => navigate("/profile")}
          aria-label="Open Profile"
        >
          <CircleUserRound size={30} />
        </button>
      </div>
    </header>
  );
}
