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

  useEffect(() => {
    if(username){
      loadPost(username);
    }
  }, [username]);

  const handleGoBack = () => {
    window.history.back();
  }
  const loadPost = async (username) => {
    try{
    const result = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/blogsByUser/${username}`,
      {
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    setPost(result.data);
    console.log(result.data);
  }catch(error){
    alert('Error! Blog details could not be fetched, having error: '+error.message);
    console.error("Error loading blog details:", error);
  }
  };
  const deleteBlog = async (id) => {
      const deleteConfirmed = window.confirm("Are you sure you want to delete this blog?");
      if(!deleteConfirmed) return;
    try{
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/${id}`,{
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
    alert('Alert! you just deleted a Blog');
    window.history.back();
    }catch(error){
      alert('Error! Blog could not be deleted, having error: ' + error.message);
      console.error("Error deleting blog:", error);
    }
  };
  
  const handleEditBlog = (postId) => {
      Navigate(`/editBlog/${postId}`);
      }
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
                  <h4>Blog: {index+1}</h4>
                  <h5>Writer_username: {post.writerUsername}</h5>
                  <h5 style={{fontWeight:"bold"}}>Title:  {post.postTitle}</h5>
                  <p>Content: <div style={{
                      fontSize: "18px",
                      padding: "10px",
                      textAlign: "justify",
                      fontFamily: "Times New Roman",
                      fontWeight: "normal"
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.postBody || ""),
                    }}></div></p>
                  <div className="col">
                  <button
              className="btn btn-danger mx-2"
              onClick={() => deleteBlog(post.postId)} disabled={post.writerUsername !== localStorage.getItem("username") || localStorage.getItem("username") === "admin"}
            >
              Delete
            </button>
            <button className="btn btn-primary mx-2" onClick={()=>handleEditBlog(post.postId)} disabled={post.writerUsername !== localStorage.getItem("username")}>
              Edit Blog
            </button>
                </div>
                </div>
              ))}
              
            <Link className="btn btn-outline-primary m-2 px-4" to="/writeBlogs">
              Write New Blog
            </Link>
            
            <Link className="btn btn-outline-primary m-2 px-4" to="/details">
              Back to Bloggers List
            </Link>
            <button className="btn btn-outline-secondary m-2 px-4" onClick={handleGoBack}>Go Back</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default ViewBlogByUserName;
