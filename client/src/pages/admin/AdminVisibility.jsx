import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Save,
  ShieldCheck,
  FileText,
  FolderKanban,
  Award,
  UserRound,
  Users,
  Heart,
  Target,
  Wrench,
  Medal,
  GraduationCap,
  Info,
  BookOpen,
  Send,
  RefreshCw,
  Loader2,
} from "lucide-react";

import api from "../../services/api";
import "./AdminVisibility.css";

// ==========================================
// MODULES BACKED BY THE GENERIC CONTENT
// MANAGER (support GET list + PATCH /:id/toggle)
// ==========================================
const CONTENT_MODULES = [
  { key: "education", settingsKey: "education", title: "Education", icon: GraduationCap, endpoint: "/education", labelField: ["degree", "level"] },
  { key: "skills", settingsKey: "skills", title: "Skills", icon: Wrench, endpoint: "/skills", labelField: ["name", "category"] },
  { key: "projects", settingsKey: "projects", title: "Projects", icon: FolderKanban, endpoint: "/projects", labelField: ["title", "projectId"] },
  { key: "awards", settingsKey: "awards", title: "Awards", icon: Medal, endpoint: "/awards", labelField: ["title", "organization"] },
  { key: "certificates", settingsKey: "certificates", title: "Certificates", icon: Award, endpoint: "/certificates", labelField: ["title", "issuer"] },
  { key: "mission", settingsKey: "mission", title: "Mission", icon: Target, endpoint: "/mission", labelField: ["title"] },
  { key: "vision", settingsKey: "vision", title: "Vision", icon: Heart, endpoint: "/vision", labelField: ["title"] },
  { key: "researchResources", settingsKey: "researchResources", title: "Research Resources", icon: BookOpen, endpoint: "/research-resources", labelField: ["title"] },
  { key: "projectWins", settingsKey: "projectWins", title: "Project Wins", icon: Award, endpoint: "/project-wins", labelField: ["title", "projectId"] },
  { key: "supervision", settingsKey: "supervision", title: "Supervision", icon: Users, endpoint: "/supervision", labelField: ["title", "student"] },
  { key: "reviewer", settingsKey: "reviewer", title: "Reviewer", icon: BookOpen, endpoint: "/reviewer", labelField: ["journal"] },
];

// Modules that only support module-level ON/OFF here (their own
// dedicated admin pages already manage item-level visibility).
const SIMPLE_MODULES = [
  { key: "personalInformation", title: "Personal Information", icon: Info, link: "/admin/personal-information" },
  { key: "profile", title: "Profile", icon: UserRound, link: "/admin/profile" },
  { key: "publications", title: "Publications", icon: BookOpen, link: "/admin/publications" },
  { key: "conferences", title: "Conferences", icon: FileText, link: "/admin/conferences" },
  { key: "references", title: "References", icon: Send, link: "/admin/references" },
];

