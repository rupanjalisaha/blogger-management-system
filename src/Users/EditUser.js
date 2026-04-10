import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../layout/Navbar";
import { getImageById } from "../services/imageService";
import ProfileImageUpload from "../Utils/profileImageUpload";
export default function EditUser() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    category: "",
    message: "",
    role: "",
  });
  const { username, password, email, fullName, category, message, role } = user;
  const [imageUrl, setImageUrl] = useState(null);
  const bloggerId = localStorage.getItem("bloggerId");
  const [image, setImage] = useState({
    fileName: "",
    fileType: "",
    imageData: "",
    bloggerName: "",
  });
  const { id } = useParams();
  useEffect(() => {
    loadUser();
  }, []);
  var errorMessage = "";
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

  const isSameUser = user.username === localStorage.getItem("username");
  let navigate = useNavigate();
  const onInputChange = (e) => {
    if (!isSameUser) {
      alert("Not Allowed");
      return;
    } else if (isSameUser) {
      setUser({ ...user, [e.target.id]: e.target.value });
    }
  };
  useEffect(() => {
    if (bloggerId) {
      fetchImage(bloggerId);
    }
  }, [bloggerId]);

  const fetchImage = async (id) => {
    try {
      const response = await getImageById(id);
      setImage(response.data);
      const url = `data:${response.data.fileType};base64,${response.data.imageData}`;
      setImageUrl(url);
      console.log("Fetched image with name:", response.data.fileName);
    } catch (err) {
      console.error("Error fetching image", err);
    }
  };

  const handleUploadSuccess = (data) => {
    if (data.imageId) {
      console.log("Image uploaded with ID:", data.imageId);
      fetchImage(data.imageId);
    }
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!errorMessage) {
        await axios
          .put(`${process.env.REACT_APP_BACKEND_URL}/UVB/user/${id}`, user, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              alert("User details updated successfully!");
              window.location.href="/details";
            } else {
              alert("Failed to update user details. Please try again.");
              window.location.href="/details";
            }
          });
      } else if (
        user.username !== localStorage.getItem("username") &&
        localStorage.getItem("username") !== "admin"
      ) {
        errorMessage =
          "You can only edit your own profile details. Please log in with the correct account.";
        alert(
          `Current Username ${user.username} does not match the logged in username ${localStorage.getItem("username")} Please log in again.`,
        );
      } else {
        navigate("/details");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Nothing to update!");
      navigate("/details");
    }
  };
  const [defaultRole, setDefaultRole] = useState(null);
  const loadUser = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/user/bloggerDetails/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setUser(result.data);
      setDefaultRole(result.data.roles[0].name);
    } catch (error) {
      console.error("Error loading user details:", error);
      alert("Failed to load user details. Please try again.");
    }
  };
  const categoryOptions = [
    { label: "Select an option", value: `{user.category}` },
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

  const isAdmin = localStorage.getItem("username") === "admin";
  const roleOptions = [
    {
      label: "USER",
      value: "ROLE_USER",
    },
    {
      label: "ADMIN",
      value: "ROLE_ADMIN",
    },
  ];
  const handleDeleteProfileImage = async (profileId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/bloggers/deleteProfileImage/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete profile image", error.message);
    }
  };
  
if(!isAdmin){
  user.role=defaultRole;
}
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
            <div className="text-center m-2 fs-2">Edit User</div>
            <form className="mt-5" onSubmit={(e) => onSubmit(e)}>
              <div className="mb-3 mt-3">
                <label htmlFor="username" className="form-label fs-5">
                  Username
                </label>
                <input
                  type="name"
                  className="form-control"
                  id="username"
                  placeholder="What shall we call you?"
                  value={username}
                  disabled={!isSameUser}
                  onChange={(e) => onInputChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fs-5">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Your email id is safe with us"
                  value={email}
                  disabled={!isSameUser}
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
                  disabled={!isSameUser}
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
                  disabled={!isSameUser} // Controls the selected value
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
                  placeholder="We are listening..."
                  value={message}
                  disabled={!isSameUser}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              {isAdmin && (
                <div className="mb-3">
                  <label htmlFor="role" className="form-label fs-5">
                    Role
                  </label>
                  <select
                    id="role"
                    value={defaultRole} // Controls the selected value
                    onChange={(e) => {
                      setUser({ ...user, [e.target.id]: e.target.value });
                      setDefaultRole(user.role);
                    }} // Updates the state on change
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
              )}

              <div className="mb-3">
                <label htmlFor="profileImage" className="form-label fs-5">
                  Profile Image
                </label>

                {imageUrl && (
                  <div className="mb-3">
                    <img
                      typeof={image.fileType}
                      src={`data:${image.fileType};base64,${imageUrl}`}
                      alt="profile"
                      width="350px"
                      height="450px"
                      style={{ borderRadius: "5%" }}
                    ></img>
                  </div>
                )}
                {/* Upload Component */}
                <ProfileImageUpload
                  bloggerId={user.id}
                  onUploadSuccess={handleUploadSuccess}
                  username={user.username}
                />
              </div>
              <button
                className="btn btn-outline-primary m-3"
                onClick={() => handleDeleteProfileImage(user.id)}
                disabled={!isSameUser}
              >
                Delete Profile Image
              </button>
              <button
                className="btn btn-outline-primary m-3"
                type="submit"
                disabled={!isSameUser && !isAdmin}
              >
                Submit
              </button>
              <Link className="btn btn-outline-danger" to="/details">
                Cancel
              </Link>
            </form>
            <p style={{ color: "red" }}>{errorMessage}</p>
          </div>
        </div>
      </div>
    </>
  );
}
