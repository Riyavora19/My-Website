import { useState } from "react";
import "./SubmitFeedback.css";
import API from "../api/axios";

const SubmitFeedback = () => {
  const [formData, setFormData] = useState({ title: "", category: "", department: "", message: "", rating: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // No need to send user ID — backend reads it from JWT token
      await API.post("/feedback", formData);
      setSubmitted(true);
      setFormData({ title: "", category: "", department: "", message: "", rating: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting feedback");
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <div className="feedback-card-header">
          <h2>💬 Submit Feedback</h2>
          <p>Help us improve university services with your feedback</p>
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
      </div>
    </div>
  );
};

export default SubmitFeedback;
