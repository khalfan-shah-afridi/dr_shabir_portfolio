const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  sendContactMessage,
  getAllMessages,
  getUnreadCount,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
} = require("../controllers/contactController");

const router = express.Router();

// Public - visitor submits the contact form
router.post("/", sendContactMessage);

// Admin - manage contact messages
router.get("/unread-count", protect, getUnreadCount);
router.get("/", protect, getAllMessages);
router.get("/:id", protect, getMessageById);
router.patch("/:id/status", protect, updateMessageStatus);
router.delete("/:id", protect, deleteMessage);

module.exports = router;
