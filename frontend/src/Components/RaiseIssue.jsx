import { useState } from "react";
import "./RaiseIssue.css";
import API from "../api/axios";

const RaiseIssue = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "", description: "", category: "", department: "", priority: "Low",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // No need to send user ID — backend reads it from JWT token
      await API.post("/issues", formData);
      alert("Issue submitted successfully!");
      setFormData({ title: "", description: "", category: "", department: "", priority: "Low" });
      if (onClose) onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting issue");
    }
  };

  return (
    <div className="issue-card">
      <div className="issue-card-header">
        <h2>📩 Raise an Issue</h2>
        <span className="close-btn" onClick={onClose}>×</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Issue Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter a clear, concise title" required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the issue in detail..." required />

        <div className="form-row">
          <div>
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Technical">Technical</option>
              <option value="Academic">Academic</option>
              <option value="Facility">Facility</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Department</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="Library">Library</option>
              <option value="Admin">Admin</option>
              <option value="Hostel">Hostel</option>
            </select>
          </div>
        </div>

        <label>Priority</label>
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🔴 High</option>
        </select>

        <button type="submit" className="submit-btn">Submit Issue</button>
      </form>
    </div>
  );
};

export default RaiseIssue;
