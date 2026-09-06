import { useState } from "react";
import { GitBranch, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend login will be connected here later
    console.log("Login submitted");
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

        {/* Social Login */}
        <div className="social-login">

          <button type="button" className="social-button">
            <span className="google-icon">G</span>
            Sign in with Google
          </button>

          <button type="button" className="social-button">
            <GitBranch size={17} strokeWidth={2} />
            Sign in with GitHub
          </button>

        </div>

        {/* Divider */}
        <div className="login-divider">
          <span></span>
          <p>or sign in with</p>
          <span></span>
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