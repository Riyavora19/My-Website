import "./AdminPanel.css";
import { useState, useEffect } from "react";
import API from "../../api/axios";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchIssues();
    fetchFeedbacks();
  }, []);

  // ================= USERS =================
  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowView(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    await API.put(`/users/admin-update/${selectedUser._id}`, selectedUser);
    setShowEdit(false);
    fetchUsers();
  };

  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ISSUES =================
  const fetchIssues = async () => {
    const res = await API.get("/issues");
    setIssues(res.data);
  };

  const handleResolve = async (id) => {
    try {
      const admin = JSON.parse(localStorage.getItem("user"));

      await API.put(`/issues/${id}`, {
        status: "Resolved",
        adminId: admin?._id,
      });

      fetchIssues();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteIssue = async (id) => {
    if (!window.confirm("Delete issue?")) return;
    await API.delete(`/issues/${id}`);
    fetchIssues();
  };

  // ================= FEEDBACK =================
  const fetchFeedbacks = async () => {
    const res = await API.get("/feedback");
    setFeedbacks(res.data);
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Delete feedback?")) return;
    await API.delete(`/feedback/${id}`);
    fetchFeedbacks();
  };

  // ================= RENDER =================
  const renderContent = () => {
    switch (activeTab) {

      // ===== USERS =====
      case "users":
        return (
          <div className="content-box">
            <h2>Users</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.department}</td>

                    <td className="action-cell">
                      <button className="btn view" onClick={() => handleView(user)}>View</button>
                      <button className="btn edit" onClick={() => handleEdit(user)}>Edit</button>
                      <button className="btn delete" onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      // ===== ISSUES =====
      case "issues":
        return (
          <div className="content-box">
            <h2>Issues</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Resolved By</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id}>
                    <td>{issue.title}</td>
                    <td>{issue.user?.fullName || "N/A"}</td>
                    <td>{issue.department}</td>
                    <td>{issue.priority}</td>
                    <td>{issue.status}</td>

                    <td>
                      {issue.status === "Resolved"
                        ? issue.resolvedBy?.fullName || "Admin"
                        : "-"}
                    </td>

                    <td className="action-cell">
                      <button className="btn edit" onClick={() => handleResolve(issue._id)}>
                        Resolve
                      </button>

                      <button className="btn delete" onClick={() => handleDeleteIssue(issue._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      // ===== FEEDBACK =====
      case "feedback":
        return (
          <div className="content-box">
            <h2>Feedback</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User</th>
                  <th>Department</th>
                  <th>Rating</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb._id}>
                    <td>{fb.title}</td>
                    <td>{fb.user?.fullName || "N/A"}</td>
                    <td>{fb.department}</td>
                    <td>{fb.rating}</td>
                    <td>{fb.message}</td>

                    <td className="action-cell">
                      <button
                        className="btn delete"
                        onClick={() => handleDeleteFeedback(fb._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <ul>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            Users
          </li>
          <li className={activeTab === "issues" ? "active" : ""} onClick={() => setActiveTab("issues")}>
            Issues
          </li>
          <li className={activeTab === "feedback" ? "active" : ""} onClick={() => setActiveTab("feedback")}>
            Feedback
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">
          <h1>Admin Dashboard</h1>
          <div className="admin-info">👤 Admin</div>
        </div>

        {renderContent()}
      </div>

      {/* VIEW MODAL */}
      {showView && selectedUser && (
        <div className="modal" onClick={() => setShowView(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>
            <p><b>Name:</b> {selectedUser.fullName}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Department:</b> {selectedUser.department}</p>
            <button onClick={() => setShowView(false)}>Close</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && selectedUser && (
        <div className="modal" onClick={() => setShowEdit(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit User</h3>

            <input name="fullName" value={selectedUser.fullName} onChange={handleChange} />
            <input name="email" value={selectedUser.email} onChange={handleChange} />
            <input name="department" value={selectedUser.department} onChange={handleChange} />

            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setShowEdit(false)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;