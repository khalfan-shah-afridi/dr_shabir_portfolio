import { useEffect, useState } from "react";

import {
  FileText,
  Upload,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import "./ResearchPublicationManager.css";

const API_BASE_URL = "http://localhost:5000";

const emptyForm = {
  title: "",
  authors: "",
  journal: "",
  volume: "",
  issue: "",
  pages: "",
  publicationDate: "",
  doi: "",
  keywords: "",
  abstract: "",
  paperUrl: "",
  citation: "",
  isVisible: true,
  pdf: null,
};

function ResearchPublicationManager() {
  const [publications, setPublications] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =====================================================
  // FETCH PUBLICATIONS
  // =====================================================

  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/research-publications`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load research publications."
        );
      }

      setPublications(
        data.data ||
          data.publications ||
          []
      );
    } catch (err) {
      console.error(
        "Fetch Publications Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load research publications."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchPublications();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
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

    if (type === "checkbox") {
      setForm((previous) => ({
        ...previous,
        [name]: checked,
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

    setShowForm(false);
  };

  // =====================================================
  // ADD NEW
  // =====================================================

  const handleAddNew = () => {
    setMessage("");
    setError("");

    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (publication) => {
    setMessage("");
    setError("");

    setEditingId(publication._id);

    setForm({
      title: publication.title || "",

      authors:
        publication.authors || "",

      journal:
        publication.journal || "",

      volume:
        publication.volume || "",

      issue:
        publication.issue || "",

      pages:
        publication.pages || "",

      publicationDate:
        publication.publicationDate
          ? String(
              publication.publicationDate
            ).substring(0, 10)
          : "",

      doi:
        publication.doi || "",

      keywords:
        Array.isArray(
          publication.keywords
        )
          ? publication.keywords.join(
              ", "
            )
          : publication.keywords || "",

      abstract:
        publication.abstract || "",

      paperUrl:
        publication.paperUrl || "",

      citation:
        publication.citation || "",

      isVisible:
        publication.isVisible !==
        undefined
          ? publication.isVisible
          : true,

      pdf: null,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // GENERATE CITATION
  // =====================================================

  const generateCitation = () => {
    const authors =
      form.authors.trim();

    const title =
      form.title.trim();

    const journal =
      form.journal.trim();

    const year = form.publicationDate
      ? new Date(
          form.publicationDate
        ).getFullYear()
      : "";

    let journalPart = journal;

    if (year) {
      journalPart += ` ${year}`;
    }

    if (form.volume) {
      journalPart += `;${form.volume}`;
    }

    if (form.issue) {
      journalPart += `(${form.issue})`;
    }

    if (form.pages) {
      journalPart += `:${form.pages}`;
    }

    const generated =
      `${authors}. ${title}. ${journalPart}.`;

    setForm((previous) => ({
      ...previous,
      citation: generated,
    }));
  };

  // =====================================================
  // SAVE PUBLICATION
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);

    setMessage("");

    setError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "authors",
        form.authors
      );

      formData.append(
        "journal",
        form.journal
      );

      formData.append(
        "volume",
        form.volume
      );

      formData.append(
        "issue",
        form.issue
      );

      formData.append(
        "pages",
        form.pages
      );

      formData.append(
        "publicationDate",
        form.publicationDate
      );

      formData.append(
        "doi",
        form.doi
      );

      formData.append(
        "keywords",
        form.keywords
      );

      formData.append(
        "abstract",
        form.abstract
      );

      formData.append(
        "paperUrl",
        form.paperUrl
      );

      formData.append(
        "citation",
        form.citation
      );

      formData.append(
        "isVisible",
        String(form.isVisible)
      );

      if (form.pdf) {
        formData.append(
          "pdf",
          form.pdf
        );
      }

      const url = editingId
        ? `${API_BASE_URL}/api/research-publications/${editingId}`
        : `${API_BASE_URL}/api/research-publications`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response =
        await fetch(url, {
          method,
          body: formData,
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save publication."
        );
      }

      setMessage(
        editingId
          ? "Research publication updated successfully."
          : "Research publication added successfully."
      );

      resetForm();

      await fetchPublications();
    } catch (err) {
      console.error(
        "Save Publication Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save research publication."
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
        "Are you sure you want to delete this research publication?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response =
        await fetch(
          `${API_BASE_URL}/api/research-publications/${id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete publication."
        );
      }

      setMessage(
        "Research publication deleted successfully."
      );

      await fetchPublications();
    } catch (err) {
      console.error(
        "Delete Publication Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete publication."
      );
    }
  };

  // =====================================================
  // VISIBILITY
  // =====================================================

  const handleVisibility =
    async (publication) => {
      try {
        setMessage("");
        setError("");

        const newVisibility =
          !publication.isVisible;

        const response =
          await fetch(
            `${API_BASE_URL}/api/research-publications/${publication._id}/visibility`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                isVisible:
                  newVisibility,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update publication visibility."
          );
        }

        setMessage(
          newVisibility
            ? "Publication is now visible."
            : "Publication is now hidden."
        );

        await fetchPublications();
      } catch (err) {
        console.error(
          "Visibility Error:",
          err
        );

        setError(
          err.message ||
            "Failed to update publication visibility."
        );
      }
    };

  // =====================================================
  // DATE
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
  // PDF URL
  // =====================================================

  const getPdfUrl = (
    publication
  ) => {
    if (publication.pdfUrl) {
      return publication.pdfUrl.startsWith(
        "http"
      )
        ? publication.pdfUrl
        : `${API_BASE_URL}${publication.pdfUrl}`;
    }

    if (publication.paperUrl) {
      return publication.paperUrl.startsWith(
        "http"
      )
        ? publication.paperUrl
        : `${API_BASE_URL}${publication.paperUrl}`;
    }

    if (publication.pdf) {
      return publication.pdf.startsWith(
        "http"
      )
        ? publication.pdf
        : `${API_BASE_URL}${publication.pdf}`;
    }

    return null;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="research-publication-page">

      {/* PAGE HEADER */}

      <div className="research-page-header">

        <div>
          <h1 className="research-page-title">
            Research Publications
          </h1>

          <p className="research-page-subtitle">
            Manage research publications,
            papers, citations and public
            visibility.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="research-add-button"
            onClick={handleAddNew}
          >
            <FileText size={17} />
            Add Publication
          </button>
        )}

      </div>


      {/* MESSAGES */}

      {message && (
        <div className="research-message">
          {message}
        </div>
      )}

      {error && (
        <div className="research-error">
          {error}
        </div>
      )}


      {/* FORM */}

      {showForm && (
        <div className="research-form-container">

          <div className="research-form-header">

            <div>
              <h2 className="research-form-title">
                {editingId
                  ? "Edit Research Publication"
                  : "Add Research Publication"}
              </h2>

              <p className="research-form-description">
                Enter complete information
                about the research publication.
              </p>
            </div>

            <button
              type="button"
              className="research-close-button"
              onClick={resetForm}
              title="Close"
            >
              <X size={18} />
            </button>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="research-form-grid">

              {/* TITLE */}

              <div className="research-form-group full-width">

                <label htmlFor="title">
                  Publication Title *
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter research publication title"
                  required
                />

              </div>


              {/* AUTHORS */}

              <div className="research-form-group full-width">

                <label htmlFor="authors">
                  Authors *
                </label>

                <input
                  id="authors"
                  name="authors"
                  type="text"
                  value={form.authors}
                  onChange={handleChange}
                  placeholder="e.g. Muhammad Shabir Afridi, John Smith"
                  required
                />

              </div>


              {/* JOURNAL */}

              <div className="research-form-group">

                <label htmlFor="journal">
                  Journal *
                </label>

                <input
                  id="journal"
                  name="journal"
                  type="text"
                  value={form.journal}
                  onChange={handleChange}
                  placeholder="Journal name"
                  required
                />

              </div>


              {/* DATE */}

              <div className="research-form-group">

                <label htmlFor="publicationDate">
                  Publication Date
                </label>

                <input
                  id="publicationDate"
                  name="publicationDate"
                  type="date"
                  value={
                    form.publicationDate
                  }
                  onChange={handleChange}
                />

              </div>


              {/* VOLUME */}

              <div className="research-form-group">

                <label htmlFor="volume">
                  Volume
                </label>

                <input
                  id="volume"
                  name="volume"
                  type="text"
                  value={form.volume}
                  onChange={handleChange}
                  placeholder="e.g. 33"
                />

              </div>


              {/* ISSUE */}

              <div className="research-form-group">

                <label htmlFor="issue">
                  Issue
                </label>

                <input
                  id="issue"
                  name="issue"
                  type="text"
                  value={form.issue}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                />

              </div>


              {/* PAGES */}

              <div className="research-form-group">

                <label htmlFor="pages">
                  Pages
                </label>

                <input
                  id="pages"
                  name="pages"
                  type="text"
                  value={form.pages}
                  onChange={handleChange}
                  placeholder="e.g. 767-79"
                />

              </div>


              {/* DOI */}

              <div className="research-form-group">

                <label htmlFor="doi">
                  DOI
                </label>

                <input
                  id="doi"
                  name="doi"
                  type="text"
                  value={form.doi}
                  onChange={handleChange}
                  placeholder="e.g. 10.1234/example"
                />

              </div>


              {/* KEYWORDS */}

              <div className="research-form-group full-width">

                <label htmlFor="keywords">
                  Keywords
                </label>

                <input
                  id="keywords"
                  name="keywords"
                  type="text"
                  value={form.keywords}
                  onChange={handleChange}
                  placeholder="Artificial Intelligence, Machine Learning, Research"
                />

                <small className="research-help-text">
                  Separate multiple keywords
                  with commas.
                </small>

              </div>


              {/* ABSTRACT */}

              <div className="research-form-group full-width">

                <label htmlFor="abstract">
                  Abstract
                </label>

                <textarea
                  id="abstract"
                  name="abstract"
                  value={form.abstract}
                  onChange={handleChange}
                  placeholder="Enter the research abstract..."
                  rows="6"
                />

              </div>


              {/* PDF */}

              <div className="research-form-group full-width">

                <label htmlFor="pdf">
                  Research Paper PDF
                </label>

                <div className="research-file-box">

                  <div className="research-file-content">

                    <div className="research-file-icon">
                      <Upload size={24} />
                    </div>

                    <div>

                      <strong>
                        Upload Research Paper
                      </strong>

                      <p>
                        Upload the complete
                        research paper.
                        PDF format is
                        recommended.
                      </p>

                    </div>

                  </div>

                  <input
                    id="pdf"
                    name="pdf"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleChange}
                  />

                  {form.pdf && (
                    <div className="research-selected-file">

                      <FileText size={16} />

                      <span>
                        {form.pdf.name}
                      </span>

                    </div>
                  )}

                </div>

              </div>


              {/* PAPER URL */}

              <div className="research-form-group full-width">

                <label htmlFor="paperUrl">
                  Research Paper URL
                </label>

                <input
                  id="paperUrl"
                  name="paperUrl"
                  type="url"
                  value={form.paperUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/research-paper"
                />

              </div>


              {/* CITATION */}

              <div className="research-form-group full-width">

                <div className="research-label-row">

                  <label htmlFor="citation">
                    Citation
                  </label>

                  <button
                    type="button"
                    className="research-citation-button"
                    onClick={
                      generateCitation
                    }
                  >
                    Generate Citation
                  </button>

                </div>

                <textarea
                  id="citation"
                  name="citation"
                  value={form.citation}
                  onChange={handleChange}
                  placeholder="Example: Espana-Boquera S, Castro-Bleda MJ, Gorbe-Moya J, Zamora-Martinez F. Improving offline handwritten text recognition with hybrid HMM/ANN models. IEEE Transactions on Pattern Analysis and Machine Intelligence. 2010;33(4):767-79."
                  rows="5"
                />

              </div>


              {/* VISIBILITY */}

              <div className="research-form-group full-width">

                <div className="research-visibility-box">

                  <input
                    id="isVisible"
                    name="isVisible"
                    type="checkbox"
                    checked={
                      form.isVisible
                    }
                    onChange={handleChange}
                  />

                  <div>

                    <label htmlFor="isVisible">
                      Public Portfolio Visibility
                    </label>

                    <p>
                      This publication
                      will appear on
                      the public portfolio.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="research-form-actions">

              <button
                type="button"
                className="research-cancel-button"
                onClick={resetForm}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                className="research-save-button"
                disabled={saving}
              >
                <Save size={16} />

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Publication"
                  : "Add Publication"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* PUBLICATION LIBRARY */}

      <div className="research-library-section">

        <div className="research-list-header">

          <div>

            <h2 className="research-list-title">
              Publication Library
            </h2>

            <p className="research-list-subtitle">
              Manage visibility, edit
              records, delete publications
              and open uploaded research
              papers.
            </p>

          </div>

          <button
            type="button"
            className="research-refresh-button"
            onClick={fetchPublications}
          >
            <RefreshCw size={15} />
            Refresh
          </button>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="research-loading">
            Loading research publications...
          </div>

        ) : publications.length === 0 ? (

          <div className="research-empty-state">

            <div className="research-empty-icon">
              <FileText size={42} />
            </div>

            <h3>
              No Research Publications
            </h3>

            <p>
              No research publications
              have been added yet.
            </p>

            <button
              type="button"
              className="research-add-button"
              onClick={handleAddNew}
            >
              <FileText size={16} />
              Add First Publication
            </button>

          </div>

        ) : (

          <div className="research-publication-list">

            {publications.map(
              (publication, index) => {

                const pdfUrl =
                  getPdfUrl(
                    publication
                  );

                return (

                  <article
                    className="research-publication-card"
                    key={publication._id}
                  >

                    {/* CARD HEADER */}

                    <div className="research-card-top">

                      <div className="research-card-number">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </div>

                      <div className="research-card-main">

                        <h3 className="research-publication-title">
                          {publication.title ||
                            "Untitled Publication"}
                        </h3>

                        {publication.authors && (
                          <p className="research-publication-authors">
                            {
                              publication.authors
                            }
                          </p>
                        )}

                      </div>

                      <span
                        className={`research-status ${
                          publication.isVisible
                            ? "visible"
                            : "hidden"
                        }`}
                      >
                        {publication.isVisible
                          ? "VISIBLE"
                          : "HIDDEN"}
                      </span>

                    </div>


                    {/* DETAILS */}

                    <div className="research-publication-details">

                      {publication.journal && (
                        <div className="research-detail-item">
                          <strong>
                            Journal:
                          </strong>{" "}
                          {
                            publication.journal
                          }
                        </div>
                      )}

                      {publication.publicationDate && (
                        <div className="research-detail-item">
                          <strong>
                            Date:
                          </strong>{" "}
                          {formatDate(
                            publication.publicationDate
                          )}
                        </div>
                      )}

                      {publication.volume && (
                        <div className="research-detail-item">
                          <strong>
                            Volume:
                          </strong>{" "}
                          {
                            publication.volume
                          }
                        </div>
                      )}

                      {publication.issue && (
                        <div className="research-detail-item">
                          <strong>
                            Issue:
                          </strong>{" "}
                          {
                            publication.issue
                          }
                        </div>
                      )}

                      {publication.pages && (
                        <div className="research-detail-item">
                          <strong>
                            Pages:
                          </strong>{" "}
                          {
                            publication.pages
                          }
                        </div>
                      )}

                      {publication.doi && (
                        <div className="research-detail-item">
                          <strong>
                            DOI:
                          </strong>{" "}
                          {publication.doi}
                        </div>
                      )}

                    </div>


                    {/* ABSTRACT */}

                    {publication.abstract && (
                      <div className="research-abstract">

                        <h4 className="research-abstract-title">
                          Abstract
                        </h4>

                        <p className="research-abstract-text">
                          {
                            publication.abstract
                          }
                        </p>

                      </div>
                    )}


                    {/* KEYWORDS */}

                    {publication.keywords &&
                      (
                        Array.isArray(
                          publication.keywords
                        )
                          ? publication.keywords.length >
                            0
                          : publication.keywords
                              .trim()
                              .length > 0
                      ) && (

                        <div className="research-keywords">

                          {(
                            Array.isArray(
                              publication.keywords
                            )
                              ? publication.keywords
                              : publication.keywords
                                  .split(",")
                                  .map(
                                    (item) =>
                                      item.trim()
                                  )
                                  .filter(
                                    Boolean
                                  )
                          ).map(
                            (
                              keyword,
                              keywordIndex
                            ) => (

                              <span
                                className="research-keyword"
                                key={`${keyword}-${keywordIndex}`}
                              >
                                {keyword}
                              </span>

                            )
                          )}

                        </div>

                      )}


                    {/* CITATION */}

                    {publication.citation && (
                      <div className="research-citation">

                        <strong>
                          Citation:
                        </strong>{" "}

                        {
                          publication.citation
                        }

                      </div>
                    )}


                    {/* ACTIONS */}

                    <div className="research-card-actions">

                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="research-action-button pdf"
                        >
                          <ExternalLink
                            size={15}
                          />
                          View PDF
                        </a>
                      )}

                      <button
                        type="button"
                        className="research-action-button visibility"
                        onClick={() =>
                          handleVisibility(
                            publication
                          )
                        }
                      >
                        {publication.isVisible ? (
                          <>
                            <EyeOff
                              size={15}
                            />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye
                              size={15}
                            />
                            Show
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="research-action-button edit"
                        onClick={() =>
                          handleEdit(
                            publication
                          )
                        }
                      >
                        <Pencil
                          size={15}
                        />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="research-action-button delete"
                        onClick={() =>
                          handleDelete(
                            publication._id
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />
                        Delete
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default ResearchPublicationManager;