export default function AdminVisibility() {
  const [modules, setModules] = useState({});
  const [items, setItems] = useState({});
  const [openCategory, setOpenCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const settingsRes = await api.get("/settings");
      setModules(settingsRes.data?.data?.modules || {});

      const itemResults = await Promise.all(
        CONTENT_MODULES.map((m) =>
          api
            .get(m.endpoint)
            .then((r) => [m.key, r.data?.data || []])
            .catch(() => [m.key, []])
        )
      );

      setItems(Object.fromEntries(itemResults));
    } catch (e) {
      setError(e.response?.data?.message || "Unable to load visibility data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleModule = (key) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveModules = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/settings", { modules });
      setSuccess("Module visibility saved. Hidden modules are now removed from the public portfolio.");
    } catch (e) {
      setError(e.response?.data?.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const toggleItem = async (moduleConfig, item) => {
    try {
      await api.patch(`${moduleConfig.endpoint}/${item._id}/toggle`);

      setItems((prev) => ({
        ...prev,
        [moduleConfig.key]: prev[moduleConfig.key].map((x) =>
          x._id === item._id ? { ...x, visible: !x.visible } : x
        ),
      }));
    } catch (e) {
      setError(e.response?.data?.message || "Unable to change item visibility.");
    }
  };

  const itemLabel = (item, fields) => {
    for (const f of fields) {
      if (item[f]) return item[f];
    }
    return "Untitled record";
  };

  if (loading) {
    return (
      <div className="visibility-page">
        <div className="visibility-header">
          <div className="visibility-header-left">
            <span className="visibility-kicker">SYSTEM</span>
            <h2>Visibility Manager</h2>
          </div>
        </div>
        <p style={{ color: "#9aa4af", display: "flex", alignItems: "center", gap: 8 }}>
          <Loader2 size={16} className="spin" /> Loading visibility settings...
        </p>
      </div>
    );
  }

  return (
    <div className="visibility-page">
      <div className="visibility-header">
        <div className="visibility-header-left">
          <span className="visibility-kicker">SYSTEM</span>
          <h2>Visibility Manager</h2>
          <p>
            Control which modules appear on the public portfolio, and hide or
            show individual records inside each module.
          </p>
        </div>

        <div className="visibility-header-actions">
          <button type="button" className="visibility-reset-button" onClick={load} disabled={saving}>
            <RefreshCw size={16} /> Refresh
          </button>

          <button type="button" className="visibility-save-button" onClick={saveModules} disabled={saving}>
            <Save size={16} /> {saving ? "Saving..." : "Save Module Visibility"}
          </button>
        </div>
      </div>

      {error && <div className="visibility-info" style={{ borderColor: "#654047", color: "#f2c7cb" }}>{error}</div>}
      {success && <div className="visibility-info" style={{ borderColor: "#3d5a45", color: "#bfe3cb" }}>{success}</div>}

      <div className="visibility-protected">
        <ShieldCheck size={16} />
        Module toggles are saved to the database and enforced by the public
        API — hidden modules and hidden records are not returned publicly.
      </div>

      {/* ================= MODULE + ITEM CONTROL ================= */}
      <div className="visibility-list">
        {CONTENT_MODULES.map((moduleConfig) => {
          const Icon = moduleConfig.icon;
          const list = items[moduleConfig.key] || [];
          const isOpen = openCategory === moduleConfig.key;
          const moduleOn = modules[moduleConfig.settingsKey] !== false;

          return (
            <div className="visibility-category-header" key={moduleConfig.key}>
              <button
                type="button"
                className="category-main-button"
                onClick={() => setOpenCategory(isOpen ? null : moduleConfig.key)}
              >
                <div className="category-icon">
                  <Icon size={18} />
                </div>

                <div className="category-information">
                  <div className="category-title-row">
                    <strong>{moduleConfig.title}</strong>
                  </div>
                  <span>{list.length} record(s)</span>
                </div>

                <label
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 10 }}
                >
                  <input
                    type="checkbox"
                    checked={moduleOn}
                    onChange={() => toggleModule(moduleConfig.settingsKey)}
                  />
                  <small>{moduleOn ? "ON" : "OFF"}</small>
                </label>

                <span className="category-chevron">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </button>

              {isOpen && (
                <div className="category-items">
                  <div className="category-items-inner">
                    {list.length === 0 ? (
                      <p style={{ color: "#8a94a0", fontSize: 12 }}>No records yet.</p>
                    ) : (
                      list.map((item) => (
                        <div className="item-information" key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong>{itemLabel(item, moduleConfig.labelField)}</strong>
                            <p>{item.description || ""}</p>
                          </div>

                          <button
                            type="button"
                            className="item-action"
                            onClick={() => toggleItem(moduleConfig, item)}
                            title={item.visible === false ? "Show publicly" : "Hide publicly"}
                          >
                            {item.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                            {item.visible === false ? "Hidden" : "Public"}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= MODULES MANAGED ON DEDICATED PAGES ================= */}
      <div className="visibility-summary">
        <div className="summary-main">
          <span className="summary-icon">
            <ShieldCheck size={16} />
          </span>
          Other modules
        </div>

        <div className="visibility-special-grid">
          {SIMPLE_MODULES.map((m) => {
            const Icon = m.icon;
            const on = modules[m.key] !== false;

            return (
              <div className="special-module-card" key={m.key}>
                <div className="special-module-content">
                  <Icon size={16} />
                  <div>
                    <strong>{m.title}</strong>
                    <p>Item-level visibility is managed on its own page.</p>
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="checkbox" checked={on} onChange={() => toggleModule(m.key)} />
                  <small>{on ? "ON" : "OFF"}</small>
                </label>

                <Link className="special-module-link" to={m.link}>
                  Manage records
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="visibility-bottom-action">
        <button type="button" className="visibility-save-button" onClick={saveModules} disabled={saving}>
          <Save size={16} /> {saving ? "Saving..." : "Save Module Visibility"}
        </button>
      </div>
    </div>
  );
}
