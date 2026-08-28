const ResearchPublication = require("../models/ResearchPublication");
const fs = require("fs");
const path = require("path");

// =====================================================
// NORMALIZE KEYWORDS
// =====================================================

const normalizeKeywords = (keywords) => {
  if (!keywords) {
    return [];
  }

  if (Array.isArray(keywords)) {
    return keywords
      .map((keyword) => String(keyword).trim())
      .filter(Boolean);
  }

  return String(keywords)
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
};

// =====================================================
// DELETE PDF FILE
// =====================================================

const deletePdfFile = (pdfUrl) => {
  if (!pdfUrl) {
    return;
  }

  try {
    let relativePath = String(pdfUrl);

    // Remove domain if full URL exists
    relativePath = relativePath.replace(
      /^https?:\/\/[^/]+/,
      ""
    );

    // Remove leading slash
    relativePath = relativePath.replace(
      /^\/+/,
      ""
    );

    const filePath = path.join(
      __dirname,
      "..",
      relativePath
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      "PDF delete error:",
      error.message
    );
  }
};

// =====================================================
// DELETE UPLOADED FILE
// =====================================================

const deleteUploadedFile = (filename) => {
  if (!filename) {
    return;
  }

  try {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "research-papers",
      filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      "Uploaded PDF cleanup error:",
      error.message
    );
  }
};

// =====================================================
// GET ALL RESEARCH PUBLICATIONS
// =====================================================

