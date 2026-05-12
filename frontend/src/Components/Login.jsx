import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    try {
      const res = await API.post("/users/login", { email, password });
      // Store user data + JWT token together
      localStorage.setItem("user", JSON.stringify({ ...res.data.user, token: res.data.token }));
      setMessage("Login successful! Redirecting...");
      setTimeout(() => { navigate("/"); window.location.reload(); }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
          <h1>Welcome back to your portal</h1>
          <p>Access your dashboard to raise issues, track complaints, and share feedback with the university.</p>
          <div className="auth-features">
            <div className="auth-feature-item"><span>📩</span><span>Raise & track issues easily</span></div>
            <div className="auth-feature-item"><span>📊</span><span>Real-time status updates</span></div>
            <div className="auth-feature-item"><span>💬</span><span>Submit feedback anytime</span></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>Sign in</h2>
          <p className="auth-subtitle">Enter your credentials to access your account</p>

          {error && <div className="error-msg">⚠️ {error}</div>}
          {message && <div className="success-msg">{message}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@university.edu" value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>

          <button className="auth-btn" onClick={handleLogin}>Sign In</button>

          <p className="auth-footer">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Create one here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
