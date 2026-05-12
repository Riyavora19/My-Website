const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    enrollmentNumber: {
      type: String,
      required: [true, "Enrollment number is required"],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      enum: ["Computer", "IT", "Mechanical"],
    },

    role: {
  type: String,
  enum: ["student", "admin"],
  default: "student",
},
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);