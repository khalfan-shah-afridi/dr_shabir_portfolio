import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  FileText,
  Award,
  GraduationCap,
  Code2,
  UserRound,
  ShieldCheck,
  BookOpen,
  Target,
  Heart,
  Send,
  FileLock2,
  Briefcase,
  FileDown,
  Mail,
} from "lucide-react";
import api from "../../services/api";
import "./AdminDashboard.css";

const cards = [
  ["messages", "Messages", Mail, "/admin/messages"],
  ["projects", "Projects", FolderKanban, "/admin/projects"],
  ["publications", "Publications", FileText, "/admin/publications"],
  ["certificates", "Certificates", Award, "/admin/certificates"],
  ["education", "Education", GraduationCap, "/admin/education"],
  ["experience", "Experience", Briefcase, "/admin/experience"],
  ["skills", "Skills", Code2, "/admin/skills"],
  ["awards", "Awards", Award, "/admin/awards"],
  ["mission", "Mission", Target, "/admin/mission"],
  ["vision", "Vision", Heart, "/admin/vision"],
  ["conferences", "Conferences", BookOpen, "/admin/conferences"],
  ["references", "References", UserRound, "/admin/references"],
  ["cvGenerator", "CV Generator", FileDown, "/admin/cv-generator"],
  ["submitPapers", "Submit Paper", Send, "/admin/submit-papers"],
  ["documents", "Documents Vault", FileLock2, "/admin/documents"],
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((r) => setStats(r.data.data || {}))
      .catch(console.error);
  }, []);

  return (
    <div className="dash-page">
      <section className="dash-hero">
        <div>
          <span>
            <ShieldCheck size={14} /> SECURE CONTENT CONTROL
          </span>

          <h1>Professional Portfolio Dashboard</h1>

          <p>
            Manage your academic profile, research content and public
            visibility from one dark, focused workspace.
          </p>

          <div className="dash-links">
            <Link to="/admin/personal-information">
              Personal Information
            </Link>

            <Link to="/admin/profile">
              Detailed Profile
            </Link>

            <Link to="/portfolio">
              View Public Portfolio
            </Link>
          </div>
        </div>
      </section>

      <div className="dash-grid">
        {cards.map(([key, title, Icon, to]) => (
          <Link
            className="dash-card"
            to={to}
            key={key}
          >
            <div>
              <Icon />
              <small>{title}</small>
            </div>

            <strong>
              {key === "messages" && stats.unreadMessages > 0
                ? `${stats[key] ?? "—"} (${stats.unreadMessages} new)`
                : stats[key] ?? "—"}
            </strong>
          </Link>
        ))}
      </div>

      <div className="dash-note">
        <Target size={18} />

        <div>
          <b>Privacy-first publishing</b>

          <p>
            Hidden records are excluded from the public portfolio.
            Personal Information also has field-level privacy filtering
            at the API layer.
          </p>
        </div>
      </div>
    </div>
  );
}