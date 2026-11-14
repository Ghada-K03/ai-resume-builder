import { NavLink } from "react-router-dom";

import {
  FileText,
  LayoutDashboard,
  Files,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
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
        <NavLink to="/login" className="sidebar-link" aria-label="Sign Out">
          <LogOut size={20} />
          <span>Sign Out</span>
        </NavLink>
      </div>
    </aside>
  );
}
