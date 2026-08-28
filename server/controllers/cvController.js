const CVSettings = require("../models/CVSettings");
const PersonalInformation = require("../models/PersonalInformation");
const Profile = require("../models/Profile");
const Education = require("../models/Education");
const Experience = require("../models/Experience");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const ResearchPublication = require("../models/ResearchPublication");
const Certificate = require("../models/Certificate");
const Award = require("../models/Award");
const Conference = require("../models/Conference");
const Reference = require("../models/Reference");
const ResearchResource = require("../models/ResearchResource");
const ProjectWin = require("../models/ProjectWin");
const Supervision = require("../models/Supervision");
const Reviewer = require("../models/Reviewer");

const generateCVPdf = require("../utils/generateCV");

// ==========================================
// GET OR CREATE THE SINGLETON CV SETTINGS DOC
// ==========================================
const getOrCreateCVSettings = async () => {
  let settings = await CVSettings.findOne({ key: "global" });

  if (!settings) {
    settings = await CVSettings.create({ key: "global" });
  } else {
    const defaults = CVSettings.DEFAULT_SECTIONS || [];
    const existing = new Set((settings.sections || []).map((s) => s.key));
    let changed = false;
    defaults.forEach((section) => {
      if (!existing.has(section.key)) {
        settings.sections.push({ ...section, order: (settings.sections || []).length + 1 });
        changed = true;
      }
    });
    if (changed) await settings.save();
  }
  return settings;
};

// ==========================================
// GET CV SETTINGS (admin)
// ==========================================
const getCVSettings = async (req, res) => {
  try {
    const settings = await getOrCreateCVSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// UPDATE CV SETTINGS (admin)
// ==========================================
const updateCVSettings = async (req, res) => {
  try {
    const settings = await getOrCreateCVSettings();
    const body = req.body || {};

    [
      "cvTitle",
      "professionalSummary",
      "showProfileImage",
      "showContactInformation",
      "showPhone",
      "showEmail",
      "showAddress",
      "showSocialLinks",
    ].forEach((key) => {
      if (body[key] !== undefined) settings[key] = body[key];
    });

    if (Array.isArray(body.sections)) {
      settings.sections = body.sections.map((s, i) => ({
        key: s.key,
        label: s.label,
        enabled: s.enabled !== false,
        order: typeof s.order === "number" ? s.order : i,
      }));
    }

    await settings.save();
    res.json({ success: true, message: "CV settings updated", data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// COLLECT LIVE DATA FROM EVERY EXISTING MODULE
// ==========================================
const collectCVData = async () => {
  const [
    personal,
    profile,
    education,
    experience,
    projects,
    skills,
    publications,
    certificates,
    awards,
    conferences,
    references,
    researchResources,
    projectWins,
    supervision,
    reviewer,
    settings,
  ] = await Promise.all([
    PersonalInformation.findOne().lean(),
    Profile.findOne().lean(),
    Education.find({ visible: true }).sort({ order: 1, startYear: -1 }).lean(),
    Experience.find({ visible: true }).sort({ order: 1, startDate: -1 }).lean(),
    Project.find({ visible: true }).sort({ order: 1 }).lean(),
    Skill.find({ visible: true }).sort({ order: 1 }).lean(),
    ResearchPublication.find({ isVisible: true }).sort({ publicationDate: -1 }).lean(),
    Certificate.find({ visible: true }).sort({ order: 1 }).lean(),
    Award.find({ visible: true }).sort({ order: 1, year: -1 }).lean(),
    Conference.find({ isVisible: true }).sort({ startDate: -1 }).lean(),
    Reference.find({ isVisible: true }).sort({ createdAt: -1 }).lean(),
    ResearchResource.find({ visible: true }).sort({ order: 1, year: -1 }).lean(),
    ProjectWin.find({ visible: true }).sort({ order: 1, year: -1 }).lean(),
    Supervision.find({ visible: true }).sort({ order: 1, year: -1 }).lean(),
    Reviewer.find({ visible: true }).sort({ order: 1, year: -1 }).lean(),
    getOrCreateCVSettings(),
  ]);

  return {
    personal,
    profile,
    education,
    experience,
    projects,
    skills,
    publications,
    certificates,
    awards,
    conferences,
    references,
    researchResources,
    projectWins,
    supervision,
    reviewer,
    researchInterests: [
      ...(profile?.researchInterests || []),
      ...(profile?.researchAreas || []),
    ].filter(Boolean),
    // "Grants" in the CV maps to funded Project Wins records.
    grants: projectWins,
    settings,
  };
};

// ==========================================
// GET CV DATA (used by the admin preview screen)
// ==========================================
const getCVData = async (req, res) => {
  try {
    const data = await collectCVData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// DOWNLOAD / GENERATE THE CV PDF
// ==========================================
const downloadCV = async (req, res) => {
  try {
    const data = await collectCVData();

    const name =
      data.personal?.fullName || data.profile?.fullName || "Professional_CV";
    const safeName = String(name).replace(/[^a-zA-Z0-9_-]+/g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName || "Professional_CV"}.pdf"`
    );

    generateCVPdf(data, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCVSettings,
  updateCVSettings,
  getCVData,
  downloadCV,
  getOrCreateCVSettings,
  collectCVData,
};
