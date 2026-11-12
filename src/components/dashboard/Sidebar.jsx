import { NavLink } from "react-router-dom";

import {
  Sparkles,
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
      <div className="sidebar-brand">
        <Sparkles size={26} />
        <span>AI Resume Builder</span>
      </div>

      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/login" className="sidebar-link">
          <LogOut size={20} />
          <span>Sign Out</span>
        </NavLink>
      </div>
    </aside>
  );
}
