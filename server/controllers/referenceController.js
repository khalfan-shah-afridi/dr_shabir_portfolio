const Reference = require("../models/Reference");

// ==========================================
// GET ALL REFERENCES - ADMIN
// ==========================================
const getReferences = async (req, res) => {
  try {
    const references = await Reference.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: references.length,
      data: references,
    });
  } catch (error) {
    console.error(
      "Get references error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch references",
    });
  }
};

// ==========================================
// GET PUBLIC REFERENCES
// ==========================================
const getPublicReferences = async (
  req,
  res
) => {
  try {
    const references = await Reference.find({
      isVisible: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: references.length,
      data: references,
    });
  } catch (error) {
    console.error(
      "Get public references error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch public references",
    });
  }
};

// ==========================================
// CREATE REFERENCE
// ==========================================
const createReference = async (
  req,
  res
) => {
  try {
    const reference =
      await Reference.create(req.body);

    res.status(201).json({
      success: true,
      message:
        "Reference created successfully",
      data: reference,
    });
  } catch (error) {
    console.error(
      "Create reference error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create reference",
    });
  }
};

// ==========================================
// UPDATE REFERENCE
// ==========================================
const updateReference = async (
  req,
  res
) => {
  try {
    const reference =
      await Reference.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!reference) {
      return res.status(404).json({
        success: false,
        message: "Reference not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Reference updated successfully",
      data: reference,
    });
  } catch (error) {
    console.error(
      "Update reference error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update reference",
    });
  }
};

// ==========================================
// DELETE REFERENCE
// ==========================================
const deleteReference = async (
  req,
  res
) => {
  try {
    const reference =
      await Reference.findByIdAndDelete(
        req.params.id
      );

    if (!reference) {
      return res.status(404).json({
        success: false,
        message: "Reference not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Reference deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete reference error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete reference",
    });
  }
};

// ==========================================
// TOGGLE REFERENCE VISIBILITY
// ==========================================
const toggleReferenceVisibility =
  async (req, res) => {
    try {
      const reference =
        await Reference.findById(
          req.params.id
        );

      if (!reference) {
        return res.status(404).json({
          success: false,
          message: "Reference not found",
        });
      }

      reference.isVisible =
        !reference.isVisible;

      await reference.save();

      res.status(200).json({
        success: true,
        message:
          "Reference visibility updated",
        data: reference,
      });
    } catch (error) {
      console.error(
        "Toggle reference visibility error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update reference visibility",
      });
    }
  };

module.exports = {
  getReferences,
  getPublicReferences,
  createReference,
  updateReference,
  deleteReference,
  toggleReferenceVisibility,
};