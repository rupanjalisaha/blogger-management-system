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
  const [isCommentClicked, setIsCommentClicked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({});
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

  const handleComments = async () => {
    setIsCommentClicked(true);
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
      setComments((prev) => ({
        ...prev,
        [postId]: res.data,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }
  useEffect(() => {
    if (post.length > 0) {
      post.forEach((p) => {
        fetchComments(p.postId);
      });
    }
  }, [post]);

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
  const handleEditBlog = (postId) => {
    Navigate(`/editBlog/${postId}`);
  };
  const handleSubmitComment = async(postId, comment, parentId = null)=>{
    const query = new URLSearchParams({
      postId: postId,
      parentId: parentId || "",
    }).toString();
    
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/comments?${query}`, comment, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if(res.status === 200){
      alert("Comment added successfully!");
    } else {
      alert("Failed to add comment. Please try again.");
    }
    fetchComments(postId);
    setComment("");
  }
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
            <div className="card shadow m-4">
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
                        onClick={() =>
                          handleNativeShare(post.postId, post.title)
                        }
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
                          await navigator.clipboard.writeText(
                            getShareUrl(post.postId),
                          );
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
                    {comments[post.postId]?.length > 0 && (
                      <div style={{textAlign:"left", marginLeft:"20px"}}>
                        <h3 style={{"fontFamily":"cursive"}}>Comments:</h3>
                        {comments[post.postId].map((c) => (
                          <div key={c.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
                            <div>
                            <p><strong>{c.username}:</strong></p>
                            <button style={{border:"solid 1px black", borderRadius:"10%", marginLeft:"5%", padding:"2px", backgroundColor:"ButtonShadow"}}> {c.content}</button><Link style={{marginLeft:"2%", marginTop:"2%"}}>Reply</Link>
                            </div>
                            <p style={{marginLeft:"80%", fontSize:"14px"}}>{timeAgo(c.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {isCommentClicked && (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitComment(post.postId, comment);
                      }}>
                        <input
                          type="text"
                          className="form-control"
                          id="comment"
                          value={comment}
                          placeholder="Write a comment..."
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <button className="btn p-1 btn-outline-primary my-2" type="submit">Post</button>
                      </form>
                    )}
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
