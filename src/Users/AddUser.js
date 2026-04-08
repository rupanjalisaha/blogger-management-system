import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function AddUser() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    category: "",
    message: "",
    role:"",
  });

  const { username, password, email, fullName, category, message, role } = user;
  
  const onInputChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };
  const navigate = useNavigate();
  var errorMessage = "";

  const roleOptions = [
    { label: "Select an option", value: "" },
    { label: "USER", value: "ROLE_USER" },
    { label: "ADMIN", value: "ROLE_ADMIN" },
  ];
  const categoryOptions = [
    { label: "Select an option", value: "" },
    { label: "Fiction", value: "Fiction" },
    { label: "Non-Fiction", value: "Non-Fiction" },
    { label: "Poetry", value: "Poetry" },
    { label: "Science Fiction", value: "Science Fiction" },
    { label: "Fantasy", value: "Fantasy" },
    { label: "Mystery", value: "Mystery" },
    { label: "Romance", value: "Romance" },
    { label: "Horror", value: "Horror" },
    { label: "Biography", value: "Biography" },
    { label: "Self-Help", value: "Self-Help" },
    { label: "Health & Wellness", value: "Health & Wellness" },
    { label: "Travel", value: "Travel" },
    { label: "Food & Cooking", value: "Food & Cooking" },
    { label: "History", value: "History" },
    { label: "Science & Technology", value: "Science & Technology" },
    { label: "Business & Finance", value: "Business & Finance" },
    { label: "Art & Photography", value: "Art & Photography" },
    { label: "Children's Books", value: "Children's Books" },
    { label: "Young Adult", value: "Young Adult" },
    { label: "Other", value: "Other" },
  ];
  const [showPassword, setShowPassword] = useState(false);

  if (password && password.length < 8) {
    errorMessage = "Password must be at least 8 characters long.";
  } else if (
    password &&
    !/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}/.test(password)
  ) {
    errorMessage =
      "Password must contain at least one uppercase letter, one number, and one special character.";
  } else if (password && /1234|abcd|qwer|1111|0000/.test(password)) {
    errorMessage = "Please choose a stronger password.";
  }

  if (username && username.length < 3) {
    errorMessage = "Username must be at least 3 characters long.";
  } else if (username && username.length > 20) {
    errorMessage = "Username cannot exceed 20 characters.";
  } else if (username && /\s/.test(username)) {
    errorMessage = "Username cannot contain spaces.";
  } else if (username && !/^[a-zA-Z0-9._-]+$/.test(username)) {
    errorMessage =
      "Username can only contain letters, numbers, dots, underscores, and hyphens.";
  }

  if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errorMessage = "Please enter a valid email address.";
  } else if (email && email.length > 50) {
    errorMessage = "Email address cannot exceed 50 characters.";
  } else if (email && /\s/.test(email)) {
    errorMessage = "Email address cannot contain spaces.";
  } else if (fullName && !/^[a-zA-Z\s]+$/.test(fullName)) {
    errorMessage = "Name can only contain letters and spaces.";
  }

  const isAdminCredentials = user.username === "admin";
  if(isAdminCredentials) {
    errorMessage = "Provided username and password are reserved. Please choose different credentials.";
  }
  const publicDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "mac.com",
  ];
  const validateEmailDomain = (email) => {
    const domain = email.split("@")[1];
    if (publicDomains.includes(domain)) {
      return true;
    }
    return false;
  };
  if (email && !validateEmailDomain(email)) {
    errorMessage = `Email domain ${email.split("@")[1]} is not accepted. Please refer to console for accepted domains.`;
    console.log(`Rejected email domain: ${email.split("@")[1]} Accepted List:{"gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "mac.com"}.`);
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!errorMessage) {
        console.log(process.env.REACT_APP_BACKEND_URL);
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/UVB/register`, user);
        if(response.data) {
          console.log("User added successfully:", response.data);
          localStorage.setItem("bloggerId", response.data.bloggerId);
          alert("User added successfully!");
          navigate("/login");
        } else {
          alert("Failed to add user. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to add user. Please check the console for error details.");
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div
          className="col-md-6 offset-md-3 border rounded p-4 mt-5 shadow"
          style={{ backgroundColor: "#ADD8E6" }}
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
                type="text"
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

            <div className="mb-3">
              <label htmlFor="email" className="form-label fs-5">
                Email
              </label>
              <input
                type="email"
                required
                className="form-control"
                id="email"
                placeholder="Your email id is safe with us"
                value={email}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fs-5">
                Name
              </label>
              <input
                type="text"
                required
                className="form-control"
                id="fullName"
                placeholder="What shall we call you?"
                value={fullName}
                onChange={(e) => onInputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label fs-5">
                Writing Genre
              </label>
              <select
                id="category"
                value={category}
                required // Controls the selected value
                onChange={(e) =>
                  setUser({ ...user, [e.target.id]: e.target.value })
                } // Updates the state on change
                className="form-control"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label fs-5">
                Profile Description
              </label>
              <textarea
                className="form-control"
                id="message"
                required
                placeholder="Tell us about yourself..."
                value={message}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label fs-5">
                Your role
              </label>

              <select
                id="role"
                value={role}
                required // Controls the selected value
                onChange={(e) => setUser({ ...user, role: e.target.value })} // Updates the state on change
                className="form-control"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {<p>{role}</p>}
            </div>
            
            <button className="btn btn-outline-primary m-3" type="submit" disabled={isAdminCredentials}>
              Register
            </button>
            <Link className="btn btn-outline-primary" to="/login">
              Login
            </Link>
          </form>
          <p style={{ color: "red" }}>{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}
