const ContactMessage = require("../models/ContactMessage");
const sendEmail = require("../utils/sendEmail");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required.",
      });
    }

    // Always keep a database copy so a visitor message is not lost if SMTP is temporarily unavailable.
    const savedMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: "New",
    });

    const recipient = process.env.EMAIL_USER;
    if (!recipient) {
      return res.status(503).json({
        success: false,
        saved: true,
        message: "Message was saved, but EMAIL_USER is not configured on the server.",
      });
    }

    const body = [
      "New portfolio contact message",
      "",
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Subject: ${subject.trim()}`,
      "",
      "Message:",
      message.trim(),
    ].join("\n");

    let emailSent = false;

    try {
      await sendEmail(
        recipient,
        `Portfolio Contact: ${subject.trim()}`,
        body,
        email.trim()
      );
      emailSent = true;
    } catch (mailError) {
      // The visitor message is already safely stored in MongoDB.
      // Do not turn a saved contact message into a 502 just because SMTP is unavailable.
      console.error("Contact SMTP delivery failed:", mailError);
    }

    return res.status(200).json({
      success: true,
      saved: true,
      emailSent,
      message: emailSent
        ? "Your message has been sent successfully."
        : "Your message was received successfully. Email notification is temporarily unavailable.",
      messageId: savedMessage._id,
    });
  } catch (error) {
    console.error("Contact message error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now.",
      details: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

// ==========================================
// ADMIN: LIST ALL CONTACT MESSAGES
// ==========================================
const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ADMIN: UNREAD COUNT (for sidebar / dashboard badge)
// ==========================================
const getUnreadCount = async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ status: "New" });
    res.json({ success: true, data: { unread: count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ADMIN: GET ONE MESSAGE (auto-marks as Read when first opened)
// ==========================================
const getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Seen/unread logic: opening a "New" message marks it as Read/seen.
    if (message.status === "New") {
      message.status = "Read";
      await message.save();
    }

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ADMIN: UPDATE MESSAGE STATUS (New / Read / Replied)
// ==========================================
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body || {};

    if (!["New", "Read", "Replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of: New, Read, Replied.",
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, message: "Status updated", data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// ADMIN: DELETE MESSAGE
// ==========================================
const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendContactMessage,
  getAllMessages,
  getUnreadCount,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
};
