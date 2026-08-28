import { useEffect, useState } from "react";
import { motion } from "motion/react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

import api from "../../services/api";

import "./AdminContent.css";

const emptyForm = {
  title: "",
  type: "International",
  organizer: "",
  location: "",
  country: "",
  startDate: "",
  endDate: "",
  role: "",
  paperTitle: "",
  description: "",
  websiteUrl: "",
};

function AdminConferences() {
  const [conferences, setConferences] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [form, setForm] =
    useState(emptyForm);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD CONFERENCES
  // ==========================================
  const loadConferences = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/conferences");

      setConferences(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Load conferences error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load conferences."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConferences();
  }, []);

  // ==========================================
  // OPEN ADD
  // ==========================================
  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================
  const openEdit = (conference) => {
    setEditingId(conference._id);

    setForm({
      title: conference.title || "",

      type:
        conference.type ||
        "International",

      organizer:
        conference.organizer || "",

      location:
        conference.location || "",

      country:
        conference.country || "",

      startDate: conference.startDate
        ? conference.startDate.substring(
            0,
            10
          )
        : "",

      endDate: conference.endDate
        ? conference.endDate.substring(
            0,
            10
          )
        : "",

      role:
        conference.role || "",

      paperTitle:
        conference.paperTitle || "",

      description:
        conference.description || "",

      websiteUrl:
        conference.websiteUrl || "",
    });

    setError("");
    setModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================
  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE
  // ==========================================
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (
      !form.title.trim() ||
      !form.organizer.trim() ||
      !form.startDate
    ) {
      setError(
        "Conference title, organizer and start date are required."
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,

        startDate:
          form.startDate,

        endDate:
          form.endDate || null,
      };

      if (editingId) {
        await api.put(
          `/conferences/${editingId}`,
          payload
        );
      } else {
        await api.post(
          "/conferences",
          payload
        );
      }

      await loadConferences();

      closeModal();
    } catch (error) {
      console.error(
        "Save conference error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to save conference."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================
  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this conference?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/conferences/${id}`
      );

      await loadConferences();
    } catch (error) {
      console.error(
        "Delete conference error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to delete conference."
      );
    }
  };

  // ==========================================
  // TOGGLE VISIBILITY
  // ==========================================
  const handleToggleVisibility =
    async (id) => {
      try {
        setError("");

        await api.patch(
          `/conferences/${id}/toggle-visibility`
        );

        await loadConferences();
      } catch (error) {
        console.error(
          "Toggle visibility error:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Unable to update conference visibility."
        );
      }
    };

  // ==========================================
  // SEARCH
  // ==========================================
  const query =
    search.trim().toLowerCase();

  const filteredConferences =
    conferences.filter(
      (conference) => {
        if (!query) {
          return true;
        }

        return (
          conference.title
            ?.toLowerCase()
            .includes(query) ||
          conference.organizer
            ?.toLowerCase()
            .includes(query) ||
          conference.type
            ?.toLowerCase()
            .includes(query) ||
          conference.location
            ?.toLowerCase()
            .includes(query) ||
          conference.country
            ?.toLowerCase()
            .includes(query)
        );
      }
    );

  return (
    <div className="content-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}
      <motion.div
        className="content-page-header"
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <div>
          <span>
            PROFESSIONAL DATA
          </span>

          <h2>
            Conferences
          </h2>

          <p>
            Manage international, national,
            local and online conferences.
          </p>
        </div>

        <button
          type="button"
          className="content-primary-button"
          onClick={openAdd}
        >
          <Plus size={18} />
          Add Conference
        </button>
      </motion.div>

      {/* ======================================
          ERROR
      ====================================== */}
      {error && (
        <div className="content-error">
          {error}
        </div>
      )}

      {/* ======================================
          TOOLBAR
      ====================================== */}
      <div className="content-toolbar">

        <div className="content-search">
          <Search size={17} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search conferences..."
          />
        </div>

        <span className="content-count">
          {conferences.length} conference(s)
        </span>

      </div>

      {/* ======================================
          LIST
      ====================================== */}
      {loading ? (
        <div className="content-empty">
          <h3>
            Loading conferences...
          </h3>
        </div>
      ) : filteredConferences.length ===
        0 ? (
        <div className="content-empty">
          <h3>
            No conferences found
          </h3>

          <p>
            Click “Add Conference” to create
            your first conference.
          </p>
        </div>
      ) : (
        <div className="content-list">

          {filteredConferences.map(
            (conference) => (
              <motion.div
                key={conference._id}
                className="content-card glass-card"
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                whileHover={{
                  y: -3,
                }}
              >

                <div className="content-card-main">

                  <div className="content-avatar conference-avatar">
                    {conference.type
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "C"}
                  </div>

                  <div>

                    <div className="content-title-row">

                      <h3>
                        {
                          conference.title
                        }
                      </h3>

                      <span className="type-badge">
                        {conference.type}
                      </span>

                      <span
                        className={
                          conference.isVisible
                            ? "visible-badge"
                            : "hidden-badge"
                        }
                      >
                        {conference.isVisible
                          ? "VISIBLE"
                          : "HIDDEN"}
                      </span>

                    </div>

                    <p>
                      {
                        conference.organizer
                      }
                      {" • "}
                      {
                        conference.location ||
                        conference.country
                      }
                    </p>

                    <span>
                      {conference.role ||
                        "Participant"}
                    </span>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="content-actions">

                  <button
                    type="button"
                    title={
                      conference.isVisible
                        ? "Hide conference"
                        : "Show conference"
                    }
                    onClick={() =>
                      handleToggleVisibility(
                        conference._id
                      )
                    }
                  >
                    {conference.isVisible ? (
                      <Eye size={17} />
                    ) : (
                      <EyeOff size={17} />
                    )}
                  </button>

                  <button
                    type="button"
                    title="Edit conference"
                    onClick={() =>
                      openEdit(
                        conference
                      )
                    }
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    className="danger-action"
                    title="Delete conference"
                    onClick={() =>
                      handleDelete(
                        conference._id
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </motion.div>
            )
          )}

        </div>
      )}

      {/* ======================================
          ADD / EDIT MODAL
      ====================================== */}
      {modalOpen && (
        <div className="content-modal-backdrop">

          <motion.div
            className="content-modal large-modal"
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 16,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
          >

            {/* HEADER */}
            <div className="modal-header">

              <div>
                <span>
                  CONFERENCE MANAGEMENT
                </span>

                <h3>
                  {editingId
                    ? "Edit Conference"
                    : "Add Conference"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={19} />
              </button>

            </div>

            {/* ERROR */}
            {error && (
              <div className="content-error">
                {error}
              </div>
            )}

            {/* FORM */}
            <form
              className="content-form"
              onSubmit={handleSubmit}
            >

              <div className="form-grid">

                <label>
                  Conference Title *
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Conference title"
                  />
                </label>

                <label>
                  Conference Type *
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="International">
                      International
                    </option>

                    <option value="National">
                      National
                    </option>

                    <option value="Local">
                      Local
                    </option>

                    <option value="Online">
                      Online
                    </option>
                  </select>
                </label>

                <label>
                  Organizer *
                  <input
                    type="text"
                    name="organizer"
                    value={
                      form.organizer
                    }
                    onChange={handleChange}
                    placeholder="Organizer / Organization"
                  />
                </label>

                <label>
                  Role
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Presenter / Participant"
                  />
                </label>

                <label>
                  Location
                  <input
                    type="text"
                    name="location"
                    value={
                      form.location
                    }
                    onChange={handleChange}
                    placeholder="City / Venue"
                  />
                </label>

                <label>
                  Country
                  <input
                    type="text"
                    name="country"
                    value={
                      form.country
                    }
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </label>

                <label>
                  Start Date *
                  <input
                    type="date"
                    name="startDate"
                    value={
                      form.startDate
                    }
                    onChange={handleChange}
                  />
                </label>

                <label>
                  End Date
                  <input
                    type="date"
                    name="endDate"
                    value={
                      form.endDate
                    }
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Paper Title
                  <input
                    type="text"
                    name="paperTitle"
                    value={
                      form.paperTitle
                    }
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </label>

                <label>
                  Website URL
                  <input
                    type="url"
                    name="websiteUrl"
                    value={
                      form.websiteUrl
                    }
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </label>

              </div>

              <label>
                Description
                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  rows="4"
                  placeholder="Conference description..."
                />
              </label>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="content-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Add Conference"}
                </button>

              </div>

            </form>

          </motion.div>

        </div>
      )}

    </div>
  );
}

export default AdminConferences;