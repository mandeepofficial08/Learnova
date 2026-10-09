
import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  LockKeyhole,
  LogOut,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  Trash2,
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
const [showChangePassword, setShowChangePassword] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordError, setPasswordError] = useState("");
const [passwordMessage, setPasswordMessage] = useState("");
const [changingPassword, setChangingPassword] = useState(false);

  const [user, setUser] = useState(getStoredUser());
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");

  const [profilePhoto, setProfilePhoto] = useState(
    user?.profile_photo || ""
  );

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const getPhotoUrl = () => {
    if (!profilePhoto) return "";

    if (
      profilePhoto.startsWith("http://") ||
      profilePhoto.startsWith("https://") ||
      profilePhoto.startsWith("data:")
    ) {
      return profilePhoto;
    }

    return `${API_BASE}/${profilePhoto}`;
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be smaller than 5 MB.");
      return;
    }

    setSelectedPhoto(file);

    const previewUrl = URL.createObjectURL(file);
    setProfilePhoto(previewUrl);
  };

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

      if (selectedPhoto) {
        formData.append("profile_photo", selectedPhoto);
      }

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
        profile_photo: data.user.profile_photo,
      };

      setUser(updatedUser);

      const userString = JSON.stringify(updatedUser);

      if (localStorage.getItem("learnovaUser")) {
        localStorage.setItem("learnovaUser", userString);
      } else {
        sessionStorage.setItem(
          "learnovaUser",
          userString
        );
      }

      setName(data.user.name);
      setProfilePhoto(data.user.profile_photo);
      setSelectedPhoto(null);
      setIsEditing(false);

      setMessage("Profile updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);

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
    setProfilePhoto(user?.profile_photo || "");
    setSelectedPhoto(null);

    setIsEditing(false);
    setError("");
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("learnovaUser");
    sessionStorage.removeItem("learnovaUser");

    window.location.href = "/";
  };

  const handleDeleteAccount = () => {
    /*
     * Delete-account backend will be connected next.
     */
    setShowDeleteConfirm(false);

    setMessage(
      "Account deletion will be connected next."
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  if (!user) {
    return null;
  }

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

    setPasswordMessage(
      "Password changed successfully."
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (error) {

    setPasswordError(
      "Unable to connect to the server."
    );

  } finally {

    setChangingPassword(false);

  }
};


  return (
    <main className="settings-page">
      <div className="settings-container">

        {/* HERO */}

        <section className="settings-hero">
          <span className="settings-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>
            Your profile,
            <em> your space.</em>
          </h1>

          <p>
            Manage your personal information and account
            security from one place.
          </p>
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
      <span className="settings-eyebrow">PROFILE</span>
      <h2>Personal information</h2>
      <p>Update your name and profile photo.</p>
    </div>

    {!isEditing && (
      <button
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
          <span>{user?.name || "—"}</span>
        )}
      </div>

      <div className="profile-field">
        <label>
          <Mail size={15} />
          Email
        </label>

        <span>{user?.email || "—"}</span>
      </div>

      {isEditing && (
        <div className="profile-actions">
          <button
            className="save-profile-button"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save changes"}
          </button>

          <button
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

    <div className="profile-photo-area">
      <div className="profile-photo-wrapper">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="profile-photo"
          />
        ) : (
          <div className="profile-photo-placeholder">
            <User size={52} />
          </div>
        )}

        {isEditing && (
          <>
            <input
              type="file"
              id="profile-photo-input"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              hidden
            />

            <label
              htmlFor="profile-photo-input"
              className="profile-photo-edit"
              title="Change profile photo"
            >
              <Camera size={17} />
            </label>
          </>
        )}
      </div>

      <div className="profile-photo-text">
        <strong>{user?.name || "Your profile photo"}</strong>
        <span>
          {isEditing
            ? "JPG, PNG or WEBP · Max 5 MB"
            : "Profile photo"}
        </span>
      </div>
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
      <p>
        Keep your Learnova account secure.
      </p>
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
              Enter your current password and choose a new one.
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

    <div className="settings-action">

      <div className="settings-action-left">

        <div className="settings-action-icon verified-icon">
          <Mail size={17} />
        </div>

        <div>
          <strong>
            Email verification
          </strong>

          <span>
            Your email verification status.
          </span>
        </div>

      </div>

      {Number(user.email_verified) === 1 ? (
        <span className="verified-badge">
          <CheckCircle2 size={14} />
          Verified
        </span>
      ) : (
        <span className="unverified-badge">
          Not verified
        </span>
      )}

    </div>

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
              <p>
                Manage your current Learnova session.
              </p>
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
                  <span>
                    Sign out from this device.
                  </span>
                </div>

              </div>

              <LogOut size={16} />

            </button>

          </div>

        </section>

        {/* DANGER ZONE */}

        <section className="settings-section danger-section">

          <div className="settings-section-heading">

            <div className="settings-section-icon danger-heading-icon">
              <Trash2 size={18} />
            </div>

            <div>
              <h2>Danger zone</h2>
              <p>
                This action cannot be easily undone.
              </p>
            </div>

          </div>

          <div className="settings-card danger-card">

            <div>
              <strong>Delete account</strong>

              <p>
                Permanently delete your Learnova account
                and associated learning data.
              </p>
            </div>

            <button
  type="button"
  className="delete-account-button"
  onClick={() => setShowDeleteConfirm(true)}
>
  <Trash2 size={16} />
  Delete account
</button>
        

          </div>

        </section>

      </div>

      {/* DELETE CONFIRMATION */}

      {showDeleteConfirm && (
        <div className="delete-modal-overlay">

          <div className="delete-modal">

            <div className="delete-modal-icon">
              <Trash2 size={22} />
            </div>

            <h2>
              Delete your account?
            </h2>

            <p>
              This will permanently remove your Learnova
              account, enrollments, progress and learning
              history.
            </p>

            <div className="delete-modal-actions">

              <button
                type="button"
                className="secondary-settings-button"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-button"
                onClick={handleDeleteAccount}
              >
                Delete permanently
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default Settings;
