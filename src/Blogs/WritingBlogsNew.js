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
        }
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
    { label: "Space Exploration Missions", value: "Space Exploration Missions" },
    { label: "Rocket Science Basics", value: "Rocket Science Basics" },
    { label: "Satellites and Communication", value: "Satellites and Communication" },
    { label: "Astronomy and Astrophysics", value: "Astronomy and Astrophysics" },
    { label: "Space Agencies", value: "Space Agencies" },
  ];

  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar />
      <PostNavbar />

      <div className="container">
        <h1 className="fs-2 mt-3">Write Your Blog</h1>
      </div>

      <form onSubmit={onBlogSubmit}>
        {/* Time */}
        <span style={{ marginLeft: "75%" }}>
          {currentDateTime.toLocaleDateString()} -{" "}
          {currentDateTime.toLocaleTimeString()}
        </span>

        {/* Author */}
        <p><b>{username}</b></p>

        {/* Genre + Title */}
        <div style={{ display: "flex" }}>
          <select id="genre" value={genre} onChange={onInputChange}>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            id="postTitle"
            value={postTitle}
            onChange={onInputChange}
            placeholder="Title"
          />
        </div>

        {/* 🚀 Toolbar */}
        {editor && (
          <div style={{ margin: "10px" }}>
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
              B
            </button>

            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
              I
            </button>

            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}>
              U
            </button>

            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
              •
            </button>

            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              1.
            </button>

            <button type="button" onClick={() => editor.chain().focus().toggleHighlight({ color: "yellow" }).run()}>
              🟡
            </button>

            <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
              Center
            </button>

            <button type="button" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
              Justify
            </button>
          </div>
        )}

        {/* 🚀 Editor */}
        <EditorContent
          editor={editor}
          style={{
            minHeight: "200px",
            border: "1px solid gray",
            padding: "10px",
            margin: "20px",
          }}
        />

        {/* Word Count */}
        <p style={{ color: wordCount >= 1000 ? "green" : "red" }}>
          Word Count: {wordCount}
        </p>

        {/* Error */}
        <p style={{ color: "red" }}>{errorMessage}</p>

        {/* Preview */}
        <h4>Preview</h4>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(postBody),
          }}
        />

        {/* Footer */}
        <p>
          {genre} <br /> @{writerUsername}
        </p>

        <button type="submit">Submit</button>
      </form>

      <button onClick={handleGoBack}>🔙</button>
    </div>
  );
}