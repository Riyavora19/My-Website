import "./Home.css";
import { useState } from "react";
import RaiseIssue from "./RaiseIssue";
import SubmitFeedback from "./SubmitFeedback";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <div className="home-page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>University Feedback & Issue Tracking System</h1>
          <p>A centralized platform for students to raise issues, track progress, and share feedback with the university.</p>
          <div className="hero-actions">
            {!isLoggedIn ? (
              <button className="primary-btn" onClick={() => navigate("/login")}>Get Started</button>
            ) : (
              <button className="primary-btn" onClick={() => setShowIssueModal(true)}>Raise Issue</button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stat-box"><h2>500+</h2><p>Issues Resolved</p></div>
        <div className="stat-box"><h2>20+</h2><p>Departments</p></div>
        <div className="stat-box"><h2>1000+</h2><p>Students Registered</p></div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <div className="icon">📩</div>
          <h3>Raise Issue</h3>
          <p>Submit complaints easily to the concerned department.</p>
          {isLoggedIn ? (
            <button onClick={() => setShowIssueModal(true)}>Open</button>
          ) : (
            <span className="login-msg">Login required</span>
          )}
        </div>

        <div className="feature-card">
          <div className="icon">📊</div>
          <h3>Track Status</h3>
          <p>Monitor real-time progress of your complaints.</p>
          {isLoggedIn ? (
            <button onClick={() => navigate("/track-status")}>Open</button>
          ) : (
            <span className="login-msg">Login required</span>
          )}
        </div>

        <div className="feature-card">
          <div className="icon">💬</div>
          <h3>Submit Feedback</h3>
          <p>Share suggestions to improve university services.</p>
          {isLoggedIn ? (
            <button onClick={() => setShowFeedbackModal(true)}>Open</button>
          ) : (
            <span className="login-msg">Login required</span>
          )}
        </div>
      </section>

      <footer className="footer">© 2026 University Feedback & Issue Tracking System</footer>

      {/* Raise Issue Modal */}
      {showIssueModal && isLoggedIn && (
        <div className="modal-overlay" onClick={() => setShowIssueModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <RaiseIssue onClose={() => setShowIssueModal(false)} />
          </div>
        </div>
      )}

      {/* Submit Feedback Modal */}
      {showFeedbackModal && isLoggedIn && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-container feedback-modal-container" onClick={(e) => e.stopPropagation()}>
            <SubmitFeedback onClose={() => setShowFeedbackModal(false)} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
