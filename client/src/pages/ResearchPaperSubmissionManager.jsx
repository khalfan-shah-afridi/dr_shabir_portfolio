import { useEffect, useState } from "react";
import {
  FileText,
  Upload,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Save,
  ExternalLink,
} from "lucide-react";

import "./ResearchPaperSubmissionManager.css";

const API_BASE_URL = "http://localhost:5000";

const API_URL =
  `${API_BASE_URL}/api/research-paper-submissions`;

const STATUS_OPTIONS = [
  "Under Review",
  "Accepted",
  "Rejected",
  "Accepted with Changes",
];

const emptyForm = {
  title: "",
  journal: "",
  authorName: "",
  submitDate: "",
  status: "Under Review",
  pdf: null,
};

function ResearchPaperSubmissionManager() {
  const [submissions, setSubmissions] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // FETCH SUBMISSIONS
  // =====================================================

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load research paper submissions."
        );
      }

      setSubmissions(
        result.data ||
          result.submissions ||
          []
      );
    } catch (err) {
      console.error(
        "Fetch Research Paper Submissions Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load research paper submissions."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      files,
    } = event.target;

    if (type === "file") {
      setForm((previous) => ({
        ...previous,
        [name]:
          files && files.length > 0
            ? files[0]
            : null,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (submission) => {
    setMessage("");
    setError("");

    setEditingId(submission._id);

    setForm({
      title:
        submission.title ||
        submission.paperTitle ||
        "",

      journal:
        submission.journal ||
        submission.journalName ||
        "",

      authorName:
        submission.authorName ||
        submission.author ||
        "",

      submitDate: submission.submitDate
        ? String(
            submission.submitDate
          ).substring(0, 10)
        : submission.submittedAt
        ? String(
            submission.submittedAt
          ).substring(0, 10)
        : "",

      status:
        submission.status ||
        "Under Review",

      pdf: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // SAVE / UPDATE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "journal",
        form.journal.trim()
      );

      formData.append(
        "authorName",
        form.authorName.trim()
      );

      formData.append(
        "submitDate",
        form.submitDate
      );

      formData.append(
        "status",
        form.status
      );

      if (form.pdf) {
        formData.append(
          "pdf",
          form.pdf
        );
      }

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save research paper submission."
        );
      }

      setMessage(
        editingId
          ? "Research paper submission updated successfully."
          : "Research paper submission added successfully."
      );

      resetForm();

      await fetchSubmissions();
    } catch (err) {
      console.error(
        "Save Research Paper Submission Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save research paper submission."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this research paper submission?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete research paper submission."
        );
      }

      setMessage(
        "Research paper submission deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchSubmissions();
    } catch (err) {
      console.error(
        "Delete Research Paper Submission Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete research paper submission."
      );
    }
  };

  // =====================================================
  // STATUS UPDATE
  // =====================================================

  const handleStatusChange = async (
    submission,
    newStatus
  ) => {
    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/${submission._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title:
              submission.title ||
              submission.paperTitle ||
              "",

            journal:
              submission.journal ||
              submission.journalName ||
              "",

            authorName:
              submission.authorName ||
              submission.author ||
              "",

            submitDate:
              submission.submitDate ||
              submission.submittedAt ||
              null,

            status: newStatus,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update submission status."
        );
      }

      setMessage(
        `Submission status changed to "${newStatus}".`
      );

      await fetchSubmissions();
    } catch (err) {
      console.error(
        "Status Update Error:",
        err
      );

      setError(
        err.message ||
          "Failed to update submission status."
      );
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  // =====================================================
  // GET PDF URL
  // =====================================================

  const getPdfUrl = (submission) => {
    const possibleUrl =
      submission.pdfUrl ||
      submission.pdf ||
      submission.fileUrl ||
      submission.paperPdf;

    if (!possibleUrl) {
      return null;
    }

    if (
      typeof possibleUrl === "string" &&
      possibleUrl.startsWith("http")
    ) {
      return possibleUrl;
    }

    if (
      typeof possibleUrl === "string"
    ) {
      return `${API_BASE_URL}${possibleUrl}`;
    }

    return null;
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "accepted";

      case "Rejected":
        return "rejected";

      case "Accepted with Changes":
        return "changes";

      case "Under Review":
      default:
        return "review";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="research-paper-submission-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="submission-page-header">

        <div>
          <div className="submission-eyebrow">
            ACADEMIC CONTENT
          </div>

          <h1>
            Research Paper Submissions
          </h1>

          <p>
            Manage submitted research papers,
            review their status and uploaded PDFs.
          </p>
        </div>

        <button
          type="button"
          className="submission-refresh-button"
          onClick={fetchSubmissions}
        >
          <RefreshCw size={16} />

          Refresh
        </button>

      </div>

      {/* =================================================
          MESSAGES
          ================================================= */}

      {message && (
        <div className="submission-success-message">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="submission-error-message">
          ⚠ {error}
        </div>
      )}

      {/* =================================================
          FORM CARD
          ================================================= */}

      <section className="submission-form-card">

        <div className="submission-card-header">

          <div>
            <span className="submission-section-label">
              PAPER DETAILS
            </span>

            <h2>
              {editingId
                ? "Edit Research Paper"
                : "Add Research Paper Submission"}
            </h2>

            <p>
              Enter the paper information and
              upload the research paper PDF.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="submission-cancel-top"
              onClick={resetForm}
            >
              <X size={16} />

              Cancel Edit
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="submission-form"
        >

          <div className="submission-form-grid">

            {/* PAPER TITLE */}

            <div className="submission-form-group full-width">

              <label htmlFor="title">
                Paper Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter research paper title"
                required
              />

            </div>

            {/* JOURNAL */}

            <div className="submission-form-group">

              <label htmlFor="journal">
                Journal Name
              </label>

              <input
                id="journal"
                name="journal"
                type="text"
                value={form.journal}
                onChange={handleChange}
                placeholder="Enter journal name"
                required
              />

            </div>

            {/* AUTHOR */}

            <div className="submission-form-group">

              <label htmlFor="authorName">
                Author Name
              </label>

              <input
                id="authorName"
                name="authorName"
                type="text"
                value={form.authorName}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />

            </div>

            {/* SUBMIT DATE */}

            <div className="submission-form-group">

              <label htmlFor="submitDate">
                Submit Date
              </label>

              <input
                id="submitDate"
                name="submitDate"
                type="date"
                value={form.submitDate}
                onChange={handleChange}
                required
              />

            </div>

            {/* STATUS */}

            <div className="submission-form-group">

              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>

            </div>

            {/* PDF */}

            <div className="submission-form-group full-width">

              <label htmlFor="pdf">
                Research Paper PDF
              </label>

              <div className="submission-file-box">

                <div className="submission-file-icon">
                  <Upload size={26} />
                </div>

                <div className="submission-file-info">

                  <strong>
                    Upload Research Paper
                  </strong>

                  <span>
                    PDF format is recommended.
                  </span>

                </div>

                <input
                  id="pdf"
                  name="pdf"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleChange}
                />

              </div>

              {form.pdf && (
                <div className="selected-pdf">

                  <FileText size={16} />

                  <span>
                    {form.pdf.name}
                  </span>

                </div>
              )}

            </div>

          </div>

          {/* FORM ACTIONS */}

          <div className="submission-form-actions">

            <button
              type="button"
              className="submission-clear-button"
              onClick={resetForm}
            >
              <X size={16} />

              Clear
            </button>

            <button
              type="submit"
              className="submission-save-button"
              disabled={saving}
            >
              <Save size={16} />

              {saving
                ? "Saving..."
                : editingId
                ? "Update Paper"
                : "Add Paper"}
            </button>

          </div>

        </form>

      </section>

      {/* =================================================
          SUBMISSION LIBRARY
          ================================================= */}

      <section className="submission-library">

        <div className="submission-library-header">

          <div>
            <span className="submission-section-label">
              LIBRARY
            </span>

            <h2>
              All Submitted Research Papers

              <span className="submission-count">
                {submissions.length}
              </span>
            </h2>

            <p>
              Review, update status, edit,
              delete and open submitted PDFs.
            </p>
          </div>

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="submission-loading">
            <RefreshCw size={22} />

            Loading research paper submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="submission-empty">

            <FileText size={42} />

            <h3>
              No Research Paper Submissions
            </h3>

            <p>
              No research papers have been
              submitted yet.
            </p>

          </div>
        ) : (
          <div className="submission-list">

            {submissions.map(
              (submission, index) => {

                const title =
                  submission.title ||
                  submission.paperTitle ||
                  "Untitled Research Paper";

                const journal =
                  submission.journal ||
                  submission.journalName ||
                  "Not specified";

                const author =
                  submission.authorName ||
                  submission.author ||
                  "Not specified";

                const submitDate =
                  submission.submitDate ||
                  submission.submittedAt;

                const status =
                  submission.status ||
                  "Under Review";

                const pdfUrl =
                  getPdfUrl(submission);

                return (
                  <article
                    key={
                      submission._id ||
                      index
                    }
                    className="submission-item"
                  >

                    {/* TOP */}

                    <div className="submission-item-top">

                      <div className="submission-number">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </div>

                      <div className="submission-title-area">

                        <h3>
                          {title}
                        </h3>

                        <span
                          className={`submission-status ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="submission-details">

                      <div className="submission-detail">

                        <span>
                          JOURNAL
                        </span>

                        <strong>
                          {journal}
                        </strong>

                      </div>

                      <div className="submission-detail">

                        <span>
                          AUTHOR
                        </span>

                        <strong>
                          {author}
                        </strong>

                      </div>

                      <div className="submission-detail">

                        <span>
                          SUBMIT DATE
                        </span>

                        <strong>
                          {formatDate(
                            submitDate
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* STATUS UPDATE */}

                    <div className="submission-status-control">

                      <label
                        htmlFor={`status-${submission._id}`}
                      >
                        Change Status
                      </label>

                      <select
                        id={`status-${submission._id}`}
                        value={status}
                        onChange={(event) =>
                          handleStatusChange(
                            submission,
                            event.target.value
                          )
                        }
                      >
                        {STATUS_OPTIONS.map(
                          (option) => (
                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>
                          )
                        )}
                      </select>

                    </div>

                    {/* ACTIONS */}

                    <div className="submission-actions">

                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="submission-action pdf"
                        >
                          <ExternalLink
                            size={15}
                          />

                          View PDF
                        </a>
                      )}

                      <button
                        type="button"
                        className="submission-action edit"
                        onClick={() =>
                          handleEdit(
                            submission
                          )
                        }
                      >
                        <Pencil size={15} />

                        Edit
                      </button>

                      <button
                        type="button"
                        className="submission-action delete"
                        onClick={() =>
                          handleDelete(
                            submission._id
                          )
                        }
                      >
                        <Trash2 size={15} />

                        Delete
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default ResearchPaperSubmissionManager;