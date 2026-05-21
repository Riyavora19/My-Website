const express = require("express");
const router = express.Router();
const { createFeedback, getFeedbacks, deleteFeedback } = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

// Student submitting needs token
router.post("/", protect, createFeedback);

// Read/delete — no token required (admin access)
router.get("/", getFeedbacks);
router.delete("/:id", deleteFeedback);

module.exports = router;
