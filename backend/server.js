const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/UserRoutes");
const issueRoutes = require("./routes/issueRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes"); // ✅ ADD

dotenv.config();
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
  "https://universityfeedbacktrackingsystem.vercel.app",
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

const allowedOriginPatterns = [
  /^https:\/\/universityfeedbacktrackingsystem(-git-[a-z0-9-]+)?\.vercel\.app$/,
  /^https:\/\/universityfeedbacktrackingsystem-[a-z0-9-]+\.vercel\.app$/,
];

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const normalized = origin.replace(/\/$/, "");
  return (
    allowedOrigins.includes(normalized) ||
    allowedOriginPatterns.some((pattern) => pattern.test(normalized))
  );
};

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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