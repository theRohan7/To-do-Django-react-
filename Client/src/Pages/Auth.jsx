import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/auth.css";
import { AuthContext } from "../Contexts/AuthContext.jsx";
import { Eye, EyeOff } from "lucide-react";

function Auth() {
  const [loginForm, setLoginForm] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const { setUserDetails, loginUser, registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setRemember(checked);
    } else {
      if (name === "name") setUsername(value);
      if (name === "email") setEmail(value);
      if (name === "password") setPassword(value);

      if (errorField === name) {
        setError("");
        setErrorField("");
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!loginForm && !username.trim()) {
      setError("Name is required");
      setErrorField("name");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      setErrorField("email");
      return;
    } else if (!email.includes("@")) {
      setError("Please enter a valid email");
      setErrorField("email");
      return;
    }

    if (!password) {
      setError("Password is required");
      setErrorField("password");
      return;
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setErrorField("password");
      return;
    }

    setError("");
    setErrorField("");
    setLoading(true);

    try {
      let response;

      if(loginForm) {
        response = await loginUser({email, password, remember})
      } else {
        response = await registerUser({username, email, password})
        if(response.status === 201){
          loginForm ? setLoginForm(false) : setLoginForm(true);
        }
      }

      console.log(response);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-main">
      <div className="logo">
        <img src='https://res.cloudinary.com/rohanscloud/image/upload/v1743342757/Logo_jethto.png' alt="logo" />
      </div>
      <div className="auth-form-container">
        <div className="auth-nav">
          <button 
           onClick={() => setLoginForm(true)}
           className={loginForm ? "active-btn" : ""}
          >Log In</button>
          <button 
           onClick={() => setLoginForm(false)}
           className={!loginForm ? "active-btn" : ""}
          >Sign Up</button>
        </div>
        <form onSubmit={handleSubmit}>
          {loginForm && (
            <p className="login-desc">
              <span>To Continue</span> <br /> We need your name & email
            </p>
          )}

          {!loginForm && (
            <input
              type="text"
              placeholder="Name"
              onChange={handleChange}
              name="name"
              value={username}
              className={errorField === "name" ? "error-input" : ""}
            />
          )}
          <input
            type="text"
            placeholder="Email"
            onChange={handleChange}
            name="email"
            value={email}
            className={errorField === "email" ? "error-input" : ""}
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              name="password"
              value={password}
              className={errorField === "password" ? "error-input" : ""}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleShowPassword}
            >
              {showPassword ? <Eye color="#329C89" /> : <EyeOff color="#329C89" />}
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="submit-btn">
            {loading ? "Loading..." : loginForm ? "Log In" : "Sign Up"}
          </button>

          <div className="remember">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              checked={remember}
              onChange={handleChange}
            />{" "}
            <label htmlFor="remember">Remember Me</label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
