import "./Home.css";
import SubmitFeedback from "./SubmitFeedback";
import { useState } from "react";
import RaiseIssue from "./RaiseIssue";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>University Feedback & Issue Tracking System</h1>
          <p>
            A centralized platform for students to raise issues, track progress,
            and share feedback with the university.
          </p>

          <div className="hero-actions">
            {!isLoggedIn ? (
              <button
                className="primary-btn"
                onClick={() => navigate("/login")}
              >
                Get Started
              </button>
            ) : (
              <button
                className="primary-btn"
                onClick={() => setShowModal(true)}
              >
                Raise Issue
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section (Professional look) */}
      <section className="stats">
        <div className="stat-box">
          <h2>500+</h2>
          <p>Issues Resolved</p>
        </div>
        <div className="stat-box">
          <h2>20+</h2>
          <p>Departments</p>
        </div>
        <div className="stat-box">
          <h2>1000+</h2>
          <p>Students Registered</p>
        </div>
      </section>

      {/* Features */}
      <section className="features">

        {/* Raise Ticket */}
        <div className="feature-card">
          <div className="icon">📩</div>
          <h3>Raise Issue</h3>
          <p>Submit complaints easily to the concerned department.</p>

          {isLoggedIn ? (
            <button onClick={() => setShowFeedbackModal(true)}>
              Open
            </button>
          ) : (
            <span className="login-msg">Login required</span>
          )}
        </div>

        {/* Track Status */}
        <div className="feature-card">
          <div className="icon">📊</div>
          <h3>Track Status</h3>
          <p>Monitor real-time progress of your complaints.</p>

          {isLoggedIn ? (
            <button onClick={() => navigate("/track-status")}>
              Open
            </button>
          ) : (
            <span className="login-msg">Login required</span>
          )}
        </div>

        {/* Feedback */}
        <div className="feature-card">
          <div className="icon">💬</div>
          <h3>Submit Feedback</h3>
          <p>Share suggestions to improve university services.</p>

          {isLoggedIn ? (
            <button onClick={() => navigate("/submit-feedback")}>
              Open
            </button>
          ) : (
            <span className="login-msg">Login required</span>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © 2026 University Feedback & Issue Tracking System
      </footer>

      {/* Modal */}
      {showModal && isLoggedIn && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <RaiseIssue onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Home;

