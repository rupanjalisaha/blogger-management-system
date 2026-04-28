import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../layout/Navbar";
import DOMPurify from "dompurify"; // optional but recommended: npm install dompurify
import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

function EditBlog() {
  const [post, setPost] = useState({
    genre: "",
    postBody: "",
    postTitle: "",
    writerUsername: "",
  });
  const { genre, postBody, postTitle, writerUsername } = post;
  const [viewTextEditor, setViewTextEditor] = useState(false);
  let navigate = useNavigate();
  const { id } = useParams();

  
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
        
        editor && (
          <div style={{ margin: "10px", marginTop:"30px" }}>
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
        )
        }
              <button title="Submit" className="btn btn-outline-primary m-3" type="submit">
                ✔ Submit
              </button>
              <Link title="Cancel" className="btn btn-outline-danger" to="/viewBlogs">
                🗙 Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBlog;
