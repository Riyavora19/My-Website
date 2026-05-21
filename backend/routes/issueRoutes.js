const express = require("express");
const router = express.Router();
const { createIssue, getIssues, updateIssueStatus, deleteIssue } = require("../controllers/issueController");
const { protect } = require("../middleware/authMiddleware");

// Student submitting needs token (so we know who submitted)
router.post("/", protect, createIssue);

// Read/update/delete — no token required (admin access)
router.get("/", getIssues);
router.put("/:id", updateIssueStatus);
router.delete("/:id", deleteIssue);

module.exports = router;
