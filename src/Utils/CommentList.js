import CommentItem from "./CommentItem";

const CommentList = ({ comments, onReply }) => {
  return (
    <div>
      {comments.map(comment => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          onReply={onReply}
        />
      ))}
    </div>
  );
};

export default CommentList;