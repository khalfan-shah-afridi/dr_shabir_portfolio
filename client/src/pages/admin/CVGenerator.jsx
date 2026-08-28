import React, { useEffect, useState } from "react";
import {
  FileDown,
  Loader2,
  ArrowUp,
  ArrowDown,
  Save,
  RefreshCw,
  Printer,
  FileText,
  CheckCircle2,
} from "lucide-react";

import api from "../../services/api";
import "./CVGenerator.css";

const dateRange = (start, end, current) => {
  const s = start || "";
  const e = current ? "Present" : end || "Present";
  if (!s && !e) return "";
  return `${s} — ${e}`;
};

export default function CVGenerator() {
  const [settings, setSettings] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [settingsResult, dataResult] = await Promise.allSettled([
        api.get("/cv/settings"),
        api.get("/cv/data"),
      ]);

      if (settingsResult.status === "fulfilled") {
        setSettings(settingsResult.value.data?.data || null);
      } else {
        setSettings(null);
      }

      if (dataResult.status === "fulfilled") {
        setData(dataResult.value.data?.data || null);
      } else {
        setData(null);
      }

      const failures = [settingsResult, dataResult].filter((r) => r.status === "rejected");
      if (failures.length) {
        const messages = failures.map(
          (f) => f.reason?.response?.data?.message || f.reason?.message || "Request failed"
        );
        setError(messages.join(" | "));
      }
    } catch (e) {
      setError(e.response?.data?.message || "Unable to load CV Generator.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSection = (key) => {
    setSettings((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.key === key ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const moveSection = (index, direction) => {
    setSettings((prev) => {
      const sections = [...prev.sections].sort((a, b) => a.order - b.order);
      const target = index + direction;
      if (target < 0 || target >= sections.length) return prev;

      const tmp = sections[index].order;
      sections[index].order = sections[target].order;
      sections[target].order = tmp;

      return { ...prev, sections };
    });
  };

  const updateField = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.put("/cv/settings", settings);
      setSettings(res.data?.data || settings);
      setSuccess("CV settings saved.");
    } catch (e) {
      setError(e.response?.data?.message || "Unable to save CV settings.");
    } finally {
      setSaving(false);
    }
  };

  const downloadPdf = async () => {
    setDownloading(true);
    setError("");

    try {
      const res = await api.get("/cv/download", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${(data?.personal?.fullName || "Professional_CV").replace(
        /[^a-zA-Z0-9_-]+/g,
        "_"
      )}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError("Unable to generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="cvgen-page">
        <p className="cvgen-loading">
          <Loader2 size={16} className="cvgen-spin" /> Loading CV Generator...
        </p>
      </div>
    );
  }

  // If settings failed to load (network/auth/server error), stop here and
  // show the error instead of crashing the page by reading settings.* below.
  if (!settings) {
    return (
      <div className="cvgen-page">
        <header className="cvgen-header">
          <div>
            <span>RESEARCH & CAREER</span>
            <h1>Auto CV Generator</h1>
            <p>Dynamically generates a professional CV from your live portfolio data.</p>
          </div>
          <div className="cvgen-header-actions">
            <button className="cvgen-secondary" onClick={load}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        </header>
        <div className="cvgen-alert error">
          {error || "Unable to load CV settings. Please check your connection and try again."}
        </div>
      </div>
    );
  }

  const hasEnoughData =
    (data?.personal?.fullName || data?.profile?.fullName) &&
    ((data?.education || []).length > 0 || (data?.experience || []).length > 0);

  const orderedSections = settings
    ? [...settings.sections].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="cvgen-page">
      <header className="cvgen-header">
        <div>
          <span>RESEARCH & CAREER</span>
          <h1>Auto CV Generator</h1>
          <p>Dynamically generates a professional CV from your live portfolio data.</p>
        </div>

        <div className="cvgen-header-actions">
          <button className="cvgen-secondary" onClick={load}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="cvgen-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Preview
          </button>
          <button className="cvgen-primary" onClick={downloadPdf} disabled={downloading}>
            <FileDown size={16} /> {downloading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </header>

      {error && <div className="cvgen-alert error">{error}</div>}
      {success && <div className="cvgen-alert success">{success}</div>}

      {!hasEnoughData && (
        <div className="cvgen-alert warn">
          There is not enough information to generate a complete CV. Please add
          the required profile, education, or experience information first.
        </div>
      )}

      <div className="cvgen-grid">
        {/* ===================== SETTINGS PANEL ===================== */}
        <div className="cvgen-panel">
          <h3>CV Settings</h3>

          <label className="cvgen-field">
            <span>CV Title</span>
            <input
              value={settings.cvTitle || ""}
              onChange={(e) => updateField("cvTitle", e.target.value)}
            />
          </label>

          <label className="cvgen-field">
            <span>Professional Summary</span>
            <textarea
              rows="4"
              value={settings.professionalSummary || ""}
              onChange={(e) => updateField("professionalSummary", e.target.value)}
              placeholder={data?.profile?.biography || "Short professional summary..."}
            />
          </label>

          <div className="cvgen-toggles">
            <label className="cvgen-check">
              <input
                type="checkbox"
                checked={settings.showProfileImage}
                onChange={(e) => updateField("showProfileImage", e.target.checked)}
              />
              <span>Show Profile Image</span>
            </label>
            <label className="cvgen-check">
              <input
                type="checkbox"
                checked={settings.showEmail}
                onChange={(e) => updateField("showEmail", e.target.checked)}
              />
              <span>Show Email</span>
            </label>
            <label className="cvgen-check">
              <input
                type="checkbox"
                checked={settings.showPhone}
                onChange={(e) => updateField("showPhone", e.target.checked)}
              />
              <span>Show Phone</span>
            </label>
            <label className="cvgen-check">
              <input
                type="checkbox"
                checked={settings.showAddress}
                onChange={(e) => updateField("showAddress", e.target.checked)}
              />
              <span>Show Address</span>
            </label>
            <label className="cvgen-check">
              <input
                type="checkbox"
                checked={settings.showSocialLinks}
                onChange={(e) => updateField("showSocialLinks", e.target.checked)}
              />
              <span>Show Social Links</span>
            </label>
          </div>

          <p className="cvgen-hint">
            Father Name, Date of Birth, Marital Status, Nationality, CNIC No,
            Passport No and Religion are always included on the CV whenever
            they are filled in on the Profile page — fill them in there to
            have them appear here.
          </p>

          <h4>CV Sections &amp; Order</h4>
          <div className="cvgen-sections">
            {orderedSections.map((s, i) => (
              <div className="cvgen-section-row" key={s.key}>
                <label className="cvgen-check">
                  <input
                    type="checkbox"
                    checked={s.enabled !== false}
                    onChange={() => toggleSection(s.key)}
                  />
                  <span>{s.label}</span>
                </label>

                <div className="cvgen-reorder">
                  <button
                    type="button"
                    onClick={() => moveSection(i, -1)}
                    disabled={i === 0}
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(i, 1)}
                    disabled={i === orderedSections.length - 1}
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="cvgen-primary full" onClick={save} disabled={saving}>
            <Save size={16} /> {saving ? "Saving..." : "Save CV Settings"}
          </button>
        </div>

        {/* ===================== LIVE PREVIEW ===================== */}
        <div className="cvgen-preview-wrap">
          <h3>
            <FileText size={16} /> Live Preview
          </h3>

          <div className="cvgen-preview" id="cv-preview-area">
            <div className="cvp-header">
              <h1>{data?.personal?.fullName || data?.profile?.fullName}</h1>
              <p>
                {[data?.personal?.designation, data?.personal?.institution]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            {orderedSections
              .filter((s) => s.enabled !== false)
              .map((s) => (
                <PreviewSection key={s.key} section={s} data={data} settings={settings} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Renders one Experience entry, shared by every category-specific
// section below so Teaching / Administration / Focal Person / Project
// Director / Additional Experience all look consistent.
const ExperienceEntry = (e) => (
  <div className="cvp-entry" key={e._id}>
    <div className="cvp-entry-head">
      <strong>{e.position}</strong>
      <span>{dateRange(e.startDate, e.endDate, e.current)}</span>
    </div>
    <small>{[e.organization, e.department].filter(Boolean).join(" — ")}</small>
    {e.description && <p>{e.description}</p>}
  </div>
);

const CertificateEntry = (c) => (
  <div className="cvp-entry" key={c._id}>
    <strong>{c.title}</strong>
    {(c.issuer || c.issueDate) && (
      <small>{[c.issuer, c.issueDate].filter(Boolean).join(" — ")}</small>
    )}
  </div>
);

function PreviewSection({ section, data, settings }) {
  const key = section.key;

  const renderBody = () => {
    switch (key) {
      case "personalInformation": {
        const p = data?.personal || {};
        const pr = data?.profile || {};
        return (
          <ul>
            {pr.fatherName && <li>Father Name: {pr.fatherName}</li>}
            {pr.gender && <li>Gender: {pr.gender}</li>}
            {pr.dateOfBirth && (
              <li>Date of Birth: {new Date(pr.dateOfBirth).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}</li>
            )}
            {pr.maritalStatus && <li>Marital Status: {pr.maritalStatus}</li>}
            {pr.nationality && <li>Nationality: {pr.nationality}</li>}
            {pr.cnic && <li>CNIC No: {pr.cnic}</li>}
            {pr.passportNumber && <li>Passport No: {pr.passportNumber}</li>}
            {pr.religion && <li>Religion: {pr.religion}</li>}
            {settings.showEmail && p.email && <li>Email: {p.email}</li>}
            {settings.showPhone && p.phone && <li>Phone: {p.phone}</li>}
            {settings.showAddress && pr.permanentAddress && <li>Permanent Address: {pr.permanentAddress}</li>}
            {settings.showAddress && pr.currentAddress && pr.currentAddress !== pr.permanentAddress && (
              <li>Current Address: {pr.currentAddress}</li>
            )}
            {!settings.showAddress && p.location && <li>Location: {p.location}</li>}
          </ul>
        );
      }
      case "professionalSummary":
        return <p>{settings.professionalSummary || data?.profile?.biography || "—"}</p>;
      case "education":
        return (data?.education || []).map((e) => (
          <div className="cvp-entry" key={e._id}>
            <div className="cvp-entry-head">
              <strong>{e.degree}</strong>
              <span>
                {e.startYear} — {e.endYear || "Present"}
              </span>
            </div>
            <small>{e.institution}</small>
          </div>
        ));
      case "teachingExperience":
        return (data?.experience || []).filter((e) => (e.category || "General") === "Teaching").map(ExperienceEntry);
      case "administrationExperience":
        return (data?.experience || []).filter((e) => (e.category || "General") === "Administration").map(ExperienceEntry);
      case "focalPerson":
        return (data?.experience || []).filter((e) => (e.category || "General") === "Focal Person").map(ExperienceEntry);
      case "projectDirector":
        return (data?.experience || []).filter((e) => (e.category || "General") === "Project Director").map(ExperienceEntry);
      case "generalExperience":
        return (data?.experience || []).filter((e) => (e.category || "General") === "General").map(ExperienceEntry);
      case "internationalCertifications":
        return (data?.certificates || []).filter((c) => c.category === "International Certification").map(CertificateEntry);
      case "facultyTraining":
        return (data?.certificates || []).filter((c) => c.category === "Higher Education Faculty Training").map(CertificateEntry);
      case "nationalCertifications":
        return (data?.certificates || []).filter((c) => c.category === "National Certification").map(CertificateEntry);
      case "otherCertifications":
        return (data?.certificates || []).filter((c) => (c.category || "Other") === "Other").map(CertificateEntry);
      case "conferences":
        return (data?.conferences || []).map((c) => (
          <div className="cvp-entry" key={c._id}>
            <div className="cvp-entry-head">
              <strong>{c.title || c.name}</strong>
              {c.type && <span>{c.type}</span>}
            </div>
            <small>{[c.role, c.organizer, c.location].filter(Boolean).join(" — ")}</small>
          </div>
        ));
      case "researchResources":
        return (data?.researchResources || []).map((r) => (
          <div className="cvp-entry" key={r._id}>
            <strong>{r.title}</strong> {r.year && `— ${r.year}`}
          </div>
        ));
      case "projectWins":
        return (data?.projectWins || data?.grants || []).map((g) => (
          <div className="cvp-entry" key={g._id}>
            <strong>{g.title}</strong>
            {(g.organization || g.fundingAmount || g.year) && (
              <small>
                {[g.organization, g.fundingAmount && `Funding: ${g.fundingAmount}`, g.year]
                  .filter(Boolean)
                  .join(" — ")}
              </small>
            )}
          </div>
        ));
      case "publications":
        return (data?.publications || []).map((p, i) => (
          <div className="cvp-entry" key={p._id}>
            <strong>
              {i + 1}. {p.title}
            </strong>
            {(p.authors || p.journal) && (
              <small>{[p.authors, p.journal].filter(Boolean).join(" — ")}</small>
            )}
          </div>
        ));
      case "supervision":
        return (data?.supervision || []).map((s) => (
          <div className="cvp-entry" key={s._id}>
            <strong>{s.title}</strong>
            {(s.student || s.year) && <small>{[s.student, s.year].filter(Boolean).join(" — ")}</small>}
          </div>
        ));
      case "researchInterests":
        return <p>{(data?.researchInterests || []).join("  •  ")}</p>;
      case "skills":
        return <p>{(data?.skills || []).map((s) => s.name).join("  •  ")}</p>;
      case "projects":
        return (data?.projects || []).map((p) => (
          <div className="cvp-entry" key={p._id}>
            <strong>
              {p.projectId ? `${p.projectId} · ` : ""}
              {p.title}
            </strong>
          </div>
        ));
      case "awards":
        return (data?.awards || []).map((a) => (
          <div className="cvp-entry" key={a._id}>
            <strong>{a.title}</strong> — {a.organization} ({a.year})
          </div>
        ));
      case "reviewer":
        return (data?.reviewer || []).map((r, i) => (
          <div className="cvp-entry" key={r._id}>
            {i + 1}. {r.journal} {r.year && `— ${r.year}`}
          </div>
        ));
      case "references":
        return (data?.references || []).map((r) => (
          <div className="cvp-entry" key={r._id}>
            <strong>{r.name}</strong> — {r.designation}
          </div>
        ));
      default:
        return null;
    }
  };

  const body = renderBody();

  if (Array.isArray(body) && body.length === 0) return null;
  if (body === null) return null;

  return (
    <div className="cvp-section">
      <h2>{section.label}</h2>
      {body}
    </div>
  );
}
