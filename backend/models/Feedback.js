const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    department: String,
    message: String,
    rating: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);