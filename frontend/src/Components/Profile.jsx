import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = () => {
  const navigate = useNavigate();

  // ✅ match backend fields
  const [user, setUser] = useState({
    _id: "",
    fullName: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE API CALL
  const handleSave = async () => {
    try {
      const res = await API.post(`/users/update/${user._id}`, {
        fullName: user.fullName,
        email: user.email,
      });

      // update localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
      setIsEditing(false);

      alert("Profile updated successfully");

    } catch (error) {
      alert("Update failed");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        <div className="profile-avatar">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
        </div>

        {/* Full Name */}
        <div className="profile-field">
          <label>Name</label>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
            />
          ) : (
            <p>{user.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="profile-field">
          <label>Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          ) : (
            <p>{user.email}</p>
          )}
        </div>

        <div className="profile-buttons">
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;