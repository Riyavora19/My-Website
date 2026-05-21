import "./AdminPanel.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin-login");
    window.location.reload();
  };
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // User modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserView, setShowUserView] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState(false);

  // Issue view modal
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueView, setShowIssueView] = useState(false);

  // Feedback view modal
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showFeedbackView, setShowFeedbackView] = useState(false);

  // Filters
  const [filters, setFilters] = useState({ search: "", status: "", department: "", priority: "", date: "" });

  useEffect(() => {
    fetchUsers();
    fetchIssues();
    fetchFeedbacks();
  }, []);

  const fetchUsers = async () => {
    try { const res = await API.get("/users"); setUsers(res.data); } catch {}
  };
  const fetchIssues = async () => {
    try { const res = await API.get("/issues"); setIssues(res.data); } catch {}
  };
  const fetchFeedbacks = async () => {
    try { const res = await API.get("/feedback"); setFeedbacks(res.data); } catch {}
  };

  // ── User actions ──────────────────────────────────────────────────────────
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleUpdateUser = async () => {
    await API.put(`/users/admin-update/${selectedUser._id}`, selectedUser);
    setShowUserEdit(false);
    fetchUsers();
  };

  // ── Issue actions ─────────────────────────────────────────────────────────
  const handleViewIssue = (issue) => {
    setSelectedIssue(issue);
    setShowIssueView(true);
  };

  const handleResolve = async (id) => {
    try {
      await API.put(`/issues/${id}`, { status: "Resolved" });
      await fetchIssues();
      // Update the modal if it's open
      setSelectedIssue((prev) =>
        prev?._id === id ? { ...prev, status: "Resolved" } : prev
      );
    } catch (err) {
      alert("Failed to resolve issue");
    }
  };

  const handleDeleteIssue = async (id) => {
    if (!window.confirm("Delete this issue?")) return;
    await API.delete(`/issues/${id}`);
    setShowIssueView(false);
    fetchIssues();
  };

  // ── Feedback actions ──────────────────────────────────────────────────────
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    await API.delete(`/feedback/${id}`);
    fetchFeedbacks();
  };

  const clearFilters = () => setFilters({ search: "", status: "", department: "", priority: "", date: "" });

  // ── Filter issues ─────────────────────────────────────────────────────────
  const filteredIssues = issues.filter((issue) => {
    const s = filters.search.toLowerCase();
    return (
      (!s || issue.title?.toLowerCase().includes(s) || issue.user?.fullName?.toLowerCase().includes(s)) &&
      (!filters.status || issue.status === filters.status) &&
      (!filters.department || issue.department === filters.department) &&
      (!filters.priority || issue.priority === filters.priority) &&
      (!filters.date || new Date(issue.createdAt).toLocaleDateString("en-CA") === filters.date)
    );
  });

  const departments = [...new Set(issues.map((i) => i.department).filter(Boolean))];
  const resolved = issues.filter((i) => i.status === "Resolved").length;
  const pending = issues.filter((i) => i.status === "Pending").length;

  const navItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "users", icon: "👥", label: "Users" },
    { key: "issues", icon: "📋", label: "Issues" },
    { key: "feedback", icon: "💬", label: "Feedback" },
  ];

  const renderContent = () => {
    switch (activeTab) {

      case "dashboard":
        return (
          <div className="cards">
            <div className="card primary"><div className="card-icon">👥</div><h3>{users.length}</h3><p>Total Users</p></div>
            <div className="card info"><div className="card-icon">📋</div><h3>{issues.length}</h3><p>Total Issues</p></div>
            <div className="card success"><div className="card-icon">✅</div><h3>{resolved}</h3><p>Resolved</p></div>
            <div className="card warning"><div className="card-icon">🕐</div><h3>{pending}</h3><p>Pending</p></div>
          </div>
        );

      case "users":
        return (
          <div className="content-box">
            <div className="content-box-header">
              <h2>Users</h2>
              <span className="record-count">{users.length} records</span>
            </div>
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Enrollment</th><th>Department</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.fullName}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.enrollmentNumber || "—"}</td>
                    <td>{u.department}</td>
                    <td>
                      <div className="action-cell">
                        <button className="btn view" onClick={() => { setSelectedUser(u); setShowUserView(true); }}>View</button>
                        <button className="btn edit" onClick={() => { setSelectedUser({ ...u }); setShowUserEdit(true); }}>Edit</button>
                        <button className="btn delete" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "issues":
        return (
          <div className="content-box">
            <div className="content-box-header">
              <h2>Issues</h2>
              <span className="record-count">{filteredIssues.length} / {issues.length} records</span>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="filter-search">
                <span className="filter-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by title or student..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                <option value="">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
                <option value="">All Priorities</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
              <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
              {(filters.search || filters.status || filters.department || filters.priority || filters.date) && (
                <button className="btn-clear" onClick={clearFilters}>✕ Clear</button>
              )}
            </div>

            <table className="table">
              <thead>
                <tr><th>Title</th><th>Student</th><th>Dept</th><th>Priority</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredIssues.length === 0 ? (
                  <tr><td colSpan="7" className="no-results">No issues match the selected filters</td></tr>
                ) : (
                  filteredIssues.map((issue) => (
                    <tr key={issue._id}>
                      <td><strong>{issue.title}</strong></td>
                      <td>{issue.user?.fullName || "N/A"}</td>
                      <td>{issue.department}</td>
                      <td>
                        <span className={`priority-badge ${issue.priority?.toLowerCase()}`}>
                          {issue.priority === "High" ? "🔴" : issue.priority === "Medium" ? "🟡" : "🟢"} {issue.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${issue.status === "Resolved" ? "resolved" : issue.status === "In Progress" ? "in-progress" : "pending"}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td>{new Date(issue.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td>
                        <div className="action-cell">
                          {/* View button — always visible */}
                          <button className="btn view" onClick={() => handleViewIssue(issue)}>View</button>
                          {/* Resolve only if not already resolved */}
                          {issue.status !== "Resolved" && (
                            <button className="btn resolve" onClick={() => handleResolve(issue._id)}>Resolve</button>
                          )}
                          <button className="btn delete" onClick={() => handleDeleteIssue(issue._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case "feedback":
        return (
          <div className="content-box">
            <div className="content-box-header">
              <h2>Feedback</h2>
              <span className="record-count">{feedbacks.length} records</span>
            </div>
            <table className="table">
              <thead>
                <tr><th>Title</th><th>Student</th><th>Department</th><th>Rating</th><th>Message</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb._id}>
                    <td><strong>{fb.title}</strong></td>
                    <td>{fb.user?.fullName || "N/A"}</td>
                    <td>{fb.department}</td>
                    <td>
                      <span className="rating-badge">
                        {"⭐".repeat(parseInt(fb.rating) || 0)} {fb.rating}
                      </span>
                    </td>
                    <td className="message-preview">{fb.message}</td>
                    <td>
                      <div className="action-cell">
                        <button className="btn view" onClick={() => { setSelectedFeedback(fb); setShowFeedbackView(true); }}>View</button>
                        <button className="btn delete" onClick={() => handleDeleteFeedback(fb._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div>
      {/* Admin Navbar */}
      <header className="admin-navbar">
        <div className="admin-navbar-logo">
          <img src="/Logo.png" alt="logo" className="admin-logo-img" />
        </div>
        <div className="admin-navbar-title">Admin Panel</div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </header>

      <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">🛠</span>
          <span className="logo">Admin Panel</span>
        </div>
        <p className="sidebar-section-label">Navigation</p>
        <ul>
          {navItems.map((item) => (
            <li key={item.key} className={activeTab === item.key ? "active" : ""} onClick={() => setActiveTab(item.key)}>
              {item.icon} {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="topbar">
          <h1>{navItems.find((n) => n.key === activeTab)?.icon} {navItems.find((n) => n.key === activeTab)?.label}</h1>
          <div className="admin-info">👤 Administrator</div>
        </div>
        {renderContent()}
      </div>

      {/* ── ISSUE VIEW MODAL ── */}
      {showIssueView && selectedIssue && (
        <div className="modal" onClick={() => setShowIssueView(false)}>
          <div className="modal-box issue-modal-box" onClick={(e) => e.stopPropagation()}>

            <div className="issue-modal-header">
              <h3>📋 Issue Details</h3>
              <button className="modal-close-btn" onClick={() => setShowIssueView(false)}>×</button>
            </div>

            <div className="issue-modal-body">
              <div className="issue-modal-title">{selectedIssue.title}</div>

              <div className="issue-modal-meta">
                <div className="meta-item">
                  <span className="meta-label">Student</span>
                  <span className="meta-value">👤 {selectedIssue.user?.fullName || "N/A"}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Email</span>
                  <span className="meta-value">{selectedIssue.user?.email || "—"}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Department</span>
                  <span className="meta-value">🏢 {selectedIssue.department}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Category</span>
                  <span className="meta-value">{selectedIssue.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Priority</span>
                  <span className={`priority-badge ${selectedIssue.priority?.toLowerCase()}`}>
                    {selectedIssue.priority === "High" ? "🔴" : selectedIssue.priority === "Medium" ? "🟡" : "🟢"} {selectedIssue.priority}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className={`badge ${selectedIssue.status === "Resolved" ? "resolved" : selectedIssue.status === "In Progress" ? "in-progress" : "pending"}`}>
                    {selectedIssue.status}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Submitted</span>
                  <span className="meta-value">
                    {new Date(selectedIssue.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                {selectedIssue.status === "Resolved" && (
                  <div className="meta-item">
                    <span className="meta-label">Resolved By</span>
                    <span className="meta-value">✅ {selectedIssue.resolvedBy?.fullName || "Admin"}</span>
                  </div>
                )}
              </div>

              <div className="issue-description-box">
                <span className="meta-label">Description</span>
                <p>{selectedIssue.description}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn cancel" onClick={() => setShowIssueView(false)}>Close</button>
              <button className="btn delete" onClick={() => handleDeleteIssue(selectedIssue._id)}>Delete</button>
              {selectedIssue.status !== "Resolved" && (
                <button className="btn resolve-modal" onClick={() => handleResolve(selectedIssue._id)}>
                  ✅ Mark as Resolved
                </button>
              )}
              {selectedIssue.status === "Resolved" && (
                <span className="resolved-tag">✅ Already Resolved</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── USER VIEW MODAL ── */}
      {showUserView && selectedUser && (
        <div className="modal" onClick={() => setShowUserView(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>👤 User Details</h3>
            <p><b>Name</b> {selectedUser.fullName}</p>
            <p><b>Email</b> {selectedUser.email}</p>
            <p><b>Enrollment</b> {selectedUser.enrollmentNumber || "—"}</p>
            <p><b>Department</b> {selectedUser.department}</p>
            <p><b>Role</b> {selectedUser.role}</p>
            <div className="modal-footer">
              <button className="btn cancel" onClick={() => setShowUserView(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── USER EDIT MODAL ── */}
      {showUserEdit && selectedUser && (
        <div className="modal" onClick={() => setShowUserEdit(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Edit User</h3>
            <input value={selectedUser.fullName} placeholder="Full Name" onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })} />
            <input value={selectedUser.email} placeholder="Email" onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
            <input value={selectedUser.department} placeholder="Department" onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })} />
            <div className="modal-footer">
              <button className="btn cancel" onClick={() => setShowUserEdit(false)}>Cancel</button>
              <button className="btn update" onClick={handleUpdateUser}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FEEDBACK VIEW MODAL ── */}
      {showFeedbackView && selectedFeedback && (
        <div className="modal" onClick={() => setShowFeedbackView(false)}>
          <div className="feedback-modal-box" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="feedback-modal-header">
              <div className="feedback-modal-icon">💬</div>
              <div>
                <h3>Feedback Details</h3>
                <p className="feedback-modal-subtitle">Submitted by {selectedFeedback.user?.fullName || "N/A"}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowFeedbackView(false)}>×</button>
            </div>

            {/* Title */}
            <div className="feedback-modal-title">{selectedFeedback.title}</div>

            {/* Info Grid */}
            <div className="feedback-info-grid">
              <div className="feedback-info-item">
                <span className="meta-label">👤 Student</span>
                <span className="meta-value">{selectedFeedback.user?.fullName || "N/A"}</span>
              </div>
              <div className="feedback-info-item">
                <span className="meta-label">📧 Email</span>
                <span className="meta-value">{selectedFeedback.user?.email || "—"}</span>
              </div>
              <div className="feedback-info-item">
                <span className="meta-label">📁 Category</span>
                <span className="meta-value">{selectedFeedback.category}</span>
              </div>
              <div className="feedback-info-item">
                <span className="meta-label">🏢 Department</span>
                <span className="meta-value">{selectedFeedback.department}</span>
              </div>
              <div className="feedback-info-item">
                <span className="meta-label">⭐ Rating</span>
                <div className="feedback-stars">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} style={{ color: s <= parseInt(selectedFeedback.rating) ? "#f59e0b" : "#e2e8f0", fontSize: "18px" }}>★</span>
                  ))}
                  <span className="feedback-rating-text">{selectedFeedback.rating}</span>
                </div>
              </div>
              <div className="feedback-info-item">
                <span className="meta-label">📅 Submitted</span>
                <span className="meta-value">
                  {new Date(selectedFeedback.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="feedback-message-box">
              <span className="meta-label">💬 Message</span>
              <p>{selectedFeedback.message}</p>
            </div>

            {/* Footer */}
            <div className="feedback-modal-footer">
              <button className="btn cancel" onClick={() => setShowFeedbackView(false)}>Close</button>
              <button className="btn delete" onClick={() => { handleDeleteFeedback(selectedFeedback._id); setShowFeedbackView(false); }}>🗑 Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminPanel;
