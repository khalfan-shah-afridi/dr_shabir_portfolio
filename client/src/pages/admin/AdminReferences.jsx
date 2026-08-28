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
  name: "",
  institution: "",
  designation: "",
  department: "",
  contactEmail: "",
  phone: "",
  relationship: "",
  profileUrl: "",
  message: "",
};

function AdminReferences() {
  const [references, setReferences] =
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
  // LOAD REFERENCES
  // ==========================================
  const loadReferences = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/references");

      setReferences(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Load references error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load references."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReferences();
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
  const openEdit = (reference) => {
    setEditingId(reference._id);

    setForm({
      name: reference.name || "",
      institution:
        reference.institution || "",
      designation:
        reference.designation || "",
      department:
        reference.department || "",
      contactEmail:
        reference.contactEmail || "",
      phone: reference.phone || "",
      relationship:
        reference.relationship || "",
      profileUrl:
        reference.profileUrl || "",
      message:
        reference.message || "",
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
      !form.name.trim() ||
      !form.institution.trim() ||
      !form.designation.trim() ||
      !form.contactEmail.trim()
    ) {
      setError(
        "Name, institution, designation and contact email are required."
      );

      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(
          `/references/${editingId}`,
          form
        );
      } else {
        await api.post(
          "/references",
          form
        );
      }

      await loadReferences();

      closeModal();
    } catch (error) {
      console.error(
        "Save reference error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to save reference."
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
        "Are you sure you want to delete this reference?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/references/${id}`
      );

      await loadReferences();
    } catch (error) {
      console.error(
        "Delete reference error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to delete reference."
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
          `/references/${id}/toggle-visibility`
        );

        await loadReferences();
      } catch (error) {
        console.error(
          "Toggle visibility error:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Unable to update visibility."
        );
      }
    };

  // ==========================================
  // SEARCH
  // ==========================================
  const query =
    search.trim().toLowerCase();

  const filteredReferences =
    references.filter((reference) => {
      if (!query) {
        return true;
      }

      return (
        reference.name
          ?.toLowerCase()
          .includes(query) ||
        reference.institution
          ?.toLowerCase()
          .includes(query) ||
        reference.designation
          ?.toLowerCase()
          .includes(query) ||
        reference.contactEmail
          ?.toLowerCase()
          .includes(query)
      );
    });

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
            References
          </h2>

          <p>
            Manage academic and professional
            references.
          </p>
        </div>

        <button
          type="button"
          className="content-primary-button"
          onClick={openAdd}
        >
          <Plus size={18} />
          Add Reference
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
            placeholder="Search references..."
          />
        </div>

        <span className="content-count">
          {references.length} reference(s)
        </span>
      </div>

      {/* ======================================
          LIST
      ====================================== */}
      {loading ? (
        <div className="content-empty">
          <h3>
            Loading references...
          </h3>
        </div>
      ) : filteredReferences.length ===
        0 ? (
        <div className="content-empty">
          <h3>
            No references found
          </h3>

          <p>
            Click “Add Reference” to create
            your first record.
          </p>
        </div>
      ) : (
        <div className="content-list">

          {filteredReferences.map(
            (reference) => (
              <motion.div
                key={reference._id}
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

                  <div className="content-avatar">
                    {reference.name
                      ?.charAt(0)
                      ?.toUpperCase() || "R"}
                  </div>

                  <div>

                    <div className="content-title-row">

                      <h3>
                        {reference.name}
                      </h3>

                      <span
                        className={
                          reference.isVisible
                            ? "visible-badge"
                            : "hidden-badge"
                        }
                      >
                        {reference.isVisible
                          ? "VISIBLE"
                          : "HIDDEN"}
                      </span>

                    </div>

                    <p>
                      {reference.designation}
                      {" • "}
                      {reference.institution}
                    </p>

                    <span>
                      {reference.contactEmail}
                    </span>

                  </div>
                </div>

                {/* ACTIONS */}
                <div className="content-actions">

                  <button
                    type="button"
                    title={
                      reference.isVisible
                        ? "Hide reference"
                        : "Show reference"
                    }
                    onClick={() =>
                      handleToggleVisibility(
                        reference._id
                      )
                    }
                  >
                    {reference.isVisible ? (
                      <Eye size={17} />
                    ) : (
                      <EyeOff size={17} />
                    )}
                  </button>

                  <button
                    type="button"
                    title="Edit reference"
                    onClick={() =>
                      openEdit(reference)
                    }
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    className="danger-action"
                    title="Delete reference"
                    onClick={() =>
                      handleDelete(
                        reference._id
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
            className="content-modal"
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

            {/* MODAL HEADER */}
            <div className="modal-header">

              <div>
                <span>
                  REFERENCE MANAGEMENT
                </span>

                <h3>
                  {editingId
                    ? "Edit Reference"
                    : "Add Reference"}
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

            {/* MODAL ERROR */}
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
                  Name *
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Teacher / Professor name"
                  />
                </label>

                <label>
                  Institution *
                  <input
                    type="text"
                    name="institution"
                    value={
                      form.institution
                    }
                    onChange={handleChange}
                    placeholder="University / Institution"
                  />
                </label>

                <label>
                  Designation *
                  <input
                    type="text"
                    name="designation"
                    value={
                      form.designation
                    }
                    onChange={handleChange}
                    placeholder="Professor / Associate Professor"
                  />
                </label>

                <label>
                  Department
                  <input
                    type="text"
                    name="department"
                    value={
                      form.department
                    }
                    onChange={handleChange}
                    placeholder="Department"
                  />
                </label>

                <label>
                  Contact Email *
                  <input
                    type="email"
                    name="contactEmail"
                    value={
                      form.contactEmail
                    }
                    onChange={handleChange}
                    placeholder="teacher@example.com"
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Optional phone"
                  />
                </label>

                <label>
                  Relationship
                  <input
                    type="text"
                    name="relationship"
                    value={
                      form.relationship
                    }
                    onChange={handleChange}
                    placeholder="Academic Reference"
                  />
                </label>

                <label>
                  Profile URL
                  <input
                    type="url"
                    name="profileUrl"
                    value={
                      form.profileUrl
                    }
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </label>

              </div>

              <label>
                Message
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Short reference description..."
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
                    : "Add Reference"}
                </button>

              </div>

            </form>

          </motion.div>

        </div>
      )}

    </div>
  );
}

export default AdminReferences;