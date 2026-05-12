import "./About.css";

const About = () => {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Our System</h1>
        <p>
          A smart platform for students to raise issues, track progress, and improve university services.
        </p>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stat-card">
          <h2>1000+</h2>
          <p>Issues Resolved</p>
        </div>

        <div className="stat-card">
          <h2>500+</h2>
          <p>Active Students</p>
        </div>

        <div className="stat-card">
          <h2>10+</h2>
          <p>Departments</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Support System</p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-features">
        <h2>Why Choose Our Platform?</h2>

        <div className="features-grid">
          <div className="feature-box">
            <h3>Easy Issue Submission</h3>
            <p>Students can quickly raise complaints in a few clicks.</p>
          </div>

          <div className="feature-box">
            <h3>Real-time Tracking</h3>
            <p>Track the status of issues like Pending, In Progress, or Resolved.</p>
          </div>

          <div className="feature-box">
            <h3>Department Routing</h3>
            <p>Issues are automatically sent to the correct department.</p>
          </div>

          <div className="feature-box">
            <h3>Admin Monitoring</h3>
            <p>Admins manage, update, and resolve issues efficiently.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2>Our Team</h2>

        <div className="team-grid">
          <div className="team-card">
            <div className="avatar"></div>
            <h4>Project Developer</h4>
            <p>System Design & Development</p>
          </div>

          <div className="team-card">
            <div className="avatar"></div>
            <h4>University Admin</h4>
            <p>Monitoring & Issue Management</p>
          </div>

          <div className="team-card">
            <div className="avatar"></div>
            <h4>Support Team</h4>
            <p>Department Coordination</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        © 2026 University Feedback & Issue Tracking System
      </footer>

    </div>
  );
};

export default About;
