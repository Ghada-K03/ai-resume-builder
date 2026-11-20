import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../api/authService";

import {
  FileText,
  LayoutDashboard,
  Files,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await logoutUser();

      sessionStorage.removeItem("cv-access-token");

      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(
        error.response?.data?.message || "Logout failed. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  }
  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "My Resumes",
      path: "/dashboard/resumes",
      icon: Files,
    },
    {
      label: "Create CV",
      path: "/create-cv",
      icon: PlusCircle,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="dashboard-sidebar">
      <NavLink to="/dashboard" className="sidebar-brand">
        <FileText size={26} />
        <span>AI Resume Builder</span>
      </NavLink>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {menuItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {logoutError && (
          <p role="alert" className="recovery-error">
            {logoutError}
          </p>
        )}
        <button
          type="button"
          className="sidebar-link"
          onClick={handleLogout}
          aria-label="Sign Out"
        >
          <LogOut size={20} />
          <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  );
}
