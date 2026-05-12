import { useState } from "react";
import "./SubmitFeedback.css";
import API from "../api/axios";

const CACHE_KEY = "my_feedback";

const SubmitFeedback = ({ onClose }) => {
  const [formData, setFormData] = useState({ title: "", category: "", department: "", message: "", rating: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/feedback", formData);

      // Cache this feedback in localStorage
      const existing = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
      const updated = [res.data, ...existing];
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));

      setSubmitted(true);
      setFormData({ title: "", category: "", department: "", message: "", rating: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting feedback");
    }
  };

  // Load cached feedback to show history
  const cachedFeedback = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <div className="feedback-card-header">
          <h2>💬 Submit Feedback</h2>
          <p>Help us improve university services with your feedback</p>
          {onClose && <span className="feedback-close-btn" onClick={onClose}>×</span>}
        </div>

        {submitted && <div className="success-msg">✅ Feedback submitted successfully! Thank you.</div>}

        <form onSubmit={handleSubmit}>
          <label>Feedback Title</label>
          <input type="text" name="title" placeholder="Brief title for your feedback" value={formData.title} onChange={handleChange} required />

          <div className="form-row">
            <div>
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option>Academic</option>
                <option>Facility</option>
                <option>Faculty</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option>IT</option>
                <option>Admin</option>
                <option>Library</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>

          <label>Your Feedback</label>
          <textarea name="message" placeholder="Share your detailed feedback or suggestions..." value={formData.message} onChange={handleChange} rows="4" required />

          <label>Rating</label>
          <select name="rating" value={formData.rating} onChange={handleChange} required>
            <option value="">Select Rating</option>
            <option>1 - Poor</option>
            <option>2 - Average</option>
            <option>3 - Good</option>
            <option>4 - Very Good</option>
            <option>5 - Excellent</option>
          </select>

          <button type="submit">Submit Feedback</button>
        </form>

        {/* Show previously submitted feedback from cache */}
        {cachedFeedback.length > 0 && (
          <div className="feedback-history">
            <h4>Your Previous Feedback</h4>
            {cachedFeedback.map((fb, i) => (
              <div className="feedback-history-item" key={fb._id || i}>
                <div className="feedback-history-top">
                  <span className="feedback-history-title">{fb.title}</span>
                  <span className="feedback-history-dept">{fb.department}</span>
                </div>
                <p>{fb.message}</p>
                <span className="feedback-history-rating">⭐ {fb.rating}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitFeedback;
