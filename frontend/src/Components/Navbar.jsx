import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const isAdminPage = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("my_issues");
    localStorage.removeItem("my_feedback");
    navigate("/");
    window.location.reload();
  };

  const requireLogin = (path) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    navigate(path);
    setShowMenu(false);
  };

  const initial = user?.fullName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className="navbar">

      <div className="nav-logo" onClick={() => navigate("/")}>
        <img src="/Logo.png" alt="University Feedback & Review System" className="logo-img" />
      </div>

      <nav className="nav-links">
        {isAdminPage ? (
          <>
            <span onClick={() => navigate("/admin")}>Dashboard</span>
            <span onClick={() => navigate("/")}>← Back to Site</span>
          </>
        ) : (
          <>
            <span onClick={() => navigate("/")}>Home</span>
            <span onClick={() => requireLogin("/features")}>Features</span>
            <span onClick={() => requireLogin("/about")}>About</span>
            <span onClick={() => requireLogin("/contact")}>Contact</span>
          </>
        )}
      </nav>

      <div className="nav-buttons">
        {!isLoggedIn ? (
          <>
            <button className="btn-outline" onClick={() => navigate("/login")}>Sign In</button>
            <button className="btn-solid" onClick={() => navigate("/register")}>Get Started</button>
          </>
        ) : (
          <div className="profile-section">
            <div className="profile-avatar-nav" onClick={() => setShowMenu(!showMenu)}>
              {initial}
            </div>

            {showMenu && (
              <>
                <div className="dropdown-backdrop" onClick={() => setShowMenu(false)} />
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{initial}</div>
                    <div>
                      <p className="dropdown-name">{user?.fullName || user?.name || "Student"}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  {isAdminPage ? (
                    // On admin page — only show Back to Site
                    <div className="dropdown-item" onClick={() => { navigate("/"); setShowMenu(false); }}>
                      <span>🏠</span> Back to Site
                    </div>
                  ) : (
                    // On student pages — show student options ONLY
                    <>
                      <div className="dropdown-item" onClick={() => { navigate("/profile"); setShowMenu(false); }}>
                        <span>👤</span> My Profile
                      </div>
                      <div className="dropdown-item" onClick={() => { navigate("/track-status"); setShowMenu(false); }}>
                        <span>📊</span> Track Issues
                      </div>
                      <div className="dropdown-item" onClick={() => { navigate("/submit-feedback"); setShowMenu(false); }}>
                        <span>💬</span> Feedback
                      </div>
                    </>
                  )}

                  <div className="dropdown-divider" />

                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
