import React, { useState, useEffect } from "react";
import "./Login.css";

function LoginPage({ setLoggedIn }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const getPasswordStrength = () => {
    if (password.length < 6) return "Weak";

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    ) {
      return "Strong";
    }

    return "Medium";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    if (isSignup && !email) {
      setError("Please enter email address");
      return;
    }

    if (
      isSignup &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      setError("Please enter a valid email");
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (isSignup && !agreePrivacy) {
      setError("Please accept the Privacy Policy");
      return;
    }

    setLoading(true);

    const url = isSignup
      ? "http://localhost:5000/api/auth/signup"
      : "http://localhost:5000/api/auth/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (isSignup) {
          alert("Signup successful. Please sign in.");

          setIsSignup(false);
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setAgreePrivacy(false);
        } else {
          const sessionId = Date.now().toString();

          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          localStorage.setItem("sessionId", sessionId);

          console.log("LOGIN SUCCESS:", data);

          setLoggedIn(true);
          window.location.href = "/dashboard";
        }
      } else {
        setError(data.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to backend");
    }

    setLoading(false);
  };

  return (
    <div className={`login-page ${mounted ? "page-visible" : ""}`}>
      <div
        className={`container ${
          isSignup ? "right-panel-active" : ""
        } ${mounted ? "card-visible" : ""}`}
      >
        <div className="form-container single-form-container">
          <form onSubmit={handleSubmit} className="form-animate">
            <h1>{isSignup ? "Sign Up" : "Sign In"}</h1>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {isSignup && (
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {isSignup && (
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            {isSignup && password && (
              <p className={`strength ${getPasswordStrength().toLowerCase()}`}>
                Password Strength: {getPasswordStrength()}
              </p>
            )}

            {isSignup && (
              <label className="privacy-checkbox">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                />
                I agree to the Privacy Policy and secure storage of my health
                data.
              </label>
            )}

            {error && <p className="error-msg">{error}</p>}

            <button
              type="submit"
              disabled={loading || (isSignup && !agreePrivacy)}
            >
              {loading
                ? isSignup
                  ? "Signing up..."
                  : "Signing in..."
                : isSignup
                ? "Sign Up"
                : "Sign In"}
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back..!</h1>
              <p>Sign in to continue your health journey</p>
              <button className="ghost" onClick={() => setIsSignup(false)}>
                Sign In
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1>Hello there..!</h1>
              <p>Create an account and start tracking smarter</p>
              <button className="ghost" onClick={() => setIsSignup(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
