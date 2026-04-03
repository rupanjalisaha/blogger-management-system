import React, { use, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
function LoginUser() {
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });

  const { username, password } = userDetails;
  const navigate = useNavigate();
  var errorMessage = "";
  const { setIsAuth } = useContext(AuthContext);
  const onInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.id]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/UVB/login",
        userDetails,
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("bloggerId", response.data.bloggerId);
      setIsAuth(true);
      navigate("/details");
    } catch (error) {
      console.error("Login failed:", error);
      errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Login failed. Please check your credentials and try again.";
      alert(errorMessage);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => {
    if (!username) {
      alert("Please enter your username to reset your password.");
      return;
    }else if(username && username === "admin"){
      alert("Admin password cannot be reset through this portal. Please contact the system administrator.");
      return;
    }
    navigate("/resetPassword");
  }
  return (
    <div>
      <div className="container">
        <div className="row">
          <div
            className="col-md-6 offset-md-3 border rounded p-4 shadow"
            style={{ marginTop: "10%", backgroundColor: "#ADD8E6" }}
          >
            <div
              className="text-center m-2 fs-2"
              style={{
                color: "Highlight",
                textDecoration: "overline",
                fontFamily: "cursive",
              }}
            >
              Welcome to UVB
            </div>

            <form
              className="mt-5"
              onSubmit={(e) => onSubmit(e)}
              style={{ backgroundColor: "#F5F5F5", fontFamily: "monospace" }}
            >
              <div className="mb-3 mt-3">
                <label htmlFor="username" className="form-label fs-5">
                  Username
                </label>
                <input
                  type="name"
                  required
                  className="form-control"
                  id="username"
                  placeholder="What will be your code name?"
                  value={username}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fs-5">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="form-control"
                  id="password"
                  placeholder="Secure your message"
                  value={password}
                  onChange={(e) => onInputChange(e)}
                />
                <Link
                  className="btn p-1 btn-outline-primary"
                  style={{ marginLeft: "95%", marginTop: "-10%" }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "👁" : <i class="fas fa-eye-slash"></i>}
                </Link>
              </div>
              <button className="btn btn-outline-primary m-3" type="submit">
                Login
              </button>
              <Link className="btn btn-outline-primary" to="/">
                Register
              </Link>
            </form>
            <Link to="/resetPassword" onClick={handleClick}>Forgot Password</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginUser;
