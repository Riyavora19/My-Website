import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const ADMIN_EMAIL = "admin@university.com";
const ADMIN_PASSWORD = "admin123";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) { setError("Please fill all fields"); return; }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-logo">
          <img src="/Logo.png" alt="logo" />
        </div>

        <h2>Admin Login</h2>
        <p className="admin-login-subtitle">Access the admin dashboard</p>

        {error && <div className="admin-login-error">⚠️ {error}</div>}

        <div className="admin-login-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@university.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="admin-login-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button className="admin-login-btn" onClick={handleLogin}>
          Login to Admin Panel
        </button>

        <p className="admin-login-back" onClick={() => navigate("/")}>
          ← Back to main site
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
