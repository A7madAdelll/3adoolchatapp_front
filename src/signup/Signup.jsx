// App.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./css.css";

function App() {
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the username and password
    const isUsernameValid = username.trim().length >= 5;
    const isPasswordValid = password.trim().length >= 5;
    const isemailValid    = email.trim().length >= 5;
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
      console.log(email,username,password)
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name:username,
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
      navigate("/login");
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
    else if (name === "email") {
      setemail(value);
    }
    // Clear the corresponding error message when the user starts typing
    setErrorMessages({ ...errorMessages, [name]: "" });
  };

  const renderErrorMessage = (name) => (
    <div className="error">{errorMessages[name]}</div>
  );
    const login=()=>{
      navigate("/login");
    }
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
      <div className="input-container">
          <label htmlFor="uname">email </label>
          <input
            type="text"
            id="uname"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label htmlFor="uname">Username </label>
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
      </form>
     <div onClick={login}> have account ? </div> 
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">sign up</div>
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
