const Issue = require("../models/Issue");

// CREATE ISSUE
const createIssue = async (req, res) => {
  try {
    const { title, description, category, department, priority } = req.body;

    if (!title || !description || !category || !department) {
      return res.status(400).json({ message: "All fields required" });
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      department,
      priority,
      user: req.user._id, // from JWT middleware
    });

    res.status(201).json(issue);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ISSUES
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("user", "fullName email")
      .populate("resolvedBy", "fullName")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ISSUE STATUS (Admin)
const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.status = status;

    if (status === "Resolved") {
      issue.resolvedBy = req.user._id; // use JWT user, not body
      issue.resolvedAt = new Date();
    }

    await issue.save();
    res.json(issue);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ISSUE (Admin)
const deleteIssue = async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Issue deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createIssue, getIssues, updateIssueStatus, deleteIssue };
