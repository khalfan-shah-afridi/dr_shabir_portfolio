const Conference = require("../models/Conference");

// ==========================================
// GET ALL CONFERENCES - ADMIN
// ==========================================
const getConferences = async (req, res) => {
  try {
    const conferences = await Conference.find()
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: conferences.length,
      data: conferences,
    });
  } catch (error) {
    console.error(
      "Get conferences error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch conferences",
    });
  }
};

// ==========================================
// GET PUBLIC CONFERENCES
// ==========================================
const getPublicConferences = async (
  req,
  res
) => {
  try {
    const conferences =
      await Conference.find({
        isVisible: true,
      }).sort({
        startDate: -1,
      });

    res.status(200).json({
      success: true,
      count: conferences.length,
      data: conferences,
    });
  } catch (error) {
    console.error(
      "Get public conferences error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch public conferences",
    });
  }
};

// ==========================================
// CREATE CONFERENCE
// ==========================================
const createConference = async (
  req,
  res
) => {
  try {
    const conference =
      await Conference.create(req.body);

    res.status(201).json({
      success: true,
      message:
        "Conference created successfully",
      data: conference,
    });
  } catch (error) {
    console.error(
      "Create conference error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create conference",
    });
  }
};

// ==========================================
// UPDATE CONFERENCE
// ==========================================
const updateConference = async (
  req,
  res
) => {
  try {
    const conference =
      await Conference.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Conference updated successfully",
      data: conference,
    });
  } catch (error) {
    console.error(
      "Update conference error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update conference",
    });
  }
};

// ==========================================
// DELETE CONFERENCE
// ==========================================
const deleteConference = async (
  req,
  res
) => {
  try {
    const conference =
      await Conference.findByIdAndDelete(
        req.params.id
      );

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Conference deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete conference error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete conference",
    });
  }
};

// ==========================================
// TOGGLE CONFERENCE VISIBILITY
// ==========================================
const toggleConferenceVisibility =
  async (req, res) => {
    try {
      const conference =
        await Conference.findById(
          req.params.id
        );

      if (!conference) {
        return res.status(404).json({
          success: false,
          message: "Conference not found",
        });
      }

      conference.isVisible =
        !conference.isVisible;

      await conference.save();

      res.status(200).json({
        success: true,
        message:
          "Conference visibility updated",
        data: conference,
      });
    } catch (error) {
      console.error(
        "Toggle conference visibility error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update conference visibility",
      });
    }
  };

module.exports = {
  getConferences,
  getPublicConferences,
  createConference,
  updateConference,
  deleteConference,
  toggleConferenceVisibility,
};