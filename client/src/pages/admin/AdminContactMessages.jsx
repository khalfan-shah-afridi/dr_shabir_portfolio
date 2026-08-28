import React, { useEffect, useMemo, useState } from "react";
import {
  Mail,
  MailOpen,
  MailCheck,
  Search,
  Trash2,
  X,
  Reply,
  Clock,
  CheckCircle2,
} from "lucide-react";
import api from "../../services/api";
import "./AdminContactMessages.css";

const STATUS_META = {
  New: { label: "New / Unread", icon: Mail, className: "status-new" },
  Read: { label: "Seen", icon: MailOpen, className: "status-read" },
  Replied: { label: "Replied", icon: MailCheck, className: "status-replied" },
};

const formatDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? String(v)
    : d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

export default function AdminContactMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const r = await api.get("/contact");
      setItems(r.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Unable to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (x) =>
          (filter === "All" || x.status === filter) &&
          JSON.stringify(x).toLowerCase().includes(search.toLowerCase())
      ),
    [items, filter, search]
  );

  const counts = useMemo(
    () => ({
      All: items.length,
      New: items.filter((x) => x.status === "New").length,
      Read: items.filter((x) => x.status === "Read").length,
      Replied: items.filter((x) => x.status === "Replied").length,
    }),
    [items]
  );

  const open = async (item) => {
    setError("");
    try {
      // Opening a "New" message marks it as seen/read on the server.
      const r = await api.get(`/contact/${item._id}`);
      const updated = r.data?.data || item;
      setActive(updated);
      setItems((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
    } catch (e) {
      setError(e.response?.data?.message || "Could not open message.");
    }
  };

  const setStatus = async (id, status) => {
    try {
      const r = await api.patch(`/contact/${id}/status`, { status });
      const updated = r.data?.data;
      setItems((prev) => prev.map((x) => (x._id === id ? updated : x)));
      setActive((prev) => (prev && prev._id === id ? updated : prev));
    } catch (e) {
      setError(e.response?.data?.message || "Could not update status.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
      setActive((prev) => (prev && prev._id === id ? null : prev));
    } catch (e) {
      setError(e.response?.data?.message || "Could not delete message.");
    }
  };

  return (
    <div className="acm-page">
      <header className="acm-header">
        <div>
          <span>
            <Mail size={14} /> VISITOR INBOX
          </span>
          <h1>Contact Messages</h1>
          <p>Messages submitted through the public portfolio's contact form.</p>
        </div>
      </header>

      {error && <div className="acm-error">{error}</div>}

      <div className="acm-toolbar">
        <div className="acm-search">
          <Search size={16} />
          <input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="acm-filters">
          {["All", "New", "Read", "Replied"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f} <b>{counts[f] ?? 0}</b>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="acm-empty">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="acm-empty">No messages found.</div>
      ) : (
        <div className="acm-list">
          {filtered.map((x) => {
            const meta = STATUS_META[x.status] || STATUS_META.New;
            const Icon = meta.icon;
            return (
              <article
                key={x._id}
                className={`acm-card ${x.status === "New" ? "unread" : ""}`}
                onClick={() => open(x)}
              >
                <div className="acm-main">
                  <div className="acm-title">
                    <h3>{x.subject}</h3>
                    <span className={`acm-badge ${meta.className}`}>
                      <Icon size={12} /> {meta.label}
                    </span>
                  </div>
                  <div className="acm-from">
                    <b>{x.name}</b> · {x.email}
                  </div>
                  <p>{x.message}</p>
                  <small className="acm-time">
                    <Clock size={12} /> {formatDate(x.createdAt)}
                  </small>
                </div>

                <div className="acm-actions" onClick={(e) => e.stopPropagation()}>
                  {x.status !== "Replied" && (
                    <button
                      title="Mark as Replied"
                      onClick={() => setStatus(x._id, "Replied")}
                    >
                      <Reply size={16} />
                    </button>
                  )}
                  <button className="danger" title="Delete" onClick={() => remove(x._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {active && (
        <div className="acm-overlay" onClick={() => setActive(null)}>
          <div className="acm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acm-modal-head">
              <div>
                <span>
                  {(() => {
                    const meta = STATUS_META[active.status] || STATUS_META.New;
                    const Icon = meta.icon;
                    return (
                      <>
                        <Icon size={12} /> {meta.label}
                      </>
                    );
                  })()}
                </span>
                <h2>{active.subject}</h2>
              </div>
              <button type="button" onClick={() => setActive(null)}>
                <X />
              </button>
            </div>

            <div className="acm-modal-meta">
              <div>
                <b>{active.name}</b>
                <span>{active.email}</span>
              </div>
              <small>
                <Clock size={12} /> {formatDate(active.createdAt)}
              </small>
            </div>

            <div className="acm-modal-body">{active.message}</div>

            <div className="acm-modal-actions">
              <a className="acm-secondary" href={`mailto:${active.email}?subject=RE: ${encodeURIComponent(active.subject)}`}>
                <Reply size={16} /> Reply via Email
              </a>
              {active.status !== "Replied" && (
                <button
                  className="acm-primary"
                  onClick={() => setStatus(active._id, "Replied")}
                >
                  <CheckCircle2 size={16} /> Mark as Replied
                </button>
              )}
              <button className="acm-danger" onClick={() => remove(active._id)}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
