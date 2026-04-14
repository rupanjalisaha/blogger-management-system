import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
export default function Home() {
  const [users, setUsers] = useState([]);
  const { setIsAuth } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const remainingMs = decoded.exp * 1000 - Date.now();
  const totalSeconds = Math.floor(remainingMs / 1000);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  useEffect(() => {
    if (token) loadUsers();
  }, [token]);
  const navigate = useNavigate();
  const loadUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/bloggerDetails`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("token");
          setIsAuth(false);
          window.location.href = "/login";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const isAdmin = localStorage.getItem("username") === "admin";
  const deleteUser = async (id, username) => {
    try {
      if (isAdmin) {
        const deleteConfirmed = window.confirm(
          "Are you sure you want to delete this user? This action cannot be undone.",
        );
        if (!deleteConfirmed) return;
        const result = await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/UVB/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token with the 'Bearer' scheme
            },
          },
        );
        console.log(result);
        alert("User deleted successfully!");
      } else {
        alert("You can delete your own account only.");
      }
    } catch (error) {
      alert(
        "Error! User could not be deleted. Check console for error details.",
      );
      console.error("Error deleting user:", error);
    }
  };
  const filteredUsers = users.filter((user) => user.username !== "admin");
  return (
    <div style={{ width: "100%" }}>
      <Navbar />
      <div className="container" style={{ width: "100%" }}>
        <h1 style={{ fontFamily: "revert", marginTop: "3%", marginBottom:"3%" }}>
          UVB Portal – Explore, Write, and Share Space Technology
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "16px", padding:"5px", textAlign:"justify", margin:"5%" }}>
          UVB Portal is a modern blogging platform designed for beginner-level
          writers passionate about space technology. It provides a secure and
          intuitive environment where users can create, manage, and share
          content while exploring ideas from fellow enthusiasts. The platform
          offers complete user management with full CRUD capabilities, enabling
          seamless creation, retrieval and update of blogger profiles.
          Authentication is handled using JWT-based security, ensuring safe
          access and protected user sessions. Users can personalize their
          profiles by uploading profile images, with options to view and remove
          them at any time. UVB Portal also includes a rich-text blog editor
          that supports styled content, allowing writers to structure articles
          with clarity and visual appeal. Writers can publish blogs, explore
          posts from other users, and maintain full control over their own
          content with edit and delete functionalities. The platform encourages
          knowledge sharing and continuous learning within the space technology
          domain. UVB Portal aims to empower aspiring writers to contribute,
          learn, and grow within a focused community driven by curiosity for
          space and technology.
        </p>
        <h2
          style={{
            fontFamily: "monospace",
            textDecoration: "overline",
            marginTop: "3%",
          }}
        >
          Registered Writers List of UVB
        </h2>
        <div style={{ fontFamily: "monospace", color: "red" }}>
          Session Time Left: {formatTime(timeLeft)}
        </div>
        <p style={{ color: "red", fontWeight: "bold" }}>
          * Edit & Delete is only possible for own account
        </p>
        <p
          style={{
            color: "blue",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          Admin rights are managed by admins only, contact admin to request for
          admin privileges.
        </p>
        <div className="py-5">
          <table
            className="table border shadow"
            style={{ fontSize: "16px", fontFamily: "monospace" }}
          >
            <thead>
              <tr>
                <th scope="col">S.N.</th>
                <th scope="col">Username</th>
                <th scope="col">Full Name</th>
                <th scope="col">Writing Category</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.category}</td>
                  <td>
                    <Link
                      className="btn btn-primary mx-2"
                      to={`/viewuser/${user.id}`}
                    >
                      View
                    </Link>
                    {(isAdmin ||
                      user.username === localStorage.getItem("username")) && (
                      <Link
                        className="btn btn-outline-primary mx-2"
                        to={`/edituser/${user.id}`}
                      >
                        Edit
                      </Link>
                    )}

                    {isAdmin && (
                      <button
                        className="btn btn-danger mx-2"
                        onClick={() => deleteUser(user.id, user.username)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
