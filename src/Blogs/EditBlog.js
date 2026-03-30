import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../layout/Navbar";
import DOMPurify from "dompurify"; // optional but recommended: npm install dompurify
import { useRef } from "react";

function EditBlog() {
  const [post, setPost] = useState({
    genre: "",
    postBody: "",
    postTitle: "",
    writerUsername: "",
  });
  const { genre, postBody, postTitle, writerUsername } = post;

  let navigate = useNavigate();
  const { id } = useParams();

  const editorRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  // keep editor's innerHTML in sync with state (useful if you programmatically set content)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== postBody) {
      editorRef.current.innerHTML = postBody;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postBody]);
  const selectionInsideEditor = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    if (!editorRef.current) return false;
    return editorRef.current.contains(range.commonAncestorContainer);
  };

  const applyCommand = (command) => {
    // Only apply formatting when selection is inside editor
    if (!selectionInsideEditor()) {
      // focus the editor so user can apply to caret (or do nothing)
      if (editorRef.current) editorRef.current.focus();
      return;
    }
    // execCommand toggles the given inline format
    document.execCommand(command, false, null);

    // after applying update state with current innerHTML
    const html = editorRef.current ? editorRef.current.innerHTML : "";
    setPost((prev) => ({ ...prev, postBody: html }));

    // update format toggles (optional: inspect selection's computed style)
    // Quick heuristic: check if selection contains tags
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderlined(document.queryCommandState("underline"));
  };
  const applyBold = (e) => {
    e.preventDefault();
    applyCommand("bold");
  };
  const applyItalic = (e) => {
    e.preventDefault();
    applyCommand("italic");
  };
  const applyUnderline = (e) => {
    e.preventDefault();
    applyCommand("underline");
  };
  const handleInput = () => {
    const html = editorRef.current ? editorRef.current.innerHTML : "";
    setPost((prev) => ({ ...prev, postBody: html }));
  };

  const onInputChange = (e) => {
    setPost({ ...post, [e.target.id]: e.target.value });
  };
  useEffect(() => {
    loadPost();
  }, []);
  const categoryOptions = [
    { label: "Select an option", value: `{post.genre}` },
    { label: "Fiction", value: "Fiction" },
    { label: "Non-Fiction", value: "Non-Fiction" },
    { label: "Poetry", value: "Poetry" },
    { label: "Science Fiction", value: "Science Fiction" },
    { label: "Fantasy", value: "Fantasy" },
    { label: "Mystery", value: "Mystery" },
    { label: "Romance", value: "Romance" },
    { label: "Horror", value: "Horror" },
    { label: "Biography", value: "Biography" },
    { label: "Self-Help", value: "Self-Help" },
    { label: "Health & Wellness", value: "Health & Wellness" },
    { label: "Travel", value: "Travel" },
    { label: "Food & Cooking", value: "Food & Cooking" },
    { label: "History", value: "History" },
    { label: "Science & Technology", value: "Science & Technology" },
    { label: "Business & Finance", value: "Business & Finance" },
    { label: "Art & Photography", value: "Art & Photography" },
    { label: "Children's Books", value: "Children's Books" },
    { label: "Young Adult", value: "Young Adult" },
    { label: "Other", value: "Other" },
  ];
  var errorMessage = "";
  if (postBody && postBody.replace(/<[^>]+>/g, "").trim().length < 200) {
    errorMessage = "* Article content must be at least 200 characters long";
  }
  else if(!genre || !postTitle || !postBody){
    errorMessage = "All fields are required to submit a blog.";
  }else if (postBody && postBody.replace(/<[^>]+>/g, "").trim().length > 5000) {
    errorMessage = "* Article content cannot exceed 5000 characters.";
  }else if(postTitle && postTitle.trim().length > 100){
    errorMessage = "* Blog title cannot exceed 100 characters.";
  }else if(writerUsername && writerUsername.trim().length > 30){
    errorMessage = "* Author username cannot exceed 30 characters.";
  }
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!errorMessage){
      await axios.put(`http://localhost:8080/UVB/blogs/${id}`, post, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Blog edited!");
      navigate("/viewBlogs");
    }} catch (error) {
      alert(
        "Error! Blog could not be edited. Check console for error details.",
      );
      console.error("Error updating blog:", error);
    }
  };
  const loadPost = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/UVB/blogs/blogsDetails/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setPost(result.data);
    } catch (error) {
      alert(
        "Error! Blog details could not be fetched, having error: " +
          error.message,
      );
      console.error("Error loading blog details:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div
            className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow"
            style={{ width: "60%", marginLeft: "20%" }}
          >
            <div className="text-center m-2 fs-2">Edit Blog</div>
            <form className="mt-5" onSubmit={(e) => onSubmit(e)}>
              <div className="mb-3 mt-3">
                <label htmlFor="writerUsername" className="form-label fs-5">
                  Author Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="writerUsername"
                  placeholder="What shall we call you?"
                  value={writerUsername}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="genre" className="form-label fs-5">
                  Article Genre
                </label>
                <select
                  className="form-control"
                  id="genre"
                  value={genre}
                  onChange={(e) => onInputChange(e)}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="postTitle" className="form-label fs-5">
                  Blog Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="postTitle"
                  placeholder="Blog Title"
                  value={postTitle}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="postBody" className="form-label fs-5">
                  Blog Content
                </label>
                <div
                  rows={20}
                  className="form-control"
                  id="postBody"
                  required
                  role="textbox"
                  contentEditable={true} // Make it editable
                  placeholder="Blog Content"
                  style={{
                    fontSize: "18px",
                    padding: "10px",
                    textAlign: "justify",
                    fontFamily: "Times New Roman",
                    fontWeight: "normal",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(postBody || ""),
                  }}
                  onInput={handleInput}
                  ref={editorRef}
                  minLength={200}
                  aria-multiline="true"
                  aria-label="Blog content editor"
                  value={postBody}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div style={{ marginLeft: "8%", marginTop: "8px" }}>
                <button
                  className={`shadow border rounded ${isBold ? "active" : ""}`}
                  style={{
                    fontFamily: "cursive",
                    fontWeight: "bold",
                    margin: "2px",
                    marginLeft: "80%",
                  }}
                  onMouseDown={(e) => e.preventDefault()} // prevent losing selection on click
                  onClick={applyBold}
                  type="button"
                >
                  B
                </button>
                <button
                  className={`shadow border rounded ${isItalic ? "active" : ""}`}
                  style={{
                    fontFamily: "cursive",
                    fontStyle: "italic",
                    margin: "2px",
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={applyItalic}
                  type="button"
                >
                  I
                </button>
                <button
                  className={`shadow border rounded ${isUnderlined ? "active" : ""}`}
                  style={{ fontFamily: "cursive", textDecoration: "underline" }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={applyUnderline}
                  type="button"
                >
                  U
                </button>
              </div>

              <button className="btn btn-outline-primary m-3" type="submit">
                Submit
              </button>
              <Link className="btn btn-outline-danger" to="/viewBlogs">
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBlog;
