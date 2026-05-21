const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ── Helper: generate JWT ──────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── Helper: safe user object (no password) ───────────────────────────────────
const safeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  enrollmentNumber: user.enrollmentNumber,
  department: user.department,
  role: user.role,
});

// ================= REGISTER =================
const createUser = async (req, res) => {
  try {
    const { fullName, enrollmentNumber, email, password, department } = req.body;

    // Required fields
    if (!fullName || !enrollmentNumber || !email || !password || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Name — letters and spaces only
    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      return res.status(400).json({ message: "Name can only contain letters and spaces" });
    }

    // Email — valid format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    // Password — min 6 characters
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { enrollmentNumber }],
    });

    if (userExists) {
      return res.status(400).json({ message: "Email or enrollment number already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      enrollmentNumber,
      email,
      password: hashedPassword,
      department,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: safeUser(user),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: safeUser(user),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET MY PROFILE =================
const getMe = async (req, res) => {
  res.json(safeUser(req.user));
};

// ================= UPDATE PROFILE =================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: safeUser(updatedUser),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL USERS (Admin) =================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE USER (Admin) =================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADMIN UPDATE USER =================
const adminUpdateUser = async (req, res) => {
  try {
    const { fullName, email, department } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.department = department || user.department;

    const updatedUser = await user.save();
    res.json({ message: "User updated", user: safeUser(updatedUser) });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getMe,
  updateUser,
  getAllUsers,
  deleteUser,
  adminUpdateUser,
};
