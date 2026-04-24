import { useEffect, useState } from "react";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import axios from "axios";
import { useAuth } from "../AuthContext";

const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/comments/${blogId}`,
    );
    const data = await res.json();
    setComments(data);
  };

  const addComment = async (content, parentId = null) => {
    const query = new URLSearchParams({
      userId: user._id,
      postId: blogId,
      content,
      parentId: parentId || "",
    }).toString();

    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/comments?${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const newComment = await res.json();
    setComments([newComment, ...comments]);
  };

  const deleteComment = async (id) => {
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/UVB/blogs/comments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    setComments(comments.filter((c) => c._id !== id));
  };

  return (
    <div>
      <h3>Comments</h3>
      <CommentForm onSubmit={addComment} />
      <CommentList comments={comments} onReply={addComment} />
    </div>
  );
};

export default CommentSection;
