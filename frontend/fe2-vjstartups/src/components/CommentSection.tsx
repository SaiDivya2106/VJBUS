import { useState } from "react";
import { Send, Reply, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string, replyId?: string) => void;
  onReply: (commentId: string, content: string) => void;
}

const CommentSection = ({ comments, onAddComment, onLikeComment, onReply }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleSubmitReply = (commentId: string) => {
    const content = replyInputs[commentId]?.trim();
    if (content) {
      onReply(commentId, content);
      setReplyInputs(prev => ({ ...prev, [commentId]: "" }));
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    // Safe guard against invalid comment objects
    if (!comment || typeof comment !== 'object') {
      console.error("Invalid comment object:", comment);
      return null;
    }
    
    // Ensure we have a valid comment object with string properties
    const safeComment = {
      ...comment,
      id: comment.id || `temp-${Math.random().toString(36).substring(7)}`,
      author: typeof comment.author === 'string' ? comment.author : 'Anonymous',
      content: typeof comment.content === 'string' ? comment.content : '',
      timestamp: typeof comment.timestamp === 'string' ? comment.timestamp : new Date().toLocaleString(),
      likes: typeof comment.likes === 'number' ? comment.likes : 0,
      isLiked: !!comment.isLiked,
      replies: Array.isArray(comment.replies) ? comment.replies : []
    };
    
    return (
      <div key={safeComment.id} className={`${isReply ? 'ml-12' : ''} mb-6`}>
        <div className="flex items-start gap-3">
          <Avatar className={isReply ? "w-5 h-5" : "w-8 h-8"}>
            <AvatarImage src={safeComment.avatar || ""} />
            <AvatarFallback>
              {safeComment.author && typeof safeComment.author === 'string' && safeComment.author.length > 0 
                ? safeComment.author[0] 
                : 'A'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-vj-primary">{safeComment.author}</span>
              <span className="text-xs text-vj-muted">{safeComment.timestamp}</span>
            </div>

            <p className="text-sm text-vj-primary leading-relaxed mb-3">{safeComment.content}</p>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLikeComment(safeComment.id)}
                className={`h-8 px-2 text-xs ${safeComment.isLiked ? 'text-red-500' : 'text-vj-muted'}`}
              >
                {/* Like */}
                Like {safeComment.likes > 0 && `(${safeComment.likes})`}
              </Button>

              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyInputs(prev => ({ ...prev, [safeComment.id]: prev[safeComment.id] || "" }))}
                  className="h-8 px-2 text-xs text-vj-muted"
                >
                  <Reply size={14} /><span className="ml-1">Reply</span>
                </Button>
              )}
            </div>

            {/* Reply Form */}
            {replyInputs.hasOwnProperty(safeComment.id) && (
              <div className="mt-4 p-3 bg-vj-neutral rounded-lg">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyInputs[safeComment.id]}
                  onChange={e => setReplyInputs(prev => ({ ...prev, [safeComment.id]: e.target.value }))}
                  className="min-h-[80px] mb-2"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSubmitReply(safeComment.id)}>Reply</Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyInputs(prev => {
                      const copy = { ...prev };
                      delete copy[safeComment.id];
                      return copy;
                    })}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Nested Replies - ensure we safely handle each reply */}
            {safeComment.replies && Array.isArray(safeComment.replies) && 
              safeComment.replies.map(reply => renderComment(reply, true))}
          </div>
        </div>
      </div>
    );
  };

  // Ensure comments is always an array
  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <div className="bg-vj-surface rounded-vj-large p-6 border border-vj-border">
      <h3 className="text-lg font-semibold text-vj-primary mb-6">Comments ({safeComments.length})</h3>

      <div className="mb-8">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="min-h-[100px] mb-3"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <Send size={16} className="mr-2" />
            Post Comment
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {safeComments.length === 0 ? (
          <div className="text-center py-8 text-vj-muted">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          safeComments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
