const Settings = require("../models/Settings");

const DEFAULT_MODULES = {
  personalInformation: true,
  profile: true,
  education: true,
  skills: true,
  projects: true,
  awards: true,
  certificates: true,
  mission: true,
  vision: true,
  publications: true,
  conferences: true,
  references: true,
  experience: true,
  researchResources: true,
  projectWins: true,
  supervision: true,
  reviewer: true,
  researchInterests: true,
  documents: false,
};

// ==========================================
// GET OR CREATE THE SINGLETON SETTINGS DOC
// ==========================================
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ key: "global" });

  if (!settings) {
    settings = await Settings.create({
      key: "global",
      modules: DEFAULT_MODULES,
    });
  }

  return settings;
};

// ==========================================
// GET SETTINGS (used by admin panel and public portfolio)
// ==========================================
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      data: {
        modules: settings.modules,
      },
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load settings",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE MODULE VISIBILITY (admin only)
// ==========================================
const updateSettings = async (req, res) => {
  try {
    const { modules } = req.body;

    if (!modules || typeof modules !== "object") {
      return res.status(400).json({
        success: false,
        message: "modules object is required",
      });
    }

    const settings = await getOrCreateSettings();

    Object.keys(DEFAULT_MODULES).forEach((key) => {
      if (typeof modules[key] === "boolean") {
        settings.modules[key] = modules[key];
      }
    });

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: {
        modules: settings.modules,
      },
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getOrCreateSettings,
  DEFAULT_MODULES,
};
