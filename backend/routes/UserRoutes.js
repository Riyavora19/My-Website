const express = require("express");
const router = express.Router();
const {
  createUser, loginUser, getMe, updateUser, getAllUsers, deleteUser, adminUpdateUser,
} = require("../controllers/UserController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.post("/register", createUser);
router.post("/login", loginUser);

// Student profile (needs token)
router.get("/me", protect, getMe);
router.post("/update/:id", protect, updateUser);

// Admin — no token required
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);
router.put("/admin-update/:id", adminUpdateUser);

module.exports = router;
