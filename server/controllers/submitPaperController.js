const SubmitPaper = require("../models/SubmitPaper");

// ======================================================
// CREATE / SUBMIT RESEARCH PAPER
// ======================================================

const createSubmitPaper = async (req, res) => {
  try {
    const {
      paperTitle,
      journalName,
      authorName,
      submitDate,
      status,
    } = req.body;

    // ==============================================
    // VALIDATION
    // ==============================================

    if (
      !paperTitle ||
      !journalName ||
      !authorName ||
      !submitDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Paper title, journal name, author name and submit date are required.",
      });
    }

    // ==============================================
    // PDF INFORMATION
    // ==============================================

    let pdfData = {
      fileName: "",
      filePath: "",
      mimeType: "application/pdf",
    };

    if (req.file) {
      pdfData = {
        fileName: req.file.originalname,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
      };
    }

    // ==============================================
    // CREATE PAPER
    // ==============================================

    const paper = await SubmitPaper.create({
      paperTitle: paperTitle.trim(),
      journalName: journalName.trim(),
      authorName: authorName.trim(),
      submitDate,
      status: status || "Under Review",
      pdf: pdfData,
      visible: true,
      isSubmitted: true,
    });

    return res.status(201).json({
      success: true,
      message: "Research paper submitted successfully.",
      paper,
    });
  } catch (error) {
    console.error(
      "Create Submit Paper Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit research paper.",
      error: error.message,
    });
  }
};


// ======================================================
// GET ALL SUBMITTED PAPERS
// ======================================================

const getAllSubmitPapers = async (req, res) => {
  try {
    const papers = await SubmitPaper.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: papers.length,
      papers,
    });
  } catch (error) {
    console.error(
      "Get Submit Papers Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch research papers.",
      error: error.message,
    });
  }
};


// ======================================================
// GET SINGLE PAPER
// ======================================================

const getSubmitPaperById = async (req, res) => {
  try {
    const { id } = req.params;

    const paper = await SubmitPaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Research paper not found.",
      });
    }

    return res.status(200).json({
      success: true,
      paper,
    });
  } catch (error) {
    console.error(
      "Get Single Submit Paper Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch research paper.",
      error: error.message,
    });
  }
};


// ======================================================
// UPDATE PAPER
// ======================================================

const updateSubmitPaper = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      paperTitle,
      journalName,
      authorName,
      submitDate,
      status,
    } = req.body;

    const paper =
      await SubmitPaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Research paper not found.",
      });
    }

    // ==============================================
    // UPDATE BASIC INFORMATION
    // ==============================================

    if (paperTitle !== undefined) {
      paper.paperTitle =
        paperTitle.trim();
    }

    if (journalName !== undefined) {
      paper.journalName =
        journalName.trim();
    }

    if (authorName !== undefined) {
      paper.authorName =
        authorName.trim();
    }

    if (submitDate !== undefined) {
      paper.submitDate =
        submitDate;
    }

    if (status !== undefined) {
      paper.status =
        status;
    }

    // ==============================================
    // UPDATE PDF
    // ==============================================

    if (req.file) {
      paper.pdf = {
        fileName:
          req.file.originalname,

        filePath:
          req.file.path,

        mimeType:
          req.file.mimetype,
      };
    }

    const updatedPaper =
      await paper.save();

    return res.status(200).json({
      success: true,
      message:
        "Research paper updated successfully.",
      paper: updatedPaper,
    });
  } catch (error) {
    console.error(
      "Update Submit Paper Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update research paper.",
      error: error.message,
    });
  }
};


// ======================================================
// DELETE PAPER
// ======================================================

const deleteSubmitPaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper =
      await SubmitPaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Research paper not found.",
      });
    }

    await SubmitPaper.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Research paper deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Submit Paper Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete research paper.",
      error: error.message,
    });
  }
};


// ======================================================
// SUBMIT PAPER
// ======================================================

const submitPaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper =
      await SubmitPaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Research paper not found.",
      });
    }

    paper.isSubmitted = true;

    const updatedPaper =
      await paper.save();

    return res.status(200).json({
      success: true,
      message:
        "Research paper submitted successfully.",
      paper: updatedPaper,
    });
  } catch (error) {
    console.error(
      "Submit Paper Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit research paper.",
      error: error.message,
    });
  }
};


// ======================================================
// UNSUBMIT PAPER
// ======================================================

const unsubmitPaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper =
      await SubmitPaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Research paper not found.",
      });
    }

    paper.isSubmitted = false;

    const updatedPaper =
      await paper.save();

    return res.status(200).json({
      success: true,
      message:
        "Research paper unsubmitted successfully.",
      paper: updatedPaper,
    });
  } catch (error) {
    console.error(
      "Unsubmit Paper Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to unsubmit research paper.",
      error: error.message,
    });
  }
};


// ======================================================
// SHOW PAPER
// ======================================================

const showSubmitPaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper =
      await SubmitPaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Research paper not found.",
      });
    }

    paper.visible = true;

    const updatedPaper =
      await paper.save();

    return res.status(200).json({
      success: true,
      message:
        "Research paper is now visible.",
      paper: updatedPaper,
    });
  } catch (error) {
    console.error(
      "Show Submit Paper Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to show research paper.",
      error: error.message,
    });
  }
};


// ======================================================
// HIDE PAPER
// ======================================================

const hideSubmitPaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper =
      await SubmitPaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Research paper not found.",
      });
    }

    paper.visible = false;

    const updatedPaper =
      await paper.save();

    return res.status(200).json({
      success: true,
      message:
        "Research paper is now hidden.",
      paper: updatedPaper,
    });
  } catch (error) {
    console.error(
      "Hide Submit Paper Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to hide research paper.",
      error: error.message,
    });
  }
};


// ======================================================
// EXPORT ALL CONTROLLERS
// ======================================================

module.exports = {
  createSubmitPaper,
  getAllSubmitPapers,
  getSubmitPaperById,
  updateSubmitPaper,
  deleteSubmitPaper,
  submitPaper,
  unsubmitPaper,
  showSubmitPaper,
  hideSubmitPaper,
};