const getResearchPublications = async (
  req,
  res
) => {
  try {
    const publications =
      await ResearchPublication.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      data: publications,
    });
  } catch (error) {
    console.error(
      "Get Publications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch research publications.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE RESEARCH PUBLICATION
// =====================================================

const getResearchPublicationById = async (
  req,
  res
) => {
  try {
    const publication =
      await ResearchPublication.findById(
        req.params.id
      );

    if (!publication) {
      return res.status(404).json({
        success: false,
        message:
          "Research publication not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: publication,
    });
  } catch (error) {
    console.error(
      "Get Publication Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch research publication.",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE RESEARCH PUBLICATION
// =====================================================

const createResearchPublication = async (
  req,
  res
) => {
  try {
    const {
      title,
      authors,
      journal,
      volume,
      issue,
      pages,
      publicationDate,
      doi,
      keywords,
      abstract,
      paperUrl,
      citation,
      isVisible,
    } = req.body;

    // =================================================
    // TITLE VALIDATION
    // =================================================

    if (!title || !String(title).trim()) {
      if (req.file) {
        deleteUploadedFile(
          req.file.filename
        );
      }

      return res.status(400).json({
        success: false,
        message:
          "Research publication title is required.",
      });
    }

    // =================================================
    // PDF URL
    // =================================================

    let pdfUrl = "";

    if (req.file) {
      pdfUrl =
        `/uploads/research-papers/${req.file.filename}`;
    }

    // =================================================
    // CREATE PUBLICATION
    // =================================================

    const publication =
      await ResearchPublication.create({
        title: String(title).trim(),

        authors: authors
          ? String(authors).trim()
          : "",

        journal: journal
          ? String(journal).trim()
          : "",

        volume: volume
          ? String(volume).trim()
          : "",

        issue: issue
          ? String(issue).trim()
          : "",

        pages: pages
          ? String(pages).trim()
          : "",

        publicationDate:
          publicationDate
            ? new Date(publicationDate)
            : null,

        doi: doi
          ? String(doi).trim()
          : "",

        keywords:
          normalizeKeywords(keywords),

        abstract: abstract
          ? String(abstract).trim()
          : "",

        paperUrl: paperUrl
          ? String(paperUrl).trim()
          : "",

        citation: citation
          ? String(citation).trim()
          : "",

        pdfUrl,

        isVisible:
          isVisible === undefined
            ? true
            : isVisible === true ||
              isVisible === "true",
      });

    return res.status(201).json({
      success: true,
      message:
        "Research publication created successfully.",
      data: publication,
    });
  } catch (error) {
    console.error(
      "Create Publication Error:",
      error
    );

    // Delete uploaded PDF if database save fails
    if (req.file) {
      deleteUploadedFile(
        req.file.filename
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create research publication.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE RESEARCH PUBLICATION
// =====================================================

const updateResearchPublication = async (
  req,
  res
) => {
  try {
    const publication =
      await ResearchPublication.findById(
        req.params.id
      );

    // =================================================
    // NOT FOUND
    // =================================================

    if (!publication) {
      if (req.file) {
        deleteUploadedFile(
          req.file.filename
        );
      }

      return res.status(404).json({
        success: false,
        message:
          "Research publication not found.",
      });
    }

    const {
      title,
      authors,
      journal,
      volume,
      issue,
      pages,
      publicationDate,
      doi,
      keywords,
      abstract,
      paperUrl,
      citation,
      isVisible,
    } = req.body;

    // =================================================
    // BASIC INFORMATION
    // =================================================

    if (title !== undefined) {
      publication.title =
        String(title).trim();
    }

    if (authors !== undefined) {
      publication.authors =
        String(authors).trim();
    }

    if (journal !== undefined) {
      publication.journal =
        String(journal).trim();
    }

    // =================================================
    // BIBLIOGRAPHIC INFORMATION
    // =================================================

    if (volume !== undefined) {
      publication.volume =
        String(volume).trim();
    }

    if (issue !== undefined) {
      publication.issue =
        String(issue).trim();
    }

    if (pages !== undefined) {
      publication.pages =
        String(pages).trim();
    }

    // =================================================
    // PUBLICATION DATE
    // =================================================

    if (publicationDate !== undefined) {
      publication.publicationDate =
        publicationDate
          ? new Date(publicationDate)
          : null;
    }

    // =================================================
    // DOI
    // =================================================

    if (doi !== undefined) {
      publication.doi =
        String(doi).trim();
    }

    // =================================================
    // KEYWORDS
    // =================================================

    if (keywords !== undefined) {
      publication.keywords =
        normalizeKeywords(keywords);
    }

    // =================================================
    // ABSTRACT
    // =================================================

    if (abstract !== undefined) {
      publication.abstract =
        String(abstract).trim();
    }

    // =================================================
    // PAPER URL
    // =================================================

    if (paperUrl !== undefined) {
      publication.paperUrl =
        String(paperUrl).trim();
    }

    // =================================================
    // CITATION
    // =================================================

    if (citation !== undefined) {
      publication.citation =
        String(citation).trim();
    }

    // =================================================
    // VISIBILITY
    // =================================================

    if (isVisible !== undefined) {
      publication.isVisible =
        isVisible === true ||
        isVisible === "true";
    }

    // =================================================
    // NEW PDF
    // =================================================

    if (req.file) {
      const oldPdfUrl =
        publication.pdfUrl;

      publication.pdfUrl =
        `/uploads/research-papers/${req.file.filename}`;

      // Delete old PDF
      if (oldPdfUrl) {
        deletePdfFile(oldPdfUrl);
      }
    }

    // =================================================
    // SAVE
    // =================================================

    await publication.save();

    return res.status(200).json({
      success: true,
      message:
        "Research publication updated successfully.",
      data: publication,
    });
  } catch (error) {
    console.error(
      "Update Publication Error:",
      error
    );

    // Delete newly uploaded PDF if update fails
    if (req.file) {
      deleteUploadedFile(
        req.file.filename
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update research publication.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE RESEARCH PUBLICATION
// =====================================================

const deleteResearchPublication = async (
  req,
  res
) => {
  try {
    const publication =
      await ResearchPublication.findById(
        req.params.id
      );

    if (!publication) {
      return res.status(404).json({
        success: false,
        message:
          "Research publication not found.",
      });
    }

    // =================================================
    // DELETE PDF
    // =================================================

    if (publication.pdfUrl) {
      deletePdfFile(
        publication.pdfUrl
      );
    }

    // =================================================
    // DELETE DATABASE RECORD
    // =================================================

    await ResearchPublication.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Research publication deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Publication Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete research publication.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE VISIBILITY
// =====================================================

const updateResearchPublicationVisibility =
  async (req, res) => {
    try {
      const {
        isVisible,
      } = req.body;

      const publication =
        await ResearchPublication.findById(
          req.params.id
        );

      if (!publication) {
        return res.status(404).json({
          success: false,
          message:
            "Research publication not found.",
        });
      }

      publication.isVisible =
        isVisible === true ||
        isVisible === "true";

      await publication.save();

      return res.status(200).json({
        success: true,
        message:
          publication.isVisible
            ? "Research publication is now visible."
            : "Research publication is now hidden.",
        data: publication,
      });
    } catch (error) {
      console.error(
        "Visibility Update Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update publication visibility.",
        error: error.message,
      });
    }
  };

// =====================================================
// EXPORTS
// =====================================================

const getPublicResearchPublications = async (req,res) => {
  try {
    const publications=await ResearchPublication.find({isVisible:true}).sort({publicationDate:-1,createdAt:-1});
    res.json({success:true,data:publications});
  } catch(error){res.status(500).json({success:false,message:error.message});}
};

module.exports = {
  getPublicResearchPublications,
  getResearchPublications,
  getResearchPublicationById,
  createResearchPublication,
  updateResearchPublication,
  deleteResearchPublication,
  updateResearchPublicationVisibility,
};