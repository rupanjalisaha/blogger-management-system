import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import DOMPurify from "dompurify";
import CommentForm from "../Utils/CommentForm";
function ViewBlogById() {
  const [post, setPost] = useState({
    genre: "",
    postBody: "",
    postTitle: "",
    writerUsername: "",
  });
  const [likes, setLikes] = useState(0);
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [isCommentClicked, setIsCommentClicked] = useState(false);
  const styles = {
    overlay: {
      position: "fixed",
      top: 300,
      left: 500,
      width: "50%",
      height: "50%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      padding: "20px",
      borderRadius: "8px",
      background: "#fff",
      width: "80%",
      height: "50%",
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    closeBtn: {
      position: "absolute",
      top: "5px",
      right: "5px",
    },
  };

  const formatDate = (postCreatedAt) => {
    const formatted = new Date(postCreatedAt).toLocaleString();

    console.log(formatted);
    return formatted;
  };
  const handleComments = async () => {
    setIsCommentClicked(true);
  };
  const [comment, setComment] = useState("");
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
      fetchComments(result.data.postId);
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
      setIsLiked(true);
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };
  useEffect(() => {
    if (post.postId) {
      fetchLikes(post.postId);
    }
  }, [post.postId]);
  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/comments/${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(res.data);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };
  useEffect(() => {
    if (post.postId) {
      fetchComments(post.postId);
    }
  }, [post.postId]);

  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", crypto.randomUUID());
  }
  useEffect(() => {
    if (!post.postId) return;
    const timer = setTimeout(() => {
      axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/views/${post.postId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      loadPost(); // refresh post to update view count
    }, 3000); // user stayed 5 seconds

    return () => clearTimeout(timer);
  }, [post.postId, loadPost]);

  const getShareUrl = (postId) => {
    return `${window.location.origin}/post/${postId}`;
  };
  const getText = (postTitle) => {
    return encodeURIComponent(postTitle);
  };

  const handleNativeShare = async (postId, postTitle) => {
    await navigator.clipboard.writeText(getShareUrl(postId));
    if (navigator.share) {
      await navigator.share({
        title: postTitle,
        url: getShareUrl(postId),
      });
    }
  };
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <button
            className="btn p-1 btn-outline-primary"
            onClick={onClose}
            style={styles.closeBtn}
          >
            X
          </button>
          {children}
        </div>
      </div>
    );
  };
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
      navigate("/viewBlogs");
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
  const handleSubmitComment = async (postId, comment, parentId = null) => {
    if (!comment.trim()) return;
    const query = new URLSearchParams({
      postId: postId,
      parentId: parentId || "",
    }).toString();

    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/comments?${query}`,
      comment,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    if (res.status === 200) {
      alert("Comment added successfully!");
    } else {
      alert("Failed to add comment. Please try again.");
    }
    fetchComments(postId);
    setComment("");
  };
  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;

    return past.toLocaleDateString();
  };
  const handleDeleteComment = async (postId, commentId) => {
    const deleteConfirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );
    if (!deleteConfirmed) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/removeComments/${commentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      alert("Comment deleted successfully!");
      fetchComments(postId);
    } catch (error) {
      alert(
        "Error! Comment could not be deleted, having error: " + error.message,
      );
      console.error("Error deleting comment:", error);
    }
  };
  const countWords = (char) => {
    if (typeof char !== "string") return 0;
    const text = char.replace(/<[^>]+>/g, "").trim();
    const words = text.split(/\s+/).filter(Boolean);
    return words.length;
  };
  const readingTime = Math.ceil(countWords(post.postBody) / 200);
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
              <p style={{ marginLeft: "65%" }}>Posted on: {formatDate(post.createdAt)}</p>
              <p style={{ marginLeft: "70%" }}>
                Reading time: {readingTime} mins
              </p>
            </div>
            <button
              className={
                isLiked
                  ? "btn active p-1 btn-primary mx-2"
                  : "btn p-1 btn-primary mx-2"
              }
              onClick={() => handleLike(post.postId)}
            >
              👍{likes}
            </button>
            <button className="btn p-1 btn-primary mx-2" style={{ marginLeft: "5px" }}>👀 {post.viewCount}</button>
            {(post.writerUsername === localStorage.getItem("username") ||
              localStorage.getItem("username") === "admin") && (
              <button
                title="Delete Blog"
                className="btn btn-danger mx-2"
                style={{ marginLeft: "5px" }}
                onClick={() => deleteBlog(post.postId)}
              >
                🗑️ Delete
              </button>
            )}
            {post.writerUsername === localStorage.getItem("username") && (
              <button
                title="Edit Blog"
                className="btn btn-primary mx-2"
                onClick={() => handleEditBlog(post.postId)}
              >
                🖍 Edit
              </button>
            )}
            <button
              className="btn p-1 btn-primary mx-2"
              style={{ marginLeft: "5px" }}
              onClick={() => setIsOpen(true)}
            >
              ↩️share
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <button
                className="btn p-1 btn-outline-primary mx-2"
                onClick={() => handleNativeShare(post.postId, post.title)}
              >
                Share
              </button>

              <button
                className="btn p-1 btn-outline-primary mx-2"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${getText(post.title)}%20${getShareUrl(post.postId)}`,
                    "_blank",
                  )
                }
              >
                WhatsApp
              </button>

              <button
                className="btn p-1 btn-outline-primary mx-2"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${getText(post.title)}&url=${getShareUrl(post.postId)}`,
                    "_blank",
                  )
                }
              >
                Twitter
              </button>

              <button
                className="btn p-1 btn-outline-primary mx-2"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${getShareUrl(post.postId)}`,
                    "_blank",
                  )
                }
              >
                LinkedIn
              </button>

              <button
                className="btn p-1 btn-outline-primary mx-2"
                onClick={async () => {
                  await navigator.clipboard.writeText(getShareUrl(post.postId));
                  alert("Copied!");
                }}
              >
                Copy Link
              </button>
            </Modal>
            <button
              title="Make a comment"
              className="btn btn-primary m-2 px-4"
              onClick={() => handleComments()}
            >
              Comment 💬
            </button>
            {comments.length > 0 && (
              <div style={{ textAlign: "left", marginLeft: "20px" }}>
                <h3 style={{ fontFamily: "cursive" }}>Comments:</h3>
                {comments.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      borderBottom: "1px solid #ccc",
                      padding: "10px 0",
                    }}
                  >
                    <div>
                      <p>
                        <strong>{c.username}:</strong>
                      </p>
                      <button
                        style={{
                          border: "solid 1px black",
                          borderRadius: "5%",
                          marginLeft: "5%",
                          padding: "5px",
                          backgroundColor: "ButtonShadow",
                        }}
                      >
                        {" "}
                        {c.content}
                      </button>
                      <p
                        style={{
                          marginLeft: "10%",
                          marginTop: "2%",
                          fontSize: "14px",
                        }}
                      >
                        {timeAgo(c.createdAt)}
                      </p>
                      <button
                        className="btn p-1 btn-outline-primary mt-2"
                        style={{ marginLeft: "10%" }}
                      >
                        Reply
                      </button>
                      {(post.writerUsername ===
                        localStorage.getItem("username") ||
                        localStorage.getItem("username") === "admin") && (
                        <button
                          className="btn p-1 btn-outline-danger mt-2"
                          style={{ marginLeft: "3%" }}
                          onClick={() => handleDeleteComment(post.postId, c.id)}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {isCommentClicked && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitComment(post.postId, comment);
                }}
              >
                <input
                  type="text"
                  width="80%"
                  className="form-control"
                  id="comment"
                  value={comment}
                  placeholder="Write a comment..."
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="btn p-1 btn-outline-primary my-2"
                  type="submit"
                >
                  Post
                </button>
              </form>
            )}
            <Link
              title="Back to Blog List"
              className="btn btn-outline-primary m-2 px-4"
              to="/viewBlogs"
            >
              🔙
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBlogById;
