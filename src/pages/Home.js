import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
export default function Home() {
  const [users, setUsers] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
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

  const fetchTopPosts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/topPosts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Top Posts:", res.data);
      setTopBlogs(res.data);
    } catch (err) {
      console.error("Error fetching top posts:", err);
    }
  };
  useEffect(() => {
    if (token) fetchTopPosts();
  }, [token]);

  const formatDate = (postCreatedAt) => {
    return new Date(postCreatedAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  const formattedPosts = topBlogs.map((post) => ({
    id: post[0],
    title: post[1],
    viewCount: post[2],
    genre: post[3],
    content: post[4],
    author: post[5],
    createdAt: post[6],
    likes: post[7],
    comments: post[8],
    views: post[9],
  }));
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
  const filteredUsers = users.filter(
    (user) =>
      user.username !== "admin" &&
      user.username !== localStorage.getItem("username") &&
      user.isVerified === "true",
  );
  return (
    <div style={{ width: "100%" }}>
      <Navbar />
      <div className="container" style={{ width: "100%" }}>
        <div style={{ fontFamily: "monospace", marginTop: "1%", color: "red" }}>
          Session Time Left: {formatTime(timeLeft)}
        </div>
        <h1
          style={{
            fontFamily: "sans-serif",
            marginTop: "2%",
            marginBottom: "3%",
            color: "Highlight",
          }}
        >
          UVB Portal – Explore, Write, and Share Space Technology
        </h1>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "18px",
            padding: "5px",
            textAlign: "justify",
            marginBottom: "1%",
            lineHeight: "1cm",
          }}
        >
          UVB Portal is a modern blogging platform that aims to empower aspiring
          writers to contribute, learn, and grow within a focused community
          driven by curiosity for space and technology. The platform provides a
          secure and intuitive environment where users can create, manage, and
          share content while exploring ideas from fellow enthusiasts. We
          encourage knowledge sharing and continuous learning within the space
          technology domain.{" "}
        </p>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "18px",
            padding: "5px",
            textAlign: "justify",
            marginBottom: "1%",
            lineHeight: "1cm",
          }}
        >
          The platform offers complete user management with full CRUD
          capabilities, enabling seamless creation, retrieval and update of
          blogger profiles. Authentication is handled using JWT-based security,
          ensuring safe access and protected user sessions. Users can
          personalize their profiles by uploading profile images, with options
          to view and remove them at any time. UVB Portal also includes a
          rich-text editor that supports styled content, allowing writers to
          structure articles with clarity and visual appeal. Writers can publish
          blogs, explore posts from other users, and maintain full control over
          their own content with edit and delete functionalities. They can also
          appreciate other writers by liking and commenting on their posts,
          fostering a vibrant community of space technology enthusiasts.
        </p>
        <div>
          <h3
              style={{
                fontFamily: "monospace",
                textDecoration: "underline",
                marginTop: "2%",
                marginBottom: "3%",
                color: "Highlight",
              }}
            >
              Services We Provide
            </h3>

          <div className="plans-container" style={{display:"flex", marginBottom:"5%"}}>
            {/* Free Tier */}
            <div className="plan-card free" style={{border:"solid 1px black", marginLeft:"15%"}} >
              <h4 style={{fontFamily: "monospace", textDecoration:"overline", marginTop:"5%"}}>Free Tier</h4>
              <ul style={{textAlign:"justify", padding:"5px", margin:"5%"}}>
                <li>✔ Create & edit blogs</li>
                <li>✔ View posts</li>
                <li>✔ Like & comment</li>
                <li>✔ Basic profile</li>
                <li>✔ Read the trending posts</li>
                <li>✔ Search functionality</li>
                <li>❌ Trending filters</li>
                <li>❌ Bookmarks</li>
                <li>❌ Personalized Notifications</li>
              </ul>
              <button className="btn btn-outline-primary">Your Plan</button>
            </div>
              <hr style={{marginLeft:"15%"}}/>
            {/* Premium Tier */}
            <div className="plan-card premium" style={{border:"solid 1px black", marginLeft:"15%"}}>
              <h4 style={{fontFamily: "monospace", textDecoration:"overline", marginTop:"5%"}}>Premium Tier 🚀</h4>
              <ul style={{textAlign:"justify", padding:"5px", margin:"5%"}}>
                <li>✔ Everything in Free</li>
                <li>✔ Follow users</li>
                <li>✔ Trending & popular filters</li>
                <li>✔ Bookmarks</li>
                <li>✔ Personalized notifications</li>
                <li>✔ Advanced analytics dashboard</li>
                <li>✔ Advanced writing tools</li>
                <li>✔ Priority support</li>
                <li>✔ Membership of our Internal Community</li>
                <li>✔ Exclusive webinars & workshops</li>
              </ul>
              <button className="btn btn-outline-primary">Upgrade Now❗</button>
            </div>
          </div>
          <h3>🔥Trending Blogs</h3>
          {formattedPosts.length === 0 ? (
            <p>No trending blogs available at the moment.</p>
          ) : (
            <div className="row">
            {formattedPosts.map((blog, index) => (
              <div key={index} className="card container mb-3 h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title" style={{ fontWeight: "bold" }}>
                    {blog.title}
                  </h5>
                  <p className="card-text">
                    <strong>👤 Author:</strong> {blog.author}
                  </p>
                  <p className="card-text">
                    <strong>📂 Genre:</strong> {blog.genre}
                  </p>
                  <p className="card-text">
                    <strong>📝 Posted On:</strong>
                    <div
                      style={{
                        fontSize: "18px",
                        padding: "10px",
                      }}
                    >
                      {formatDate(blog.createdAt)}
                    </div>
                  </p>
                </div>
                <button
                  className="btn p-1 btn-outline-primary"
                  title="post views"
                >
                  👀 {blog.viewCount}
                </button>
                <button
                  className="btn p-1 btn-outline-primary"
                  title="post likes"
                >
                  👍 {blog.likes}
                </button>
                <div className="card-footer bg-white border-0">
                  <Link
                    title="View Blog"
                    className="btn btn-primary"
                    to={`/viewblog/${blog.id}`}
                  >
                    Read Blog 📖
                  </Link>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
        <h2
          style={{
            fontFamily: "monospace",
            textDecoration: "overline",
            marginTop: "3%",
          }}
        >
          Other Registered Writers of UVB
        </h2>
        {/***<p style={{ color: "red", fontWeight: "bold" }}>
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
        </p>***/}
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
                  <td>{user.isVerified}</td>
                  <td>
                    <Link
                      title="View User Profile"
                      className="btn btn-primary mx-2"
                      to={`/viewuser/${user.id}`}
                    >
                      👁️
                    </Link>
                    {(isAdmin ||
                      user.username === localStorage.getItem("username")) && (
                      <Link
                        title="Edit User Profile"
                        className="btn btn-outline-primary mx-2"
                        to={`/edituser/${user.id}`}
                      >
                        🖊
                      </Link>
                    )}

                    {isAdmin && (
                      <button
                        title="Delete User"
                        className="btn btn-danger mx-2"
                        onClick={() => deleteUser(user.id, user.username)}
                      >
                        🗑️
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
