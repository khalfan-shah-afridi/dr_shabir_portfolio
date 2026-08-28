import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  IdCard,
  GraduationCap,
  Code2,
  FolderKanban,
  Award,
  BadgeCheck,
  FileLock2,
  Briefcase,
  FileDown,
  Target,
  Eye as VisionIcon,
  BookOpen,
  Send,
  Users,
  Users2,
  SlidersHorizontal,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Mail,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import api from "../../services/api";
import "./AdminShell.css";

// ==========================================
// SIDEBAR NAVIGATION STRUCTURE
// ==========================================
const NAV_SECTIONS = [
  {
    label: "Dashboard",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "Portfolio Content",
    items: [
      { to: "/admin/personal-information", label: "Personal Information", icon: IdCard },
      { to: "/admin/profile", label: "Profile & Picture", icon: UserRound },
      { to: "/admin/education", label: "Education", icon: GraduationCap },
      { to: "/admin/experience", label: "Experience", icon: Briefcase },
      { to: "/admin/skills", label: "Skills", icon: Code2 },
      { to: "/admin/projects", label: "Projects", icon: FolderKanban },
      { to: "/admin/awards", label: "Awards", icon: Award },
      { to: "/admin/certificates", label: "Certificates", icon: BadgeCheck },
      { to: "/admin/documents", label: "Documents Vault", icon: FileLock2 },
      { to: "/admin/research-resources", label: "Research Resources", icon: BookOpen },
      { to: "/admin/project-wins", label: "Project Wins", icon: Award },
      { to: "/admin/supervision", label: "Supervision", icon: Users },
      { to: "/admin/reviewer", label: "Reviewer", icon: BookOpen },
      { to: "/admin/mission", label: "Mission", icon: Target },
      { to: "/admin/vision", label: "Vision", icon: VisionIcon },
    ],
  },
  {
    label: "Inbox",
    items: [
      { to: "/admin/messages", label: "Contact Messages", icon: Mail },
    ],
  },
  {
    label: "Research",
    items: [
      { to: "/admin/publications", label: "Publications", icon: BookOpen },
      { to: "/admin/submit-papers", label: "Research Paper Submissions", icon: Send },
      { to: "/admin/conferences", label: "Conferences", icon: Users2 },
      { to: "/admin/references", label: "References", icon: Users },
      { to: "/admin/cv-generator", label: "CV Generator", icon: FileDown },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/visibility", label: "Visibility", icon: SlidersHorizontal },
      { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

export default function AdminShell({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const loadUnread = () => {
      api
        .get("/contact/unread-count")
        .then((r) => setUnreadMessages(r.data?.data?.unread || 0))
        .catch(() => {});
    };
    loadUnread();
    const interval = setInterval(loadUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = (admin?.name || "Admin")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="shell">
      {/* ================= TOP NAVBAR ================= */}
      <header className="shell-topbar">
        <div className="shell-topbar-left">
          <button
            type="button"
            className="shell-burger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="shell-brand">
            <ShieldCheck size={18} />
            <div>
              <strong>Dr. Muhammad Shabir Afridi</strong>
              <span>Admin Control Panel</span>
            </div>
          </div>
        </div>

        <div className="shell-topbar-right">
          <NavLink to="/portfolio" className="shell-view-site" target="_blank">
            View Public Site
          </NavLink>

          <div className="shell-admin-chip">
            <span className="shell-avatar">{initials}</span>
            <div className="shell-admin-meta">
              <strong>{admin?.name || "Administrator"}</strong>
              <small>{admin?.email || ""}</small>
            </div>
          </div>

          <button type="button" className="shell-logout" onClick={handleLogout} title="Logout">
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <div className="shell-body">
        {/* ================= SIDEBAR ================= */}
        <aside className={`shell-sidebar ${mobileOpen ? "open" : ""}`}>
          <nav className="shell-nav">
            {NAV_SECTIONS.map((section) => (
              <div className="shell-nav-section" key={section.label}>
                <span className="shell-nav-label">{section.label}</span>
                {section.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `shell-nav-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                    {to === "/admin/messages" && unreadMessages > 0 && (
                      <b className="shell-nav-badge">{unreadMessages}</b>
                    )}
                    <ChevronRight size={13} className="shell-nav-chevron" />
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          <button type="button" className="shell-nav-logout" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </aside>

        {mobileOpen && (
          <div className="shell-backdrop" onClick={() => setMobileOpen(false)} />
        )}

        {/* ================= PAGE CONTENT ================= */}
        <main className="shell-content">{children}</main>
      </div>
    </div>
  );
}
