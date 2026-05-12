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

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Only show main Navbar on non-admin pages
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/raise-issue"     element={<ProtectedRoute><RaiseIssue /></ProtectedRoute>} />
        <Route path="/track-status"    element={<ProtectedRoute><TrackStatus /></ProtectedRoute>} />
        <Route path="/submit-feedback" element={<ProtectedRoute><SubmitFeedback /></ProtectedRoute>} />
        <Route path="/features"        element={<ProtectedRoute><Features /></ProtectedRoute>} />
        <Route path="/about"           element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/contact"         element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin"           element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
