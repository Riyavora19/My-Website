import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const setFieldError = (field, msg) => setErrors((prev) => ({ ...prev, [field]: msg }));
  const clearFieldError = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

  const validateEmail = (val) => {
    if (!val.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  };

  const validatePassword = (val) => {
    if (!val) return "Password is required";
    if (val.length < 6) return `Password must be at least 6 characters`;
    return "";
  };

  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr) return;

    try {
      const res = await API.post("/users/login", { email, password });
      localStorage.setItem("user", JSON.stringify({ ...res.data.user, token: res.data.token }));
      setMessage("Login successful! Redirecting...");
      setTimeout(() => { navigate("/"); window.location.reload(); }, 800);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Login failed. Please try again." });
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

          {errors.api && <div className="error-msg">⚠️ {errors.api}</div>}
          {message && <div className="success-msg">✅ {message}</div>}

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@university.edu"
              value={email}
              className={errors.email ? "input-error" : ""}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setFieldError("email", validateEmail(e.target.value)); }}
              onBlur={(e) => setFieldError("email", validateEmail(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {errors.email && <span className="field-error">⚠ {errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              className={errors.password ? "input-error" : ""}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setFieldError("password", validatePassword(e.target.value)); }}
              onBlur={(e) => setFieldError("password", validatePassword(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {errors.password && <span className="field-error">⚠ {errors.password}</span>}
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
