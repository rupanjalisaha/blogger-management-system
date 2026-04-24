import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import DOMPurify from "dompurify";

function ViewBlogByUserName() {
  const [post, setPost] = useState([]);
  const Navigate = useNavigate();
  const { username } = useParams();
  const [likes, setLikes] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (username) {
      loadPost(username);
    }
  }, [username]);

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
      height: "80%",
      position: "relative",
    },
    closeBtn: {
      position: "absolute",
      top: "5px",
      right: "5px",
    },
  };
  const handleGoBack = () => {
    window.history.back();
  };

  const loadPost = async (username) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/blogsByUser/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setPost(result.data);
      console.log(result.data);
    } catch (error) {
      alert(
        "Error! Blog details could not be fetched, having error: " +
          error.message,
      );
      console.error("Error loading blog details:", error);
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
      setLikes((prev) => ({
        ...prev,
        [postId]: response.data,
      }));
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
      setIsLiked((prev) => ({
        ...prev,
        [postId]: true,
      }));
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };
  useEffect(() => {
    if (post.length > 0) {
      post.forEach((p) => {
        fetchLikes(p.postId);
      });
    }
  }, [post]);

  const getShareUrl = (postId) => {
    return `${window.location.origin}/post/${postId}`;
  }
  const getText = (postTitle)=>{
    return encodeURIComponent(postTitle);
  }

  const handleNativeShare = async (postId) => {
    await navigator.clipboard.writeText(getShareUrl(postId));
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        url: getShareUrl(postId),
      });
    }
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
      alert("Alert! you just deleted a Blog");
      window.history.back();
    } catch (error) {
      alert("Error! Blog could not be deleted, having error: " + error.message);
      console.error("Error deleting blog:", error);
    }
  };

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <button className="btn p-1 btn-outline-primary" onClick={onClose} style={styles.closeBtn}>
            X
          </button>
          {children}
        </div>
      </div>
    );
  };
  const handleEditBlog = (postId) => {
    Navigate(`/editBlog/${postId}`);
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
              {post.map((post, index) => (
                <div key={index} className="card shadow mb-4">
                  <h4>Blog: {index + 1}</h4>
                  <h5>Writer_username: {post.writerUsername}</h5>
                  <h5 style={{ fontWeight: "bold" }}>
                    Title: {post.postTitle}
                  </h5>
                  <p>
                    Content:{" "}
                    <div
                      style={{
                        fontSize: "18px",
                        padding: "10px",
                        textAlign: "justify",
                        fontFamily: "Times New Roman",
                        fontWeight: "normal",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.postBody || ""),
                      }}
                    ></div>
                  </p>
                  <div className="col">
                    <button
                      className={
                        isLiked[post.postId]
                          ? "btn active p-1 btn-outline-primary"
                          : "btn p-1 btn-outline-primary"
                      }
                      onClick={() => handleLike(post.postId)}
                    >
                      👍{likes[post.postId] || 0}
                    </button>
                    <button
                      className="btn p-1 btn-primary mx-2"
                      style={{ marginLeft: "5px" }}
                      onClick={() => setIsOpen(true)}
                    >
                      ↩️share
                    </button>
                    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                      <button className="btn p-1 btn-outline-primary mx-2" onClick={()=>handleNativeShare(post.postId)}>Share</button>

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
                      title="Delete Blog"
                      className="btn btn-danger mx-2"
                      onClick={() => deleteBlog(post.postId)}
                      disabled={
                        post.writerUsername !==
                          localStorage.getItem("username") ||
                        localStorage.getItem("username") === "admin"
                      }
                    >
                      🗑️ Delete
                    </button>
                    <button
                      title="Edit Blog"
                      className="btn btn-primary mx-2"
                      onClick={() => handleEditBlog(post.postId)}
                      disabled={
                        post.writerUsername !== localStorage.getItem("username")
                      }
                    >
                      🖍 Edit
                    </button>
                  </div>
                </div>
              ))}

              <Link
                title="Write New Blog"
                className="btn btn-outline-primary m-2 px-4"
                to="/writeBlogs"
              >
                ✍︎ Write
              </Link>
              <button
                title="Go Back"
                className="btn btn-outline-secondary m-2 px-4"
                onClick={handleGoBack}
              >
                🔙
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBlogByUserName;
