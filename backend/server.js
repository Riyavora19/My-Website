const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/UserRoutes");
const issueRoutes = require("./routes/issueRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes"); // ✅ ADD

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

// Log every incoming request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/feedback", feedbackRoutes); // ✅ ADD

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});