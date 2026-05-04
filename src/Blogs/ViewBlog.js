import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import PostNavbar from "../layout/PostNavbar";
import DOMPurify from "dompurify";

export default function ViewBlog() {
  const [post, setPost] = useState([]);
  const [isPostAvailable, setIsPostAvailable] = useState(false);
  useEffect(() => {
    loadBlogs();
  }, []);
  const [keyword, setKeyword] = useState("");
  const loadBlogs = async () => {
    try {
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
  const filteredPosts = post.filter(
    (p) => p.writerUsername !== localStorage.getItem("username"),
  );
  function getFirst50Words(text) {
    if (!text) return "";

    const words = text.trim().split(/\s+/); // split by spaces, tabs, newlines
    return words.slice(0, 50).join(" ") + (words.length > 50 ? "..." : "");
  }

  const countWords = (char) => {
    if (typeof char !== "string") return 0;
    const text = char.replace(/<[^>]+>/g, "").trim();
    const words = text.split(/\s+/).filter(Boolean);
    return words.length;
  };
  const readingTime = (postBody) => Math.ceil(countWords(postBody) / 200);

  const formatDate = (postCreatedAt) => {
    const formatted = new Date(postCreatedAt + "Z").toLocaleString();

    console.log(postCreatedAt);
    return formatted;
  };
  const isPremium = localStorage.getItem("userType") === "premium";
  const goToUpgrade = () => {
    alert("Upgrade to Premium to access advanced filters and sorting options!");
    window.location.href = "/upgrade";
  };

  const handleSearch = async()=>{
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/search?keyword=${keyword}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setPost(res.data);
  }
  return (
    <div style={{ width: "100%" }}>
      <Navbar />
      <PostNavbar />
      <div className="container" style={{ width: "100%" }}>
        <h2>Blog List</h2>
        {isPostAvailable && (
          <>
            <p style={{ color: "red", fontWeight: "bold" }}>
              * Edit & Delete blogs is active for user account only
            </p>
            <div className="py-4">
              <div className="row">
                <select
                  placeholder="Sort By"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                >
                  <option value="Sort By">Sort By</option>
                  <option value="latest">Latest Blogs</option>
                  <option value="likes">Most Liked Blogs</option>
                  {!isPremium && (
                    <div className="upgrade-box">
                      🔒 Advanced filters available in Premium
                      <button onClick={goToUpgrade}>Upgrade</button>
                    </div>
                  )}
                </select>
                <button type="Submit" onClick={()=>handleSearch}>Search</button>
                {filteredPosts.length === 0 ? (
                  <p style={{ fontFamily: "cursive", color: "ActiveText" }}>
                    "There is no post from other users"
                  </p>
                ) : (
                  filteredPosts.map((post, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <h5
                            className="card-title"
                            style={{ fontWeight: "bold" }}
                          >
                            {post.postTitle}
                          </h5>

                          <p className="card-text">
                            <strong>👤 Author:</strong> {post.writerUsername}
                          </p>

                          <p className="card-text">
                            <strong>📂 Genre:</strong> {post.genre}
                          </p>
                          <p className="card-text">
                            <strong>📝 Summary:</strong>
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
                                __html: DOMPurify.sanitize(
                                  getFirst50Words(post.postBody) || "",
                                ),
                              }}
                            ></div>
                          </p>
                          <p style={{ textAlign: "right", marginLeft: "10%" }}>
                            Posted On: {formatDate(post.createdAt)}
                          </p>
                          <p style={{ textAlign: "right", marginLeft: "10%" }}>
                            Reading time: {readingTime(post.postBody)} mins
                          </p>
                        </div>
                        <div className="card-footer bg-white border-0">
                          <Link
                            title="View Blog"
                            className="btn btn-primary w-100"
                            to={`/viewblog/${post.postId}`}
                          >
                            📖 Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
