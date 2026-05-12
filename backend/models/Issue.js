const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    department: String,
    priority: String,

    status: {
      type: String,
      default: "Pending",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    resolvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);