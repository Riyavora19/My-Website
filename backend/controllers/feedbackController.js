const Feedback = require("../models/Feedback");

// CREATE FEEDBACK
const createFeedback = async (req, res) => {
  try {
    const { title, category, department, message, rating } = req.body;

    if (!title || !category || !department || !message || !rating) {
      return res.status(400).json({ message: "All fields required" });
    }

    const feedback = await Feedback.create({
      title,
      category,
      department,
      message,
      rating,
      user: req.user._id, // from JWT middleware
    });

    res.status(201).json(feedback);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL FEEDBACK
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 }); // newest first
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE FEEDBACK (Admin)
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createFeedback, getFeedbacks, deleteFeedback };
