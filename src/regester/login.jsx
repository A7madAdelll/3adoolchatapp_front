// App.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./css.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the username and password
    const isUsernameValid = username.trim().length >= 5;
    const isPasswordValid = password.trim().length >= 5;

    if (!isUsernameValid) {
      setErrorMessages({
        ...errorMessages,
        uname: "Username must be at least 5 characters long",
      });
      return;
    }

    if (!isPasswordValid) {
      setErrorMessages({
        ...errorMessages,
        pass: "Password must be at least 5 characters long",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed!");
      }

      const responseData = await response.json();

      // Set the token in localStorage
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("userId", responseData.userId);
      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(
        new Date().getTime() + remainingMilliseconds
      );
      localStorage.setItem("expiryDate", expiryDate.toISOString());

      setIsSubmitted(true);

      // Redirect to http://localhost:3000/message
      navigate("/message");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update the state based on the input field's name
    if (name === "uname") {
      setUsername(value);
    } else if (name === "pass") {
      setPassword(value);
    }

    // Clear the corresponding error message when the user starts typing
    setErrorMessages({ ...errorMessages, [name]: "" });
  };

  const renderErrorMessage = (name) => (
    <div className="error">{errorMessages[name]}</div>
  );
  const signup=()=>{
    navigate("/signup");
  }

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="uname">email </label>
          <input
            type="text"
            id="uname"
            name="uname"
            value={username}
            onChange={handleInputChange}
            required
          />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label htmlFor="pass">Password </label>
          <input
            type="password"
            id="pass"
            name="pass"
            value={password}
            onChange={handleInputChange}
            required
          />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <button type="submit">Submit</button>
        </div>
        <div onClick={signup}> create account  </div> 
      </form>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {isSubmitted ? (
          <div>User is successfully logged in</div>
        ) : (
          renderForm
        )}
      </div>
    </div>
  );
}

export default App;
