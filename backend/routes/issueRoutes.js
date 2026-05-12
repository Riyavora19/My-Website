const express = require("express");
const router = express.Router();
const {
  createIssue,
  getIssues,
  updateIssueStatus,
  deleteIssue,
} = require("../controllers/issueController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createIssue);
router.get("/", protect, getIssues);
router.put("/:id", protect, updateIssueStatus);
router.delete("/:id", protect, deleteIssue);

module.exports = router;
