import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ _id: "", fullName: "", email: "", department: "", enrollmentNumber: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [myIssues, setMyIssues] = useState([]);
  const [myFeedback, setMyFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState("issues");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) { navigate("/login"); return; }
    setUser(storedUser);

    // Load from cache instantly
    const cachedIssues = JSON.parse(localStorage.getItem("my_issues") || "[]");
    const cachedFeedback = JSON.parse(localStorage.getItem("my_feedback") || "[]");
    setMyIssues(cachedIssues);
    setMyFeedback(cachedFeedback);

    // Fetch fresh from API
    fetchMyData(storedUser._id);
  }, [navigate]);

  const fetchMyData = async (userId) => {
    try {
      const [issuesRes, feedbackRes] = await Promise.all([
        API.get("/issues"),
        API.get("/feedback"),
      ]);
      const issues = issuesRes.data.filter((i) => i.user?._id === userId);
      const feedback = feedbackRes.data.filter((f) => f.user?._id === userId);
      setMyIssues(issues);
      setMyFeedback(feedback);
      localStorage.setItem("my_issues", JSON.stringify(issues));
      localStorage.setItem("my_feedback", JSON.stringify(feedback));
    } catch {}
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await API.post(`/users/update/${user._id}`, { fullName: user.fullName, email: user.email });
      const updated = { ...JSON.parse(localStorage.getItem("user")), ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setIsEditing(false);
    } catch { alert("Update failed"); }
  };

  const statusColor = { Pending: "#f59e0b", "In Progress": "#3b82f6", Resolved: "#10b981" };

  return (
    <div className="profile-page">

      {/* Left — Profile Card */}
      <div className="profile-sidebar">
        <div className="profile-avatar">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
        </div>

        <h2 className="profile-name">{user.fullName || "Student"}</h2>
        <p className="profile-dept">{user.department || "University Portal"}</p>

        <div className="profile-divider" />

        <div className="profile-field">
          <label>Full Name</label>
          {isEditing ? <input type="text" name="fullName" value={user.fullName} onChange={handleChange} /> : <p>{user.fullName}</p>}
        </div>

        <div className="profile-field">
          <label>Email Address</label>
          {isEditing ? <input type="email" name="email" value={user.email} onChange={handleChange} /> : <p>{user.email}</p>}
        </div>

        {user.enrollmentNumber && (
          <div className="profile-field">
            <label>Enrollment No.</label>
            <p>{user.enrollmentNumber}</p>
          </div>
        )}

        {user.department && (
          <div className="profile-field">
            <label>Department</label>
            <p>{user.department}</p>
          </div>
        )}

        <div className="profile-divider" />

        <div className="profile-stats">
          <div className="profile-stat">
            <span>{myIssues.length}</span>
            <p>Issues</p>
          </div>
          <div className="profile-stat">
            <span>{myFeedback.length}</span>
            <p>Feedback</p>
          </div>
          <div className="profile-stat">
            <span>{myIssues.filter(i => i.status === "Resolved").length}</span>
            <p>Resolved</p>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-buttons">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>

      {/* Right — Activity */}
      <div className="profile-content">

        {/* Tabs */}
        <div className="profile-tabs">
          <button className={`profile-tab ${activeTab === "issues" ? "active" : ""}`} onClick={() => setActiveTab("issues")}>
            📋 My Issues <span className="tab-count">{myIssues.length}</span>
          </button>
          <button className={`profile-tab ${activeTab === "feedback" ? "active" : ""}`} onClick={() => setActiveTab("feedback")}>
            💬 My Feedback <span className="tab-count">{myFeedback.length}</span>
          </button>
        </div>

        {/* Issues Tab */}
        {activeTab === "issues" && (
          <div className="activity-list">
            {myIssues.length === 0 ? (
              <div className="activity-empty">
                <span>📋</span>
                <p>No issues submitted yet</p>
              </div>
            ) : (
              myIssues.map((issue) => (
                <div className="activity-card" key={issue._id}>
                  <div className="activity-card-top">
                    <strong>{issue.title}</strong>
                    <span className="activity-status" style={{ background: statusColor[issue.status] + "20", color: statusColor[issue.status] }}>
                      {issue.status}
                    </span>
                  </div>
                  <p className="activity-desc">{issue.description}</p>
                  <div className="activity-meta">
                    <span>🏢 {issue.department}</span>
                    <span>⚡ {issue.priority}</span>
                    <span>📅 {new Date(issue.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    {issue.status === "Resolved" && <span>✅ Resolved by Admin</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="activity-list">
            {myFeedback.length === 0 ? (
              <div className="activity-empty">
                <span>💬</span>
                <p>No feedback submitted yet</p>
              </div>
            ) : (
              myFeedback.map((fb) => (
                <div className="activity-card" key={fb._id}>
                  <div className="activity-card-top">
                    <strong>{fb.title}</strong>
                    <span className="activity-rating">
                      {"⭐".repeat(parseInt(fb.rating) || 0)}
                    </span>
                  </div>
                  <p className="activity-desc">{fb.message}</p>
                  <div className="activity-meta">
                    <span>📁 {fb.category}</span>
                    <span>🏢 {fb.department}</span>
                    <span>📅 {new Date(fb.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
