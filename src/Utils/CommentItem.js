import { useState } from "react";

const CommentItem = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  return (
    <div style={{ marginLeft: comment.parentId ? "20px" : "0px" }}>
      <p>
        <strong>{comment.user.fullName}</strong>
      </p>
      <p>{comment.content}</p>

      <button onClick={() => setShowReply(!showReply)}>Reply</button>

      {showReply && (
        <div>
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button
            onClick={() => {
              onReply(replyText, comment._id);
              setReplyText("");
              setShowReply(false);
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
