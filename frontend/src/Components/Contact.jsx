import "./Contact.css";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent!");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="contact-page">

      {/* Header */}
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We’re here to help you. Reach out for any support or queries.</p>
      </section>

      {/* Main Section */}
      <section className="contact-container">

        {/* Left - Contact Info */}
        <div className="contact-info">
          <h2>Get in Touch</h2>

          <div className="info-box">
            <h4>📍 Address</h4>
            <p>University Campus, Ahmedabad, Gujarat</p>
          </div>

          <div className="info-box">
            <h4>📧 Email</h4>
            <p>support@university.com</p>
          </div>

          <div className="info-box">
            <h4>📞 Phone</h4>
            <p>+91 98765 43210</p>
          </div>

          <div className="info-box">
            <h4>⏰ Working Hours</h4>
            <p>Monday – Saturday | 9:00 AM – 5:00 PM</p>
          </div>
        </div>

        {/* Right - Form */}
        <div className="contact-form">
          <h2>Send Message</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

      </section>

      {/* Footer */}
      <footer className="contact-footer">
        © 2026 University Feedback & Issue Tracking System
      </footer>
    </div>
  );
};

export default Contact;
