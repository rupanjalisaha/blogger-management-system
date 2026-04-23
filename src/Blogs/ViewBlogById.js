import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import DOMPurify from "dompurify";

function ViewBlogById() {
  const [post, setPost] = useState({
    genre: "",
    postBody: "",
    postTitle: "",
    writerUsername: "",
  });
  const Navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const { id } = useParams();
  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/blogsDetails/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setPost(result.data);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      alert(
        "Failed to load blog details. Please check the console for error details.",
      );
    }
  };

  const fetchLikes = async (postId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/blogsDetails/${postId}/count`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setLikes(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  const handleLike = async (postId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/blogsDetails/${postId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchLikes(postId);
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };
  useEffect(() => {
    if(post.postId){
      fetchLikes(post.postId);
    }
  }, [post.postId]);

  const deleteBlog = async (id) => {
    const deleteConfirmed = window.confirm(
      "Are you sure you want to delete this blog?",
    );
    if (!deleteConfirmed) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      Navigate("/viewBlogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again later.");
    }
  };
  const navigate = useNavigate();
  const handleEditBlog = (id) => {
    if (post.writerUsername === localStorage.getItem("username")) {
      navigate(`/editblog/${id}`);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div
            className="offset-md-3 border rounded p-4 mt-2 shadow"
            style={{ width: "70%", marginLeft: "15%" }}
          >
            <h2 className="text-center m-4">Blog Details</h2>
            <div className="card shadow mb-4">
              <h4 className="mt-4">Details of Blog id:{post.postId}</h4>
              <ul className="list-group list-group-flush m-2">
                <li className="list-group-item m-2">
                  <b className="p-4">Writer_username:</b>
                  {post.writerUsername}
                </li>
                <li className="list-group-item m-2">
                  <b className="p-4">Genre:</b>
                  {post.genre}
                </li>
                <li className="list-group-item m-2">
                  <b className="p-4">Title:</b>
                  <b>{post.postTitle}</b>
                </li>
                <li className="list-group-item m-2">
                  <b className="p-4 fs-4">Content</b>
                  <br />
                  <div
                    style={{
                      fontSize: "18px",
                      padding: "10px",
                      textAlign: "justify",
                      fontFamily: "Times New Roman",
                      fontWeight: "light",
                    }}
                    // sanitize to avoid XSS; DOMPurify is recommended
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.postBody || ""),
                    }}
                  ></div>
                </li>
              </ul>
            </div>
            <button
              className="btn p-1 btn-outline-primary"
              onClick={() => handleLike(post.postId)}
            >
              👍{likes}
            </button>
            {(post.writerUsername === localStorage.getItem("username") ||
              localStorage.getItem("username") === "admin") && (
              <button
                className="btn btn-danger mx-2"
                onClick={() => deleteBlog(post.postId)}
              >
                Delete
              </button>
            )}
            {post.writerUsername === localStorage.getItem("username") && (
              <button
                className="btn btn-outline-primary mx-2"
                onClick={() => handleEditBlog(post.postId)}
              >
                Edit
              </button>
            )}
            <Link className="btn btn-outline-primary m-2 px-4" to="/viewBlogs">
              Back to Blog List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBlogById;
