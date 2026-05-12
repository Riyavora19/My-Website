const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getMe,
  updateUser,
  getAllUsers,
  deleteUser,
  adminUpdateUser,
} = require("../controllers/UserController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public
router.post("/register", createUser);
router.post("/login", loginUser);

// Protected (logged-in user)
router.get("/me", protect, getMe);
router.post("/update/:id", protect, updateUser);

// Get all users (protected - any logged in user for now)
router.get("/", protect, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);
router.put("/admin-update/:id", protect, adminOnly, adminUpdateUser);

module.exports = router;
