const makeCrudController = (Model, options = {}) => {
  const sort = options.sort || { order: 1, createdAt: -1 };
  const visibilityField = options.visibilityField || "visible";

  const getAll = async (req, res) => {
    try {
      const data = await Model.find().sort(sort);
      res.json({ success: true, count: data.length, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  const getPublic = async (req, res) => {
    try {
      const filter = { [visibilityField]: true };
      const data = await Model.find(filter).sort(sort);
      res.json({ success: true, count: data.length, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  const getPublicById = async (req, res) => {
    try {
      const filter = { _id: req.params.id, [visibilityField]: true };
      const data = await Model.findOne(filter);
      if (!data) return res.status(404).json({ success:false, message:"Public record not found" });
      res.json({ success:true, data });
    } catch (error) { res.status(500).json({ success:false, message:error.message }); }
  };

  const create = async (req, res) => {
    try {
      const data = await Model.create(req.body);
      res.status(201).json({ success: true, message: "Created successfully", data });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
  };

  const update = async (req, res) => {
    try {
      const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!data) return res.status(404).json({ success: false, message: "Record not found" });
      res.json({ success: true, message: "Updated successfully", data });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
  };

  const remove = async (req, res) => {
    try {
      const data = await Model.findByIdAndDelete(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: "Record not found" });
      res.json({ success: true, message: "Deleted successfully" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  const toggle = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: "Record not found" });
      item[visibilityField] = !Boolean(item[visibilityField]);
      await item.save();
      res.json({ success: true, message: item[visibilityField] ? "Shown publicly" : "Hidden publicly", data: item });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
  };

  return { getAll, getPublic, getPublicById, create, update, remove, toggle };
};
module.exports = makeCrudController;
