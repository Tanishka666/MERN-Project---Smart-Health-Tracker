import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfileSection({ setActivePage }){
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    weight: "",
    height: ""
  });

  const [savedProfile, setSavedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  const userId = localStorage.getItem("userId");

  /* ================= LOAD PROFILE (IMPORTANT) ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) return;

        const res = await axios.get(
          `http://localhost:5000/api/user/${userId}`
        );

        if (res.data) {
          setSavedProfile(res.data);
          setProfile(res.data);
          setIsEditing(false);
        }
      } catch (err) {
        console.log("No existing profile");
      }
    };

    fetchProfile();
  }, [userId]);

  /* ================= SAVE / UPDATE PROFILE ================= */
  const handleSave = async () => {
    try {
      if (!userId) {
        alert("User not logged in");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/user", {
        ...profile,
        userId   // 🔥 IMPORTANT FIX
      });

      setSavedProfile(res.data.user);
      setIsEditing(false);

      alert("Profile Saved Successfully!");
      setActivePage("charts");
    } catch (error) {
      console.log(error);
      alert("Error saving profile");
    }
  };

  return (
    <div className="profile-card">
      <h2>User Profile</h2>

      {/* ================= EDIT MODE ================= */}
      {isEditing && (
        <>
          <input
            type="text"
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Age"
            value={profile.age}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={profile.weight}
            onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
          />

          <input
            type="number"
            placeholder="Height (cm)"
            value={profile.height}
            onChange={(e) => setProfile({ ...profile, height: e.target.value })}
          />

          <button onClick={handleSave}>Save Profile</button>
        </>
      )}

      {/* ================= VIEW MODE ================= */}
      {!isEditing && savedProfile && (
        <div className="saved-profile-box">
          <p><strong>Name:</strong> {savedProfile.name}</p>
          <p><strong>Age:</strong> {savedProfile.age}</p>
          <p><strong>Weight:</strong> {savedProfile.weight} kg</p>
          <p><strong>Height:</strong> {savedProfile.height} cm</p>
          <p><strong>BMI:</strong> {savedProfile.bmi}</p>
          <p><strong>Health Category:</strong> {savedProfile.healthCategory}</p>

          <p style={{ marginTop: "8px", fontSize: "13px", opacity: 0.7 }}>
            Last Updated: {new Date(savedProfile.lastUpdated).toLocaleString()}
          </p>

          <button
            onClick={() => {
              setProfile(savedProfile);
              setIsEditing(true);
            }}
            style={{ marginTop: "15px", background: "#10b981" }}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileSection;
