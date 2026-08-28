const ResearchPaperSubmission = require("../models/ResearchPaperSubmission");
const ResearchPublication = require("../models/ResearchPublication");

// =====================================================
// SUBMIT NEW RESEARCH PAPER
// =====================================================
const createResearchPaperSubmission = async (req, res) => {
  try {
    const {
      authorName,
      email,
      affiliation,
      title,
      authors,
      researchArea,
      abstract,
      keywords,
      paperFile,
      additionalNotes,
    } = req.body;

    if (!authorName || !email || !title || !abstract) {
      return res.status(400).json({
        success: false,
        message:
          "Author name, email, paper title and abstract are required.",
      });
    }

    const submission = await ResearchPaperSubmission.create({
      authorName,
      email,
      affiliation,
      title,
      authors,
      researchArea,
      abstract,
      keywords,
      paperFile,
      additionalNotes,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Research paper submitted successfully.",
      data: submission,
    });
  } catch (error) {
    console.error("Create Research Paper Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit research paper.",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL RESEARCH PAPER SUBMISSIONS
// =====================================================
const getResearchPaperSubmissions = async (req, res) => {
  try {
    const submissions = await ResearchPaperSubmission.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Get Research Papers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get research paper submissions.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE RESEARCH PAPER SUBMISSION
// =====================================================
const getResearchPaperSubmissionById = async (req, res) => {
  try {
    const submission = await ResearchPaperSubmission.findById(
      req.params.id
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Research paper submission not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Get Research Paper Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get research paper submission.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE RESEARCH PAPER SUBMISSION
// =====================================================
const updateResearchPaperSubmission = async (req, res) => {
  try {
    const submission = await ResearchPaperSubmission.findById(
      req.params.id
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Research paper submission not found.",
      });
    }

    const allowedFields = [
      "authorName",
      "email",
      "affiliation",
      "title",
      "authors",
      "researchArea",
      "abstract",
      "keywords",
      "paperFile",
      "additionalNotes",
      "adminNotes",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        submission[field] = req.body[field];
      }
    });

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Research paper submission updated successfully.",
      data: submission,
    });
  } catch (error) {
    console.error("Update Research Paper Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update research paper submission.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE RESEARCH PAPER STATUS
// =====================================================
const updateResearchPaperStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Under Review",
      "Accepted",
      "Rejected",
      "Published",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid research paper status.",
      });
    }

    const submission = await ResearchPaperSubmission.findById(
      req.params.id
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Research paper submission not found.",
      });
    }

    submission.status = status;

    if (status === "Published") {
      submission.publishedAt = new Date();
    } else {
      submission.publishedAt = null;
    }

    await submission.save();

    res.status(200).json({
      success: true,
      message: `Research paper status changed to ${status}.`,
      data: submission,
    });
  } catch (error) {
    console.error("Update Research Paper Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update research paper status.",
      error: error.message,
    });
  }
};

// =====================================================
// PUBLISH RESEARCH PAPER
// =====================================================
const publishResearchPaper = async (req, res) => {
  try {
    const submission = await ResearchPaperSubmission.findById(
      req.params.id
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Research paper submission not found.",
      });
    }

    // -------------------------------------------------
    // Paper must be accepted before publishing
    // -------------------------------------------------
    if (submission.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message:
          "Only an Accepted research paper can be published.",
      });
    }

    // -------------------------------------------------
    // Prevent duplicate publication
    // -------------------------------------------------
    if (submission.publicationId) {
      return res.status(400).json({
        success: false,
        message:
          "This research paper has already been published.",
        publicationId: submission.publicationId,
      });
    }

    // -------------------------------------------------
    // Create Published Research Publication
    // -------------------------------------------------
    const publication = await ResearchPublication.create({
      title: submission.title,

      authors:
        submission.authors || submission.authorName,

      authorName: submission.authorName,

      email: submission.email,

      affiliation: submission.affiliation,

      researchArea: submission.researchArea,

      abstract: submission.abstract,

      keywords: submission.keywords,

      paperFile: submission.paperFile,

      sourceSubmissionId: submission._id,

      publicationDate: new Date(),

      isVisible: true,
    });

    // -------------------------------------------------
    // Update original submission
    // -------------------------------------------------
    submission.status = "Published";

    submission.publicationId = publication._id;

    submission.publishedAt = new Date();

    await submission.save();

    // -------------------------------------------------
    // Success response
    // -------------------------------------------------
    res.status(200).json({
      success: true,
      message:
        "Research paper published successfully.",

      data: {
        submission,
        publication,
      },
    });
  } catch (error) {
    console.error("Publish Research Paper Error:", error);

    res.status(500).json({
      success: false,
      message:
        "Failed to publish research paper.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE RESEARCH PAPER SUBMISSION
// =====================================================
const deleteResearchPaperSubmission = async (req, res) => {
  try {
    const submission = await ResearchPaperSubmission.findById(
      req.params.id
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Research paper submission not found.",
      });
    }

    await ResearchPaperSubmission.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Research paper submission deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Research Paper Error:", error);

    res.status(500).json({
      success: false,
      message:
        "Failed to delete research paper submission.",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT CONTROLLER FUNCTIONS
// =====================================================
module.exports = {
  createResearchPaperSubmission,
  getResearchPaperSubmissions,
  getResearchPaperSubmissionById,
  updateResearchPaperSubmission,
  updateResearchPaperStatus,
  publishResearchPaper,
  deleteResearchPaperSubmission,
};