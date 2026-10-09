import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
if (password.length < 8) {
  setMessage("Password must be at least 8 characters long.");
  return;
}
    try {
  const formData = new URLSearchParams();

  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);

  const response = await fetch(
    "/Learnova_backend/register.php",
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.text();

  console.log("Backend response:", result);

  const data = JSON.parse(result);

  setMessage(data.message);

} catch (error) {
  console.error("Registration error:", error);
  setMessage("Unable to connect to the backend.");
}
  };

  return (
    <div className="register-page">

      {/* Animated background shapes */}
      <div className="register-bg-shape register-bg-shape-one"></div>
      <div className="register-bg-shape register-bg-shape-two"></div>
      <div className="register-bg-shape register-bg-shape-three"></div>

      {/* Small floating shapes */}
      <div className="register-small-shape register-small-shape-one"></div>
      <div className="register-small-shape register-small-shape-two"></div>
      <div className="register-small-shape register-small-shape-three"></div>

      <div className="register-card">

        <div className="register-logo">
          L
        </div>

        <div className="register-header">
          <h1>Create your account</h1>
          <p>Start your learning journey with Learnova</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="register-field">
            <label htmlFor="name">
              Full name<span>*</span>
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="register-field">
            <label htmlFor="email">
              Email<span>*</span>
            </label>

            <input
              id="email"
              type="email"
              placeholder="example@learnova.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="register-field">
            <label htmlFor="password">
              Password<span>*</span>
            </label>

            <div className="register-password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="register-field">
            <label htmlFor="confirmPassword">
              Confirm password<span>*</span>
            </label>

            <div className="register-password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="register-terms">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />

            <span>
              I agree to the terms and conditions
            </span>
          </label>

          <button
            type="submit"
            className="register-button"
          >
            Create account
          </button>

          {message && (
            <p style={{ textAlign: "center", marginTop: "12px" }}>
              {message}
            </p>
          )}

        </form>

        <p className="already-account">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;