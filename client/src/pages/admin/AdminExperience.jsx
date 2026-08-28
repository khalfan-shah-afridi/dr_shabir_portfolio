import React, { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Search, Star } from "lucide-react";
import api from "../../services/api";
import "./ContentManager.css";

const ENDPOINT = "/experience";

const EMPTY_FORM = {
  position: "",
  organization: "",
  department: "",
  category: "General",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  visible: true,
  featured: false,
  order: 0,
};

const formatDate = (value) => {
  if (!value) return "Present";
  return value;
};

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const r = await api.get(ENDPOINT);
      setItems(r.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load experience records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((x) =>
        JSON.stringify(x).toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  const add = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
    setError("");
  };

  const edit = (item) => {
    setEditing(item._id);
    setForm({
      position: item.position || "",
      organization: item.organization || "",
      department: item.department || "",
      category: item.category || "General",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      current: !!item.current,
      description: item.description || "",
      visible: item.visible !== false,
      featured: !!item.featured,
      order: item.order || 0,
    });
    setOpen(true);
    setError("");
  };

  const change = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Currently Working ON -> End Date becomes irrelevant/disabled.
      if (key === "current" && value === true) {
        next.endDate = "";
      }
      return next;
    });
  };

  const save = async (e) => {
    e.preventDefault();

    if (!form.position.trim() || !form.organization.trim() || !form.startDate.trim()) {
      setError("Position, Organization and Start Date are required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        endDate: form.current ? null : form.endDate || null,
        order: Number(form.order) || 0,
      };

      if (editing) {
        await api.put(`${ENDPOINT}/${editing}`, payload);
      } else {
        await api.post(ENDPOINT, payload);
      }

      setOpen(false);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not save experience");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not delete experience");
    }
  };

  const toggleVisible = async (id) => {
    try {
      await api.patch(`${ENDPOINT}/${id}/toggle`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not change visibility");
    }
  };

  const toggleFeatured = async (item) => {
    try {
      await api.put(`${ENDPOINT}/${item._id}`, { featured: !item.featured });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not change featured status");
    }
  };

  return (
    <div className="cm-page">
      <header className="cm-header">
        <div>
          <span>PORTFOLIO CONTENT</span>
          <h1>Experience</h1>
          <p>Manage professional and academic experience</p>
        </div>
        <button className="cm-primary" onClick={add}>
          <Plus size={17} /> Add Experience
        </button>
      </header>

      {error && <div className="cm-error">{error}</div>}

      <div className="cm-toolbar">
        <div className="cm-search">
          <Search size={16} />
          <input
            placeholder="Search experience..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <small>{filtered.length} record(s)</small>
      </div>

      {loading ? (
        <div className="cm-empty">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="cm-empty">No experience records found.</div>
      ) : (
        <div className="cm-list">
          {filtered.map((item) => (
            <article className="cm-card" key={item._id}>
              <div className="cm-main">
                <div className="cm-title">
                  <h3>{item.position}</h3>
                  <span>
                    {item.organization}
                    {item.department ? ` · ${item.department}` : ""} {item.category ? ` · ${item.category}` : ""}
                  </span>
                </div>

                <p style={{ fontSize: 12, color: "#8a94a0", margin: "4px 0" }}>
                  {item.startDate} — {item.current ? "Present" : formatDate(item.endDate)}
                </p>

                <p>{item.description || "No description provided."}</p>

                <div className="cm-tags">
                  {item.current && <b>Current Position</b>}
                  {item.featured && (
                    <b>
                      <Star size={12} /> Featured
                    </b>
                  )}
                  <b className={item.visible === false ? "off" : "on"}>
                    {item.visible === false ? <EyeOff size={12} /> : <Eye size={12} />}{" "}
                    {item.visible === false ? "Hidden" : "Public"}
                  </b>
                </div>
              </div>

              <div className="cm-actions">
                <button
                  title={item.visible === false ? "Show publicly" : "Hide publicly"}
                  onClick={() => toggleVisible(item._id)}
                >
                  {item.visible === false ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
                <button title="Toggle featured" onClick={() => toggleFeatured(item)}>
                  <Star size={17} fill={item.featured ? "currentColor" : "none"} />
                </button>
                <button title="Edit" onClick={() => edit(item)}>
                  <Pencil size={17} />
                </button>
                <button className="danger" title="Delete" onClick={() => remove(item._id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {open && (
        <div className="cm-overlay">
          <form className="cm-modal" onSubmit={save}>
            <div className="cm-modal-head">
              <div>
                <span>{editing ? "EDIT RECORD" : "NEW RECORD"}</span>
                <h2>{editing ? "Edit Experience" : "Add Experience"}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="cm-form">
              <label>
                <span>Position *</span>
                <input
                  value={form.position}
                  onChange={(e) => change("position", e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Organization *</span>
                <input
                  value={form.organization}
                  onChange={(e) => change("organization", e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Department</span>
                <input
                  value={form.department}
                  onChange={(e) => change("department", e.target.value)}
                />
              </label>

              <label>
                <span>Category</span>
                <select value={form.category} onChange={(e) => change("category", e.target.value)}>
                  {["Teaching","Administration","Focal Person","Project Director","General"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </label>

              <label>
                <span>Start Date *</span>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={form.startDate}
                  onChange={(e) => change("startDate", e.target.value)}
                  required
                />
              </label>

              <label className="cm-check">
                <input
                  type="checkbox"
                  checked={form.current}
                  onChange={(e) => change("current", e.target.checked)}
                />
                <span>Currently Working Here</span>
              </label>

              <label>
                <span>End Date {form.current ? "(disabled — currently working)" : ""}</span>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={form.current ? "" : form.endDate}
                  disabled={form.current}
                  onChange={(e) => change("endDate", e.target.value)}
                />
              </label>

              <label>
                <span>Description</span>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => change("description", e.target.value)}
                />
              </label>

              <label className="cm-check">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => change("visible", e.target.checked)}
                />
                <span>Public Visibility</span>
              </label>

              <label className="cm-check">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => change("featured", e.target.checked)}
                />
                <span>Featured</span>
              </label>

              <label>
                <span>Display Order</span>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => change("order", e.target.value)}
                />
              </label>
            </div>

            <div className="cm-modal-actions">
              <button type="button" className="cm-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="cm-primary" disabled={saving}>
                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
