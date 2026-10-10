import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();

      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch(
        "/Learnova_backend/login.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.text();

      console.log("Backend response:", result);

      const data = JSON.parse(result);

      if (data.success) {
        setMessage(data.message);

        if (remember) {
          localStorage.setItem(
            "learnovaUser",
            JSON.stringify(data.user)
          );
        } else {
          sessionStorage.setItem(
            "learnovaUser",
            JSON.stringify(data.user)
          );
        }
        navigate("/user");

      } else {
        setMessage(data.message);
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to the backend.");
    }
  };

  return (
    <div className="login-page">

      {/* Animated background */}
      <div className="login-bg-shape login-bg-shape-one"></div>
      <div className="login-bg-shape login-bg-shape-two"></div>
      <div className="login-bg-shape login-bg-shape-three"></div>

      <div className="login-small-shape login-small-shape-one"></div>
      <div className="login-small-shape login-small-shape-two"></div>
      <div className="login-small-shape login-small-shape-three"></div>

      {/* Login Card */}
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          L
        </div>

        {/* Header */}
        <div className="login-header">
          <h1>Welcome to Learnova</h1>

          <p>
            Log in to continue your learning journey
          </p>
        </div>

        
        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="login-field">
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
          <div className="login-field">
            <label htmlFor="password">
              Password<span>*</span>
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
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

          {/* Options */}
          <div className="login-options">

            <label className="remember-option">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />

              <span>Remember this device</span>
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot password?
            </button>

          </div>

          {/* Submit */}
          <button type="submit" className="login-button">
            Sign in
          </button>

          {message && (
            <p style={{ textAlign: "center", marginTop: "12px" }}>
              {message}
            </p>
          )}

        </form>

        {/* Register */}
        <p className="create-account">
          Don't have an account?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;