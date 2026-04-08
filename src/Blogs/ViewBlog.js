import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import PostNavbar from "../layout/PostNavbar";
export default function ViewBlog() {
  const [post, setPost] = useState([]);
  const [isPostAvailable, setIsPostAvailable] = useState(false);
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try{
    const result = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/blogsDetails`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    setPost(result.data);
    setIsPostAvailable(true);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    alert("Failed to load blogs. Please try again later.");
  }
  };

  return (
    <div>
      <Navbar />
      <PostNavbar />
      <div className="container">
        <h2>Blog List</h2>
        {post && (
          <>
        <p style={{ color: "red", fontWeight: "bold" }}>
          * Edit & Delete blogs is active for user account only 
        </p>
        <div className="py-4">
          <table className="table border shadow">
            <thead>
              <tr>
                <th scope="col">S.N.</th>
                <th scope="col">Username</th>
                <th scope="col">Blog Genre</th>
                <th scope="col">Blog Title</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {post.map((post, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{post.writerUsername}</td>
                  <td>{post.genre}</td>
                  <td style={{fontWeight:"bold"}}>{post.postTitle}</td>
                  <td>
                    <Link
                      className="btn btn-primary mx-2"
                      to={`/viewblog/${post.postId}`}
                    >
                      View
                    </Link>
                    
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>)}
    </div>
    </div>
  );
}
