import React, { useEffect, useState } from "react";
import "./login_sign.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

import user_icon from "../components/assets/user.png";
import pass_icon from "../components/assets/password.png";
import email_icon from "../components/assets/email.png";
import dial_icon from "../components/assets/dial.png"; // Import the dial logo

const Login = () => {
  const [action, setAction] = useState("Login");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(""); // State to store reCAPTCHA token
  const recaptchaRef = useRef(null); // Reference for reCAPTCHA
  const navigate = useNavigate();

  useEffect(() => {
    // Reset fields when action changes
    setFirstname("");
    setLastname("");
    setEmail("");
    setAge("");
    setContact("");
    setPassword("");
    setRecaptchaToken("");
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [action]);

  const handleRecaptchaChange = (recaptchaToken) => {
    setRecaptchaToken(recaptchaToken);
  };

  const sendData = async (e) => {
    e.preventDefault();
    const emailDomain = "@gmail.com";
    if (!email.endsWith(emailDomain)) {
      alert(`Email must end with ${emailDomain}`);
      return;
    }
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA");
      return;
    }
    const endpoint = action === "Sign Up" ? "signup" : "login";
    const data = action === "Sign Up"
      ? { firstname, lastname, email, age, contact, password, recaptchaToken }
      : { email, password, recaptchaToken };
    axios.post(`http://localhost:4000/${endpoint}`, data)
      .then((result) => {
        alert(result.data.message);
        if (
          endpoint === "login" && result.data.message === "Login successful"
        ) {
          localStorage.setItem("token", result.data.token); // Store the token
          const atIndex = email.indexOf("@");
          const substr = email.substring(0, atIndex);
          navigate(`/profile/${substr}`); // Redirect to profile page
        } else if (
          endpoint === "signup" &&
          result.data.message === "User created successfully"
        ) {
          localStorage.setItem("token", result.data.token); // Store the token
          const atIndex = email.indexOf("@");
          const substr = email.substring(0, atIndex);
          navigate(`/profile/${substr}`); // Redirect to profile page
        }
      })
      
      .catch((err) => {
        console.error(err);
        alert(err.response.data.error);
        if (
          err.response.data.error === "Invalid user" ||
          err.response.data.error === "Invalid email or password"
        ) {
          setEmail("");
          setPassword("");
        }
      });
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <form className="inputs" onSubmit={sendData}>
          {action === "Sign Up" && (
            <>
              <div className="input">
                <img src={user_icon} alt="user" className="input-icon" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="input">
                <img src={user_icon} alt="user" className="input-icon" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
              <div className="input">
                <img src={email_icon} alt="E-mail" className="input-icon" />
                <input
                  type="email"
                  placeholder="E-Mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input">
                <img src={user_icon}></img>
                <input
                  type="text"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="input">
                <img src={dial_icon} alt="contact" className="input-icon" />
                {" "}
                {/* Add the dial logo here */}
                <input
                  type="text"
                  placeholder="Contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              <div className="input">
                <img src={pass_icon} alt="pass" className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          {action === "Login" && (
            <>
              <div className="input">
                <img src={email_icon} alt="E-mail" className="input-icon" />
                <input
                  type="email"
                  placeholder="E-Mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input">
                <img src={pass_icon} alt="pass" className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <ReCAPTCHA
            sitekey="6Le27cEqAAAAAF-BVpBa1rtKM7kD8-K-5dXauTSN" // Replace with your reCAPTCHA site key
            onChange={handleRecaptchaChange}
          />
          <div className="submit-container">
            <button type="submit" className="submit">
              {action}
            </button>
          </div>
        </form>
        {action === "Login" && (
          <div className="switch-container">
            <p className="switch-text">Don't have an account?</p>
            <div
              className="switch-action"
              onClick={() => setAction("Sign Up")}
            >
              Sign Up
            </div>
          </div>
        )}
        {action === "Sign Up" && (
          <div className="switch-container">
            <p className="switch-text">Already have an account?</p>
            <div
              className="switch-action"
              onClick={() => setAction("Login")}
            >
              Login
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
