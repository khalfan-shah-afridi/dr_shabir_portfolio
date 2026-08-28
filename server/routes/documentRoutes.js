const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/documentUpload");
const controller = require("../controllers/documentController");

const router = express.Router();
router.use(protect);
router.get("/", controller.listDocuments);
router.post("/", upload.single("file"), controller.createDocument);
router.get("/:id/download", controller.downloadDocument);
router.put("/:id", upload.single("file"), controller.updateDocument);
router.patch("/:id/toggle", controller.toggleDocument);
router.delete("/:id", controller.deleteDocument);
module.exports = router;
