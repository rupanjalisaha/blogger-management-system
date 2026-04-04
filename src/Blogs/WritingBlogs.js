import { useState, useRef, useEffect } from "react";
import Navbar from "../layout/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import PostNavbar from "../layout/PostNavbar";
export default function BlogPage() {
  const username = localStorage.getItem("username");
  const [post, setPost] = useState({
    genre: "",
    postBody: "",
    postTitle: "",
    writerUsername: username || "",
  });

  const { genre, postBody, postTitle, writerUsername } = post;
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
  // keep editor's innerHTML in sync with state (useful if you programmatically set content)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== postBody) {
      editorRef.current.innerHTML = postBody;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postBody]);

  var errorMessage = "";

  if (!genre || !postTitle || !postBody) {
    errorMessage = "All fields are required to submit a blog.";
  }
  const onInputChange = (e) => {
    e.preventDefault();
    setPost({ ...post, [e.target.id]: e.target.value });
  };

  if (postBody && postBody.replace(/<[^>]+>/g, "").trim().length < 200) {
    errorMessage = "* Article content must be at least 200 characters long";
  } else if (
    postBody &&
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(postBody)
  ) {
    errorMessage =
      "Article content contains disallowed scripts. Please remove any <script> tags";
  } else if (postTitle && postTitle.length < 5) {
    errorMessage = "Title must be at least 5 characters long";
  } else if (
    postTitle &&
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(postTitle)
  ) {
    errorMessage =
      "Title contains disallowed scripts. Please remove any <script> tags";
  }
  // helper to ensure selection is inside editor
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
  const navigate = useNavigate();
  // Keep state updated while user types or pastes
  const handleInput = () => {
    const html = editorRef.current ? editorRef.current.innerHTML : "";
    setPost((prev) => ({ ...prev, postBody: html }));
  };

  const handleGoBack = () => {
    window.history.back();
  };
  const onBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!errorMessage) {
        await axios.post("http://localhost:8080/UVB/blogs/writeBlogs", post, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Content submitted successfully");
        navigate("/viewBlogs");
      } else {
        alert("All the fields are required.");
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Failed to submit blog. Please try again.");
    }
  };

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const categoryOptions = [
    { label: "Select an option", value: "" },
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
  useEffect(() => {
    // Update the time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar />
      <PostNavbar />
      <div className="container">
        <h1 className="fs-2 mt-3" style={{ fontFamily: "monospace" }}>
          Write Your Blogs
        </h1>
      </div>
      <form onSubmit={(e) => onBlogSubmit(e)}>
        <span
          className="fs-6"
          style={{
            fontFamily: "cursive",
            textAlign: "right",
            marginLeft: "75%",
          }}
        >
          {currentDateTime.toLocaleDateString()} -{" "}
          {currentDateTime.toLocaleTimeString()}
        </span>
        <h5
          className="row mt-5"
          style={{ left: "46%", top: "25%", position: "absolute" }}
        >
          Author:
        </h5>
        <p
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            fontSize: "18px",
            fontFamily: "monospace",
            marginLeft: "5%",
          }}
        >
          "{username}"
        </p>
        <div style={{ display: "flex" }}>
          <h5 className="row" style={{ marginLeft: "10%", marginTop: "3%" }}>
            Article Genre:
          </h5>
          <select
            id="genre"
            className="row p-2 border rounded shadow"
            placeholder="Article Genre"
            value={genre}
            required
            onChange={(e) => onInputChange(e)}
            style={{
              height: "40px",
              marginLeft: "3%",
              marginTop: "3%",
              width: "300px",
              textAlign: "center",
              fontSize: "18px",
              backgroundColor: "lightblue",
              fontFamily: "Times New Roman",
            }}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <h4 className="row" style={{ marginLeft: "10%", marginTop: "3%" }}>
            Title:
          </h4>
          <input
            type="text"
            id="postTitle"
            className="row p-2 border rounded shadow"
            placeholder="Title"
            value={postTitle}
            required
            onChange={(e) => onInputChange(e)}
            style={{
              height: "40px",
              marginTop: "3%",
              marginLeft: "3%",
              width: "600px",
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "Times New Roman",
              backgroundColor: "lightblue",
            }}
          />
        </div>
        <h3 className="row mt-5" style={{ marginLeft: "10%" }}>
          Article:
        </h3>
        <div
          ref={editorRef}
          contentEditable={true}
          className="col-md-7 offset-md-3 border rounded p-3 shadow"
          id="postBody"
          value={postBody}
          role="textbox"
          required
          minLength={200}
          aria-multiline="true"
          aria-label="Blog content editor"
          onInput={handleInput}
          onChange={(e) => onInputChange(e)}
          style={{
            minHeight: "200px",
            width: "85%",
            marginLeft: "8%",
            outline: "none",
            textAlign: "justify",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
        />
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
              marginLeft:"59%"
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
        
        <p
          style={{
            color: "red",
            fontFamily: "monospace",
            fontWeight: "bold",
            textAlign: "left",
            marginLeft: "10%",
            marginTop: "-2%",
          }}
        >
          {errorMessage}
        </p>
        <div
          className="mt-2 fs-4 pb-2"
          style={{
            fontFamily: "cursive",
            textDecoration: "underline",
            marginLeft: "5%",
          }}
        >
          Preview
        </div>
        <div
          className="p-2 border rounded row"
          style={{
            whiteSpace: "break-spaces",
            textAlign: "left",
            marginLeft: "8%",
            width: "85%",
            backgroundColor: "lightslategray",
          }}
        >
          <h5
            className="shadow p-3"
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              fontFamily: "monospace",
              textAlign: "center",
              backgroundColor: "lightblue",
            }}
          >
            {postTitle}
          </h5>
          <div
            style={{
              fontSize: "18px",
              color: "whitesmoke",
              fontFamily: "Times New Roman",
              fontWeight: "light",
            }}
            // sanitize to avoid XSS; DOMPurify is recommended
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(postBody || ""),
            }}
          />
        </div>
        <p
          style={{
            fontWeight: "bold",
            marginLeft: "70%",
            fontSize: "16px",
            fontFamily: "monospace",
            textAlign: "center",
          }}
        >
          {genre}
          <br />@{writerUsername}
        </p>
        <button
          type="submit"
          className="btn btn-outline-primary m-3"
          style={{ width: "100px" }}
        >
          Submit
        </button>
      </form>
      <button
        className="btn btn-outline-secondary m-2 px-4"
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
}
