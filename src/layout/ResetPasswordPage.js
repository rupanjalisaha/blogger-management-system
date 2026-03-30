import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [userPassword, setUserPassword] = useState({
    username: "",
    newPassword: "",
    password: "",
  });
  var errorMessage = "";
  const { username, newPassword, password } = userPassword;
  if (password && newPassword && password !== newPassword) {
    errorMessage = "Passwords do not match. Please try again.";
  } else if (password && newPassword && password.length < 8) {
    errorMessage = "Password must be at least 8 characters long.";
  } else if (
    password &&
    newPassword &&
    !/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}/.test(password)
  ) {
    errorMessage =
      "Password must contain at least one uppercase letter, one number, and one special character.";
  } else if (
    password &&
    newPassword &&
    /1234|abcd|qwer|1111|0000/.test(password)
  ) {
    errorMessage = "Please choose a stronger password.";
  }

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userPassword.username) {
        const result = await axios.put(
          `http://localhost:8080/UVB/users/reset-password/${userPassword.username}`,
          {
            newPassword:userPassword.newPassword
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        console.log(result.data);
        alert("Password reset successful! Your new password is: " + userPassword.newPassword);
        navigate("/login");
      }
    } catch (error) {
      alert(
        "Error! Password could not be reset. Check console for error details.",
      );
      console.error("Error resetting password:", error);
    }
  };
  const isAdmin = userPassword.username === "admin";
   if(isAdmin){
    errorMessage = "Admin password cannot be reset through this portal. Please contact the system administrator.";
   }
  return (
    <div>
      <h3
        style={{
          marginTop: "5%",
          fontFamily: "cursive",
          textDecoration: "underline",
        }}
      >
        Reset Your Password
      </h3>
      <div className="container">
        <div className="row">
          <div
            className="col-md-6 offset-md-3 border rounded p-4 shadow"
            style={{ marginTop: "3%", backgroundColor: "#ADD8E6" }}
          >
            <form
              onSubmit={handleSubmit}
              className="mt-5"
              style={{ backgroundColor: "#F5F5F5", fontFamily: "monospace" }}
            >
              <div className="mb-3 mt-3">
                <label htmlFor="username" className="form-label fs-5">
                  Username
                </label>
                <input
                  type="username"
                  required
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) =>
                    setUserPassword({
                      ...userPassword,
                      [e.target.id]: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3 mt-3">
                <label htmlFor="password" className="form-label fs-5">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  required
                  className="form-control"
                  id="newPassword"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) =>
                    setUserPassword({
                      ...userPassword,
                      [e.target.id]: e.target.value,
                    })
                  }
                />
                <Link
                  className="btn p-1 btn-outline-primary"
                  style={{ marginLeft: "95%", marginTop: "-10%" }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "👁" : <i class="fas fa-eye-slash"></i>}
                </Link>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fs-5">
                  Confirm Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="form-control"
                  id="password"
                  placeholder="Confirm your new password"
                  value={password}
                  onChange={(e) =>
                    setUserPassword({
                      ...userPassword,
                      [e.target.id]: e.target.value,
                    })
                  }
                />
                <Link
                  className="btn p-1 btn-outline-primary"
                  style={{ marginLeft: "95%", marginTop: "-10%" }}
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? "👁" : <i class="fas fa-eye-slash"></i>}
                </Link>
              </div>
              <button className="btn btn-outline-primary m-3" type="submit" disabled={isAdmin}>
                Submit
              </button>
              <Link className="btn btn-outline-primary" to="/login">
                Cancel
              </Link>
            </form>
            <p style={{ color: "red" }}>{errorMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
