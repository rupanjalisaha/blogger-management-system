import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { getImageById } from "../services/imageService";
export default function ViewUser() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({
    username: "",
    email: "",
    name: "",
    category: "",
    message: "",
  });
  const [image, setImage] = useState({
    fileName: "",
    fileType: "",
    imageData: null,
    bloggerName: "",
  });
  const [role, setRole] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    loadUser();
  },[]);

  const [imageUrl, setImageUrl] = useState(null);
  const loadUser = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/user/bloggerDetails/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUser(result.data);
      setRole(result.data.roles[0].name);
    } catch (error) {
      alert(
        "Error! User details could not be loaded, check console for more details.",
      );
      console.error("Error loading user details:", error);
    }
  };
  
  const handleViewImage = async (id) => {
    try {
      const response = await getImageById(id);
      console.log(response);
      const url = `data:${response.data.fileType};base64,${response.data.imageData}`;
      setImageUrl(url);
      setImage(response.data);
      console.log("Profile image data:", image);
    } catch (err) {
      console.error("Error fetching profile image:", err);
        alert("profile image not found");
    }
  };
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
            <h2 className="text-center m-4">User Details</h2>
            <div className="card shadow mb-4">
              <h4 className="mt-4">Details of User id:{user.id}</h4>
              <ul className="list-group list-group-flush m-2">
                <li className="list-group-item m-2">
                  <b className="p-4">Username:</b>
                  {user.username}
                </li>
                <li className="list-group-item m-2">
                  <b className="p-4">Email:</b>
                  {user.email}
                </li>
                <li className="list-group-item m-2">
                  <b className="p-4">Full Name:</b>
                  {user.fullName}
                </li>
                <li className="list-group-item m-2">
                  <b className="p-4">Writing Genre:</b>
                  {user.category}
                </li>
                <li className="list-group-item m-2">
                  <b className="p-4">Profile Description:</b>
                  {user.message}
                </li>
                <li className="list-group-item m-2">
                  <b className="p-4">User role:</b>
                  {role}
                </li>
              </ul>
            </div>
            <div>
              <button
                className="btn btn-outline-primary m-2 px-4"
                onClick={() => handleViewImage(user.id)}
              >
                View Profile Image
              </button>
              {imageUrl && (
                <div className="mb-3">
                  <img
                    src={imageUrl}
                    alt="profile"
                    width="350px"
                    length="450px"
                    style={{ borderRadius: "5%" }}
                  >
                  </img>
                </div>
              )}
            </div>
            <Link
              className="btn btn-primary mx-2"
              to={`/viewBlogByUserName/${user.username}`}
            >
              View Blogs
            </Link>
            <Link className="btn btn-outline-primary m-2 px-4" to="/details">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
