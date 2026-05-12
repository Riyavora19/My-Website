const express = require("express");
const router = express.Router();
const { createFeedback, getFeedbacks } = require("../controllers/feedbackController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createFeedback);
router.get("/", protect, getFeedbacks);
router.delete("/:id", protect, require("../controllers/feedbackController").deleteFeedback);

module.exports = router;
