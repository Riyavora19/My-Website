import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  // Per-field errors
  const [errors, setErrors] = useState({});

  const setFieldError = (field, msg) =>
    setErrors((prev) => ({ ...prev, [field]: msg }));

  const clearFieldError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  // Live validation on blur
  const validateName = (val) => {
    if (!val.trim()) return "Full name is required";
    if (!/^[a-zA-Z\s]+$/.test(val)) return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (val) => {
    if (!val.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  };

  const validatePassword = (val) => {
    if (!val) return "Password is required";
    if (val.length < 6) return `Too short — ${6 - val.length} more character${6 - val.length > 1 ? "s" : ""} needed`;
    return "";
  };

  const handleRegister = async () => {
    const nameErr = validateName(fullName);
    const enrollErr = !enrollmentNumber.trim() ? "Enrollment number is required" : "";
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const deptErr = !department ? "Please select a department" : "";

    setErrors({ fullName: nameErr, enrollmentNumber: enrollErr, email: emailErr, password: passErr, department: deptErr });

    if (nameErr || enrollErr || emailErr || passErr || deptErr) return;

    try {
      const res = await API.post("/users/register", { fullName, enrollmentNumber, email, password, department });
      localStorage.setItem("user", JSON.stringify({ ...res.data.user, token: res.data.token }));
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => { navigate("/"); window.location.reload(); }, 1000);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Registration failed. Try again." });
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

          {errors.api && <div className="error-msg">⚠️ {errors.api}</div>}
          {message && <div className="success-msg">✅ {message}</div>}

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setFieldError("fullName", validateName(e.target.value));
              }}
              onBlur={(e) => setFieldError("fullName", validateName(e.target.value))}
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && <span className="field-error">⚠ {errors.fullName}</span>}
          </div>

          {/* Enrollment */}
          <div className="form-group">
            <label>Enrollment Number</label>
            <input
              type="text"
              placeholder="e.g. EN2024001"
              value={enrollmentNumber}
              onChange={(e) => { setEnrollmentNumber(e.target.value); clearFieldError("enrollmentNumber"); }}
              onBlur={(e) => { if (!e.target.value.trim()) setFieldError("enrollmentNumber", "Enrollment number is required"); }}
              className={errors.enrollmentNumber ? "input-error" : ""}
            />
            {errors.enrollmentNumber && <span className="field-error">⚠ {errors.enrollmentNumber}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setFieldError("email", validateEmail(e.target.value));
              }}
              onBlur={(e) => setFieldError("email", validateEmail(e.target.value))}
              className={errors.email ? "input-error" : ""}
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
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setFieldError("password", validatePassword(e.target.value));
              }}
              onBlur={(e) => setFieldError("password", validatePassword(e.target.value))}
              className={errors.password ? "input-error" : ""}
            />
            {/* Password strength bar */}
            {password.length > 0 && (
              <div className="password-strength">
                <div className={`strength-bar ${password.length >= 6 ? password.length >= 10 ? "strong" : "medium" : "weak"}`} />
                <span className="strength-label">
                  {password.length < 6 ? `${6 - password.length} more character${6 - password.length > 1 ? "s" : ""} needed`
                    : password.length < 10 ? "Good" : "Strong"}
                </span>
              </div>
            )}
            {errors.password && <span className="field-error">⚠ {errors.password}</span>}
          </div>

          {/* Department */}
          <div className="form-group">
            <label>Department</label>
            <select
              className={`auth-select ${errors.department ? "input-error" : ""}`}
              value={department}
              onChange={(e) => { setDepartment(e.target.value); clearFieldError("department"); }}
            >
              <option value="">Select Department</option>
              <option>Computer</option>
              <option>IT</option>
              <option>Mechanical</option>
            </select>
            {errors.department && <span className="field-error">⚠ {errors.department}</span>}
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
