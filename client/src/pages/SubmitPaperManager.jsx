import React, { useState } from "react";
import { FileText, Upload, CheckCircle2 } from "lucide-react";
import "./SubmitPaperManager.css";

const SubmitPaperManager = () => {
  const [form, setForm] = useState({
    paperTitle: "",
    journalName: "",
    authorName: "",
    submitDate: "",
    status: "Under Review",
    pdf: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage(
      "Research paper submitted successfully. MongoDB connection will be added next."
    );

    console.log("Submitted Paper:", form);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <div className="submit-paper-page">

      <div className="submit-paper-container">

        {/* =========================================
            HEADER
        ========================================== */}

        <div className="submit-paper-header">

          <div className="submit-paper-title-area">

            <div className="submit-paper-icon">
              <FileText size={28} />
            </div>

            <div>

              <span className="submit-paper-kicker">
                RESEARCH MANAGEMENT
              </span>

              <h1>
                Submit / Unsubmit Papers
              </h1>

              <p>
                Manage submitted research papers,
                PDF files and review status.
              </p>

            </div>

          </div>

          <div className="submit-paper-status">
            <CheckCircle2 size={17} />
            Admin Module
          </div>

        </div>


        {/* =========================================
            SUCCESS MESSAGE
        ========================================== */}

        {message && (

          <div className="submit-success-message">

            <CheckCircle2 size={19} />

            <span>
              {message}
            </span>

          </div>

        )}


        {/* =========================================
            FORM CARD
        ========================================== */}

        <div className="submit-paper-form-card">

          <div className="submit-form-heading">

            <div>

              <span>
                PAPER INFORMATION
              </span>

              <h2>
                Submit Research Paper
              </h2>

              <p>
                Enter complete paper information below.
              </p>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            {/* =====================================
                PAPER TITLE
            ====================================== */}

            <div className="submit-form-group">

              <label htmlFor="paperTitle">
                Paper Title
              </label>

              <input
                id="paperTitle"
                name="paperTitle"
                type="text"
                value={form.paperTitle}
                onChange={handleChange}
                placeholder="Enter research paper title"
                required
              />

            </div>


            {/* =====================================
                JOURNAL
            ====================================== */}

            <div className="submit-form-group">

              <label htmlFor="journalName">
                Journal Name
              </label>

              <input
                id="journalName"
                name="journalName"
                type="text"
                value={form.journalName}
                onChange={handleChange}
                placeholder="Enter journal name"
                required
              />

            </div>


            {/* =====================================
                AUTHOR
            ====================================== */}

            <div className="submit-form-group">

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


            {/* =====================================
                DATE + STATUS
            ====================================== */}

            <div className="submit-form-row">

              <div className="submit-form-group">

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


              <div className="submit-form-group">

                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >

                  <option value="Under Review">
                    Under Review
                  </option>

                  <option value="Accepted">
                    Accepted
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                  <option value="Accepted with Changes">
                    Accepted with Changes
                  </option>

                </select>

              </div>

            </div>


            {/* =====================================
                PDF UPLOAD
            ====================================== */}

            <div className="submit-form-group">

              <label htmlFor="pdf">
                Research Paper PDF
              </label>

              <div className="submit-pdf-box">

                <div className="submit-pdf-icon">
                  <Upload size={24} />
                </div>

                <div className="submit-pdf-content">

                  <strong>
                    Upload Research Paper
                  </strong>

                  <span>
                    Only PDF files are accepted.
                  </span>

                </div>

                <input
                  id="pdf"
                  name="pdf"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleChange}
                  required
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


            {/* =====================================
                BUTTON
            ====================================== */}

            <div className="submit-paper-actions">

              <button
                type="submit"
                className="submit-paper-button"
              >
                <FileText size={18} />
                Submit Research Paper
              </button>

            </div>

          </form>

        </div>


        {/* =========================================
            STATUS INFORMATION
        ========================================== */}

        <div className="submit-paper-info">

          <div className="submit-info-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>

            <span>
              REVIEW STATUS
            </span>

            <h2>
              Paper Review Workflow
            </h2>

            <p>
              Every submitted paper can have one of
              four statuses: Under Review, Accepted,
              Rejected, or Accepted with Changes.
              The administrator can update the status
              later.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SubmitPaperManager;