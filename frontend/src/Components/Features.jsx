import "./Features.css";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Raise Issue",
      desc: "Students can submit complaints related to IT, maintenance, library, and other departments.",
      icon: "📩",
      action: () => navigate("/raise-issue")
    },
    {
      title: "Track Status",
      desc: "Monitor the real-time progress of your submitted issues until resolution.",
      icon: "📊",
      action: () => navigate("/track-status")
    },
    {
      title: "Submit Feedback",
      desc: "Provide suggestions and feedback to improve university services.",
      icon: "💬",
      action: () => navigate("/submit-feedback")
    },
    {
      title: "Department Routing",
      desc: "Issues are automatically forwarded to the correct department for faster action.",
      icon: "🏢"
    },
    {
      title: "Admin Monitoring",
      desc: "Admin panel to manage complaints, update status, and review feedback.",
      icon: "🛠"
    },
    {
      title: "Student Dashboard",
      desc: "Simple and user-friendly interface to manage all activities in one place.",
      icon: "👨‍🎓"
    }
  ];

  return (
    <div className="features-page">

      {/* Hero */}
      <section className="features-hero">
        <h1>System Features</h1>
        <p>Everything you need to manage university issues and feedback efficiently</p>
      </section>

      {/* Features Grid */}
      <section className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>

            {feature.action && (
              <button onClick={feature.action}>
                Open
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="features-footer">
        © 2026 University Feedback & Issue Tracking System
      </footer>
    </div>
  );
};

export default Features;

