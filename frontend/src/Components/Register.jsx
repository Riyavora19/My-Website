import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  const handleRegister = async () => {
    if (!fullName || !enrollmentNumber || !email || !password || !department) {
      setError("Please fill all fields"); return;
    }
    try {
      const res = await API.post("/users/register", { fullName, enrollmentNumber, email, password, department });
      // Auto-login after register — save user + token
      localStorage.setItem("user", JSON.stringify({ ...res.data.user, token: res.data.token }));
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => { navigate("/"); window.location.reload(); }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <span className="auth-brand-icon">🎓</span>
            <span className="auth-brand-name">UniPortal</span>
          </div>
          <h1>Join the university portal today</h1>
          <p>Create your student account to raise issues, track complaints, and submit feedback easily.</p>
          <div className="auth-features">
            <div className="auth-feature-item"><span>🔒</span><span>Secure student accounts</span></div>
            <div className="auth-feature-item"><span>⚡</span><span>Instant issue submission</span></div>
            <div className="auth-feature-item"><span>📱</span><span>Track from anywhere</span></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>Create account</h2>
          <p className="auth-subtitle">Fill in your details to get started</p>

          {error && <div className="error-msg">⚠️ {error}</div>}
          {message && <div className="success-msg">✅ {message}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your full name" onChange={(e) => { setFullName(e.target.value); setError(""); }} />
          </div>
          <div className="form-group">
            <label>Enrollment Number</label>
            <input type="text" placeholder="e.g. EN2024001" onChange={(e) => { setEnrollmentNumber(e.target.value); setError(""); }} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@university.edu" onChange={(e) => { setEmail(e.target.value); setError(""); }} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min. 6 characters" onChange={(e) => { setPassword(e.target.value); setError(""); }} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select className="auth-select" onChange={(e) => { setDepartment(e.target.value); setError(""); }}>
              <option value="">Select Department</option>
              <option>Computer</option>
              <option>IT</option>
              <option>Mechanical</option>
            </select>
          </div>

          <button className="auth-btn" onClick={handleRegister}>Create Account</button>

          <p className="auth-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Sign in here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
