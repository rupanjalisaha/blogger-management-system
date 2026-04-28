import { useState, useEffect } from "react";
import Navbar from "../layout/Navbar";
import PostNavbar from "../layout/PostNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

// ✅ TipTap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

export default function BlogPage() {
  const username = localStorage.getItem("username");

  const [post, setPost] = useState({
    genre: "",
    postBody: "",
    postTitle: "",
    writerUsername: username || "",
  });

  const { genre, postBody, postTitle, writerUsername } = post;

  const navigate = useNavigate();

  // 🚀 TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setPost((prev) => ({
        ...prev,
        postBody: editor.getHTML(),
      }));
    },
  });

  // 🧠 Word Count
  const countWords = (html) => {
    if (!html) return 0;
    const text = html.replace(/<[^>]+>/g, "").trim();
    return text.split(/\s+/).filter(Boolean).length;
  };

  const wordCount = countWords(postBody);

  // ⚠️ Validation
  let errorMessage = "";
  if (!genre || !postTitle || !postBody) {
    errorMessage = "All fields are required.";
  } else if (wordCount < 1000) {
    errorMessage = "Minimum 1000 words required.";
  } else if (wordCount > 5000) {
    errorMessage = "Maximum 5000 words allowed.";
  }

  // 📤 Submit
  const onBlogSubmit = async (e) => {
    e.preventDefault();

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/writeBlogs`,
        post,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Submitted successfully");
      navigate("/viewBlogs");
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  const onInputChange = (e) => {
    setPost({ ...post, [e.target.id]: e.target.value });
  };

  const handleGoBack = () => window.history.back();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const categoryOptions = [
    { label: "Select an option", value: "" },
    {
      label: "Space Exploration Missions",
      value: "Space Exploration Missions",
    },
    { label: "Rocket Science Basics", value: "Rocket Science Basics" },
    {
      label: "Satellites and Communication",
      value: "Satellites and Communication",
    },
    {
      label: "Astronomy and Astrophysics",
      value: "Astronomy and Astrophysics",
    },
    { label: "Space Agencies", value: "Space Agencies" },
  ];

  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar />
      <PostNavbar />

      <div className="container">
        <h1 className="fs-2 mt-3" style={{ fontFamily: "monospace" }}>
          Write Your Blogs
        </h1>
      </div>

      <form onSubmit={onBlogSubmit}>
        {/* Time */}
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

        <p>
          <b>{username}</b>
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
              fontSize: "16px",
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
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "Times New Roman",
              backgroundColor: "lightblue",
            }}
          />
        </div>

        {/* 🚀 Toolbar */}
        {editor && (
          <div style={{ margin: "10px" }}>
            <button
              type="button"
              className="btn p-1 btn-outline-primary"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              B
            </button>

            <button
              type="button"
              className="btn p-1 btn-outline-primary"
              style={{marginLeft: "2px"}}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              I
            </button>

            <button
              type="button"
              className="btn p-1 btn-outline-primary"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              U
            </button>

            <button
              type="button"
              className="btn p-1 btn-outline-primary"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              •
            </button>

            <button
              type="button"
              className="btn p-1 btn-outline-primary"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              1.
            </button>

            <button
              type="button"
              className="btn p-1 btn-outline-primary"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: "yellow" })
                  .run()
              }
            >
              🟡
            </button>
            <button
              type="button"
              className="btn p-1 btn-outline-primary"
              onClick={() =>
                editor.chain().focus().toggleHighlight({ color: "red" }).run()
              }
            >
              🟥
            </button>
            <button
              type="button"
              className="btn p-1 btn-outline-primary"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              Center
            </button>

            <button
              type="button"
              className="btn p-1 btn-outline-primary"
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
            >
              Justify
            </button>
          </div>
        )}

        <h3 className="row mt-5" style={{ marginLeft: "10%" }}>
          Article:
        </h3>
        {/* 🚀 Editor */}
        <EditorContent
          editor={editor}
          id="postBody"
          value={postBody}
          role="textbox"
          aria-multiline="true"
          className="col-md-7 offset-md-3 border rounded p-3 shadow"
          minLength={1000}
          maxLength={5000}
          required
          aria-label="Blog content editor"
          style={{
            minHeight: "200px",
            width: "85%",
            marginLeft: "20%",
            border: "1px solid gray",
            padding: "10px",
            margin: "20px",
          }}
        />

        {/* Word Count */}
        <p style={{ color: wordCount >= 1000 ? "green" : "red" }}>
          Word Count: {wordCount}
        </p>

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
              fontSize: "18px",
              fontFamily: "monospace",
              textAlign: "center",
              backgroundColor: "lightblue",
            }}
          >
            {postTitle}
          </h5>
          <div
            style={{
              fontSize: "16px",
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

        {/* Footer */}
        <p
          style={{
            fontWeight: "bold",
            marginLeft: "70%",
            fontSize: "14px",
            fontFamily: "monospace",
            textAlign: "center",
          }}
        >
          {genre} <br /> @{writerUsername}
        </p>

        <button
          type="submit"
          className="btn btn-outline-primary m-3"
          style={{ width: "100px" }}
        >
          ✔ Submit
        </button>
      </form>

      <button title="Back to previous page"
        className="btn btn-outline-secondary m-2 px-4" onClick={handleGoBack}>🔙</button>
    </div>
  );
}
