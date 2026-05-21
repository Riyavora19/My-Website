import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import RaiseIssue from "./Components/RaiseIssue";
import Navbar from "./Components/Navbar";
import TrackStatus from "./Components/TrackStatus";
import SubmitFeedback from "./Components/SubmitFeedback";
import Features from "./Components/Features";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Profile from "./Components/Profile";
import AdminPanel from "./Components/Admin Panel/AdminPanel";
import AdminLogin from "./Components/AdminLogin";

// Student route guard
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin route guard — checks adminAuth, not user login
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("adminAuth") === "true";
  if (!isAdmin) return <Navigate to="/admin" replace />;
  return children;
};

// Hide main navbar on all /admin routes
const ConditionalNavbar = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return <Navbar />;
};

function App() {
  return (
    <BrowserRouter>
      <ConditionalNavbar />
      <Routes>
        {/* Public student routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected student routes */}
        <Route path="/raise-issue"     element={<ProtectedRoute><RaiseIssue /></ProtectedRoute>} />
        <Route path="/track-status"    element={<ProtectedRoute><TrackStatus /></ProtectedRoute>} />
        <Route path="/submit-feedback" element={<ProtectedRoute><SubmitFeedback /></ProtectedRoute>} />
        <Route path="/features"        element={<ProtectedRoute><Features /></ProtectedRoute>} />
        <Route path="/about"           element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/contact"         element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin routes — completely separate */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
