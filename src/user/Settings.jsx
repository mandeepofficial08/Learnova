
import { useState } from "react";
import {
  CheckCircle2,
  LockKeyhole,
  LogOut,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import "./Settings.css";

const API_BASE = "http://localhost/Learnova_backend";

function Settings() {
  const getStoredUser = () => {
    const storedUser =
      localStorage.getItem("learnovaUser") ||
      sessionStorage.getItem("learnovaUser");

    return storedUser ? JSON.parse(storedUser) : null;
  };

  const [user, setUser] = useState(getStoredUser());
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const [showChangePassword, setShowChangePassword] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (!user?.id) {
      setError("User information could not be found.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("name", name.trim());

      const response = await fetch(
        `${API_BASE}/update_profile.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(
          data.message || "Unable to update your profile."
        );
        return;
      }

      const updatedUser = {
        ...user,
        name: data.user.name,
      };

      setUser(updatedUser);

      const userString = JSON.stringify(updatedUser);

      if (localStorage.getItem("learnovaUser")) {
        localStorage.setItem("learnovaUser", userString);
      } else {
        sessionStorage.setItem("learnovaUser", userString);
      }

      setName(data.user.name);
      setIsEditing(false);
      setMessage("Profile updated successfully.");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setIsEditing(false);
    setError("");
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("learnovaUser");
    sessionStorage.removeItem("learnovaUser");
    window.location.href = "/";
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    setChangingPassword(true);

    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("current_password", currentPassword);
      formData.append("new_password", newPassword);

      const response = await fetch(
        `${API_BASE}/change_password.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        setPasswordError(
          data.message || "Unable to change password."
        );
        return;
      }

      setPasswordMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      setPasswordError("Unable to connect to the server.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="settings-page">
      <div className="settings-container">
        {/* HERO */}
        <section className="settings-hero">
          <span className="settings-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>
            Your profile
          </h1>

        </section>

        {/* MESSAGE */}
        {message && (
          <div className="settings-message">
            <CheckCircle2 size={17} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="settings-error">
            <X size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* PROFILE */}
        <section className="settings-section">
          <div className="settings-section-heading">
            <div>
              <span className="settings-eyebrow">
                PROFILE
              </span>
              <h2>Personal information</h2>
            </div>

            {!isEditing && (
              <button
                type="button"
                className="edit-profile-button"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={15} />
                Edit profile
              </button>
            )}
          </div>

          <div className="profile-layout">
            <div className="profile-fields">
              <div className="profile-field">
                <label>
                  <User size={15} />
                  Name
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <span>{user.name || "—"}</span>
                )}
              </div>

              <div className="profile-field">
                <label>
                  <Mail size={15} />
                  Email
                </label>

                <span>{user.email || "—"}</span>
              </div>

              {isEditing && (
                <div className="profile-actions">
                  <button
                    type="button"
                    className="save-profile-button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    <Save size={15} />
                    {saving ? "Saving..." : "Save changes"}
                  </button>

                  <button
                    type="button"
                    className="cancel-profile-button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    <X size={15} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h2>Security</h2>
            </div>
          </div>

          <div className="settings-card settings-action-card">
            {!showChangePassword ? (
              <button
                type="button"
                className="settings-action"
                onClick={() => {
                  setShowChangePassword(true);
                  setPasswordMessage("");
                  setPasswordError("");
                }}
              >
                <div className="settings-action-left">
                  <div className="settings-action-icon">
                    <LockKeyhole size={17} />
                  </div>

                  <div>
                    <strong>Change password</strong>
                    <span>
                      Update your account password.
                    </span>
                  </div>
                </div>

                <Pencil size={16} />
              </button>
            ) : (
              <div className="change-password-form">
                <div className="change-password-header">
                  <div>
                    <strong>Change password</strong>
                    <span>
                      Enter your current password and choose
                      a new one.
                    </span>
                  </div>

                  <button
                    type="button"
                    className="close-password-button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordMessage("");
                      setPasswordError("");
                    }}
                    aria-label="Close change password form"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="password-fields">
                  <div className="password-field">
                    <label>Current password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) =>
                        setCurrentPassword(e.target.value)
                      }
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="password-field">
                    <label>New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Minimum 6 characters"
                    />
                  </div>

                  <div className="password-field">
                    <label>Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="password-error">
                    {passwordError}
                  </p>
                )}

                {passwordMessage && (
                  <p className="password-success">
                    {passwordMessage}
                  </p>
                )}

                <div className="password-actions">
                  <button
                    type="button"
                    className="save-password-button"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                  >
                    <Save size={15} />
                    {changingPassword
                      ? "Updating..."
                      : "Update password"}
                  </button>

                  <button
                    type="button"
                    className="cancel-password-button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordMessage("");
                      setPasswordError("");
                    }}
                    disabled={changingPassword}
                  >
                    <X size={15} />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon">
              <User size={18} />
            </div>

            <div>
              <h2>Account</h2>
            </div>
          </div>

          <div className="settings-card settings-action-card">
            <button
              type="button"
              className="settings-action logout-action"
              onClick={handleLogout}
            >
              <div className="settings-action-left">
                <div className="settings-action-icon">
                  <LogOut size={17} />
                </div>

                <div>
                  <strong>Log out</strong>
                  
                </div>
              </div>

              <LogOut size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Settings;
