import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    setShowMenu(false);
  };

  const requireLogin = (callback) => {
    if (!isLoggedIn) {
      alert("Please login first to continue.");
      navigate("/login");
      return;
    }
    callback();
  };

  const handleFeaturesClick = () => {
    navigate("/");

    setTimeout(() => {
      const section = document.getElementById("features");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);

    setShowMenu(false);
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        Logo
      </div>

      {/* Nav Links */}
      <nav className="nav-links">
        <span onClick={() => navigate("/")}>Home</span>
        <span onClick={() => requireLogin(() => navigate("/about"))}>
          About
        </span>
        <span onClick={() => requireLogin(() => navigate("/contact"))}>
          Contact
        </span>
      </nav>

      {/* Right Section */}
      <div className="nav-buttons">
        {!isLoggedIn ? (
          <>
            <button className="btn-outline" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn-solid" onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        ) : (
          <div className="profile-section">
            {/* Avatar Circle */}
            <div
              className="profile-avatar-nav"
              onClick={() => setShowMenu(!showMenu)}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : ""}
            </div>

            {/* Dropdown */}
            {showMenu && (
              <div className="profile-dropdown">
                <p onClick={() => navigate("/profile")}>My Profile</p>
                <p  onClick={() => navigate("/features")}>Features</p>
                <p onClick={handleLogout} className="logout-option">
                  Logout
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

