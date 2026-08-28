const makeCrudController = require("../utils/crudController");
const Experience = require("../models/Experience");

// Base CRUD (getAll, getPublic, create, update, remove, toggle) generated
// using the project's existing generic factory, sorted by display order
// then most recent start date first.
const base = makeCrudController(Experience, {
  sort: { order: 1, startDate: -1 },
});

// Ensure "current" positions always store endDate as null, whichever
// endpoint is used to create/update the record.
const normalizeBody = (body) => {
  if (body && body.current === true) {
    body.endDate = null;
  }
  return body;
};

const create = async (req, res) => {
  req.body = normalizeBody(req.body);
  return base.create(req, res);
};

const update = async (req, res) => {
  req.body = normalizeBody(req.body);
  return base.update(req, res);
};

module.exports = {
  getExperiences: base.getAll,
  getPublicExperiences: base.getPublic,
  getExperienceById: async (req, res) => {
    try {
      const item = await Experience.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: "Experience not found" });
      }
      res.json({ success: true, data: item });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(404).json({ success: false, message: "Experience not found" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },
  createExperience: create,
  updateExperience: update,
  deleteExperience: base.remove,
  toggleExperience: base.toggle,
};
