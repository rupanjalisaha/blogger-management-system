import { useState } from "react";
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
   const [isOrderedList, setIsOrderedList] = useState(false);
   const [isUnorderedList, setIsUnorderedList] = useState(false);
   const [isItalic, setIsItalic] = useState(false);
   const [isUnderlined, setIsUnderlined] = useState(false);
   const [isHighlighted, setIsHighlighted] = useState(false);
   const [isFontSizeSelected, setIsFontSizeSelected] = useState(false);
   const [IsFontFamilySet, setIsFontFamilySet] = useState(false);
   const [viewTextEditor, setViewTextEditor] = useState(false);

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
    setIsOrderedList(document.queryCommandState("insertOrderedList"));
    setIsUnorderedList(document.queryCommandState("insertUnorderedList"));
    setIsHighlighted(document.queryCommandState("hiliteColor"));
    setIsFontSizeSelected(document.queryCommandState("fontSize"));
    setIsFontFamilySet(document.queryCommandState("fontFamily"));
  };
  const applyBold = (e) => {
    e.preventDefault();
    applyCommand("bold");
  };
  const applyUnorderedList = (e) => {
    e.preventDefault();
    applyCommand("insertUnorderedList");
  };
  const applyOrderedList = (e) => {
    e.preventDefault();
    applyCommand("insertOrderedList");
  };
  const applyItalic = (e) => {
    e.preventDefault();
    applyCommand("italic");
  };
  const applyUnderline = (e) => {
    e.preventDefault();
    applyCommand("underline");
  };
  const applyHighlight = (color) => {
    if (!selectionInsideEditor()) return;
    document.execCommand("hiliteColor", false, color);
    const html = editorRef.current ? editorRef.current.innerHTML : "";
    setPost((prev) => ({ ...prev, postBody: html }));
  };
  const applyFontSize = (size) => {
    if (!selectionInsideEditor()) return;
    document.execCommand("fontSize", false, size);

    const html = editorRef.current ? editorRef.current.innerHTML : "";
    setPost((prev) => ({ ...prev, postBody: html }));
  };
  const applyFontFamily = (font) => {
    document.execCommand("fontName", false, font);

    const html = editorRef.current ? editorRef.current.innerHTML : "";
    setPost((prev) => ({ ...prev, postBody: html }));
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
  },[]);
  const categoryOptions = [
    { label: "Select an option", value: `{post.genre}` },
    { label: "Space Exploration Missions", value: "Space Exploration Missions" },
    { label: "Rocket Science Basics", value: "Rocket Science Basics" },
    { label: "Satellites and Communication", value: "Satellites and Communication" },
    { label: "Astronomy and Astrophysics", value: "Astronomy and Astrophysics" },
    { label: "Space Agencies (ISRO, NASA, ESA)", value: "Space Agencies (ISRO, NASA, ESA)" },
    { label: "Emerging Space Technologies", value: "Emerging Space Technologies" },
    { label: "Space Startups and Innovations", value: "Space Startups and Innovations" },
    { label: "Human Spaceflight", value: "Human Spaceflight" },
    { label: "Planetary Science", value: "Planetary Science" },
    { label: "Space Research and Discoveries", value: "Space Research and Discoveries" },
    { label: "AI and Space Technology", value: "AI and Space Technology" },
    { label: "Space Debates and Opinions", value: "Space Debates and Opinions" }
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
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/${id}`, post, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const confirmMessage= window.confirm("Blog edited! Are you sure to submit?");
      if(!confirmMessage) return;
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
              {!viewTextEditor?<button className="btn btn-primary" 
        style={{fontFamily: "Times New Roman",
              fontWeight: "bold",
              margin: "2px",
              marginLeft:"70%"}}
        onClick={()=> setViewTextEditor(true)}>View Style Palette</button>:
        <div style={{ marginLeft: "8%", marginTop: "8px" }}>
          <select
            className={`shadow border rounded ${isFontSizeSelected ? "active" : ""}`}
            style={{
              fontFamily: "Times New Roman",
              fontWeight: "bold",
              margin: "2px",
              marginLeft:"30%",
              marginBottom:"5%"
            }}
            onChange={(e) => applyFontSize(e.target.value)}
          >
            <option value="">Font Size</option>
            <option value="4">Text</option>
            <option value="5">Sub-Header</option>
            <option value="6">Header</option>
            <option value="7">Title</option>
          </select>
          <select className={`shadow border rounded ${IsFontFamilySet ? "active" : ""}`}
            style={{
              fontFamily: "Times New Roman",
              fontWeight: "bold",
            }}
            onChange={(e) => applyFontFamily(e.target.value)}>
              <option value="">Font Family</option>
            <option value="Times New Roman">Times</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier</option>
            <option value="Cursive">Cursive</option>
            <option value="sans-serif">Sans-serif</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Poppins">Poppins</option>
          </select>
          <button
            className={`shadow border rounded ${isBold ? "active" : ""}`}
            style={{
              fontFamily: "Times New Roman",
              fontWeight: "bold",
              margin: "2px",
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
              fontFamily: "Times New Roman",
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
            style={{ fontFamily: "Times New Roman", textDecoration: "underline" }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={applyUnderline}
            type="button"
          >
            U
          </button>
          <button
            className={`shadow border rounded ${isUnorderedList ? "active" : ""}`}
            style={{
              fontFamily: "Times New Roman",
              margin: "2px",
            }}
            onMouseDown={(e) => e.preventDefault()} // prevent losing selection on click
            onClick={applyUnorderedList}
            type="button"
          >
            •
          </button>
          <button
            className={`shadow border rounded ${isOrderedList ? "active" : ""}`}
            style={{
              fontFamily: "Times New Roman",
              margin: "2px",
            }}
            onMouseDown={(e) => e.preventDefault()} // prevent losing selection on click
            onClick={applyOrderedList}
            type="button"
          >
            1.
          </button>
          <button
            className={`shadow border rounded ${isHighlighted ? "active" : ""}`}
            style={{
              fontFamily: "Times New Roman",
              margin: "2px",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyHighlight("LemonChiffon")}
            type="button"
          >
            🟡
          </button>
          <button
            className={`shadow border rounded ${isHighlighted ? "active" : ""}`}
            style={{
              fontFamily: "Times New Roman",
              fontWeight: "bold",
              margin: "2px",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyHighlight("red")}
            type="button"
          >
            🟥
          </button>
          <button
            className={`shadow border rounded ${isHighlighted ? "active" : ""}`}
            style={{
              fontFamily: "Times New Roman",
              fontWeight: "bold",
              margin: "2px",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyHighlight("skyblue")}
            type="button"
          >
            💙
          </button>
        </div>
        }
              <button title="Submit" className="btn btn-outline-primary m-3" type="submit">
                ✔
              </button>
              <Link title="Cancel" className="btn btn-outline-danger" to="/viewBlogs">
                🗙
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBlog;
