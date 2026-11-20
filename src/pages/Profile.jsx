import { useState, useEffect } from "react";
import { UserRound, LockKeyhole } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import "../styles/profile.css";
import { getProfile, updateProfile, changePassword } from "../api/authService";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();

        setProfile({
          name: data.data.name,
          email: data.data.email,
        });
      } catch (err) {
        setProfileError(
          err.response?.data?.message || "Failed to load profile.",
        );
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      await updateProfile({
        name: profile.name.trim(),
        email: profile.email.trim(),
      });

      setProfileSuccess("Profile updated successfully!");
    } catch (err) {
      setProfileError(
        err.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (passwords.password.length < 8) {
      setPasswordError("Password must contain at least 8 characters.");
      return;
    }

    if (passwords.password !== passwords.password_confirmation) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await changePassword(passwords);
      const newToken = response.data?.access_token;
      if (newToken) {
        sessionStorage.setItem("cv-access-token", newToken);
      }
      setPasswordSuccess("Password changed successfully!");

      setPasswords({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="profile-heading">
          <h1>My Profile</h1>
          <p>Manage your personal information and security.</p>
        </div>

        <section className="profile-card">
          <div className="profile-tabs">
            <button
              type="button"
              className={activeTab === "personal" ? "active" : ""}
              onClick={() => setActiveTab("personal")}
            >
              <UserRound size={18} />
              Personal Information
            </button>

            <button
              type="button"
              className={activeTab === "password" ? "active" : ""}
              onClick={() => setActiveTab("password")}
            >
              <LockKeyhole size={18} />
              Change Password
            </button>
          </div>

          {activeTab === "personal" ? (
            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <h2>Personal Information</h2>
              <p>Your account details will appear here.</p>

              <div className="profile-field">
                <label htmlFor="profile-name">Full Name</label>

                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="profile-email">Email Address</label>

                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              {profileError && (
                <p className="recovery-error" role="alert">
                  {profileError}
                </p>
              )}

              {profileSuccess && (
                <p className="recovery-success" role="status">
                  {profileSuccess}
                </p>
              )}

              <button
                className="profile-submit"
                type="submit"
                disabled={savingProfile || loadingProfile}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <form className="profile-form" onSubmit={handlePasswordSubmit}>
              <h2>Change Password</h2>
              <p>Update your password to keep your account secure.</p>

              <div className="profile-field">
                <label htmlFor="current-password">Current Password</label>

                <input
                  id="current-password"
                  name="current_password"
                  type="password"
                  value={passwords.current_password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="new-password">New Password</label>

                <input
                  id="new-password"
                  name="password"
                  type="password"
                  value={passwords.password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="confirm-password">Confirm New Password</label>

                <input
                  id="confirm-password"
                  name="password_confirmation"
                  type="password"
                  value={passwords.password_confirmation}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              {passwordError && (
                <p className="recovery-error" role="alert">
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p className="recovery-success" role="status">
                  {passwordSuccess}
                </p>
              )}

              <button
                className="profile-submit"
                type="submit"
                disabled={changingPassword}
              >
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
