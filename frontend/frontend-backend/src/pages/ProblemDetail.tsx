import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../pages/UserContext";
import CommentSection from "@/components/CommentSection";

// Helper function to convert text with newlines to JSX with line breaks
const TextWithLineBreaks = ({ text }: { text: string }) => {
  if (!text) return null;
  
  return (
    <>
      {text.split('\n').map((line, index) => (
        <span key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </span>
      ))}
    </>
  );
};

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [comments, setComments] = useState<any[]>([]);

  const mapCommentsFromBackend = (backendComments: any[]) => {
    return (backendComments || []).map((c: any) => ({
      id: c.commentId,
      author: c.name || "Anonymous",
      avatar: `https://ui-avatars.com/api/?name=${c.name || "A"}`,
      content: c.text || c.comment || "",
      timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString() : "",
      likes: Array.isArray(c.likedBy) ? c.likedBy.length : 0,
      isLiked: Array.isArray(c.likedBy) ? c.likedBy.includes(user?.email) : false,
      replies: Array.isArray(c.replies)
        ? c.replies.map((r: any) => ({
            id: r.replyId,
            author: r.name || "Anonymous",
            avatar: `https://ui-avatars.com/api/?name=${r.name || "A"}`,
            content: r.reply || r.text || "",
            timestamp: r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
            likes: Array.isArray(r.likedBy) ? r.likedBy.length : 0,
            isLiked: Array.isArray(r.likedBy) ? r.likedBy.includes(user?.email) : false,
            replies: [],
          }))
        : [],
    }));
  };

  // Scroll to top when component mounts
  useEffect(() => {
    // Scroll to top when viewing problem details
    window.scrollTo(0, 0);
  }, []);
  
  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${id}`
        );
        setProblem(res.data);

        const commentsRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${res.data.problemId}/comments`
        );

        setComments(mapCommentsFromBackend(commentsRes.data.comments || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblem();
  }, [id, user?.email]);

  if (loading) {
    return <div className="min-h-screen pt-24 px-4 flex items-center justify-center">Loading...</div>;
  }

  if (!problem) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vj-primary mb-4">Problem Not Found</h1>
          <Link to={`/problems#problem-${id}`}>
            <Button>Back to Problems</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddComment = async (content: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}/comment`,
        {
          comment: content,
          name: user?.name || "Anonymous",
          email: user?.email || "anonymous@example.com",
        }
      );
      setComments(mapCommentsFromBackend(res.data.comments || []));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleLikeComment = async (commentId: string, replyId?: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}/comment/${commentId}/like`,
        { email: user?.email, replyId: replyId || null }
      );
      setComments(mapCommentsFromBackend(res.data.comments || []));
    } catch (err) {
      console.error("Error liking comment/reply:", err);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}/comment/${commentId}/reply`,
        {
          reply: content,
          name: user?.name || "Anonymous",
          email: user?.email || "anonymous@example.com",
        }
      );

      setComments(mapCommentsFromBackend(res.data.comments || []));
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to={`/problems#problem-${problem.problemId}`}
            className="inline-flex items-center text-vj-muted hover:text-vj-primary transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Problems
          </Link>
          
          {/* Right-aligned buttons */}
          {user?.email === problem.addedByEmail && (
            <div className="flex gap-2">
              <Link to={`/update-problem/${problem.problemId}`} state={{ problem }}>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                >
                  Update
                </Button>
              </Link>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  try {
                    await axios.delete(
                      `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}`,
                      {
                        data: { email: user?.email }
                      }
                    );
                    // Navigate back to problems page after deletion
                    window.location.href = '/problems'; // No specific card to scroll to after deletion
                  } catch (err) {
                    console.error("Error deleting problem:", err);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Changed from grid to a single div with max width */}
        <div className="mx-auto space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {problem.tags?.map((tag: string) => <Badge key={tag} variant="outline">{tag}</Badge>)}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-vj-primary mb-4 font-playfair">{problem.title}</h1>

          <div className="flex items-center gap-6 text-sm text-vj-muted mb-6">
            <span>Posted by {problem.addedByName}</span>
            <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
            <div className="flex items-center gap-1">
              <MessageCircle size={16} />
              <span>{comments.length} comments</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UpvoteButton
              upvotes={problem.upvotes || 0}
              hasUpvoted={problem.upvotedBy?.includes(user?.email || "")}
              onClick={async () => {
                try {
                  const res = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problem.problemId}/upvote`,
                    { email: user?.email }
                  );
                  setProblem(res.data);
                } catch (err) {
                  console.error("Error upvoting problem:", err);
                }
              }}
            />
            <p className="text-lg text-vj-muted leading-relaxed">
              <TextWithLineBreaks text={problem.briefparagraph || ""} />
            </p>
          </div>

          {problem.image && (
            <div className="rounded-xl h-64 mb-8 overflow-hidden">
              <img src={problem.image} alt={problem.title} className="w-full h-full object-cover" />
            </div>
          )}


          
          
          <div className="space-y-8">
            {problem.targetCustomers && <section>
              <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>
                Target Customer(s)
              </h2>
              <div className="prose prose-gray max-w-none">
                <TextWithLineBreaks text={problem.targetCustomers || "Not specified."} />
              </div>
            </section>}

            {problem.description && <section>
              <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>Problem Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <TextWithLineBreaks text={problem.description || ""} />
              </div>
            </section>}

            {problem.background && <section>
              <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>Background
              </h2>
              <div className="prose prose-gray max-w-none">
                <TextWithLineBreaks text={problem.background || ""} />
              </div>
            </section>}

            {problem.scalability && <section>
              <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>Scalability
              </h2>
              <div className="prose prose-gray max-w-none">
                <TextWithLineBreaks text={problem.scalability || ""} />
              </div>
            </section>}

            {problem.marketSize && <section>
              <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                <TrendingUp className="text-vj-accent mr-3" size={20} />
                Market Size & Stats
              </h2>
              <div className="prose prose-gray max-w-none">
                <TextWithLineBreaks text={problem.marketSize || "Not available."} />
              </div>
            </section>}

            {problem.existingSolutions && <section>
              <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>Existing Solutions / Competitors
              </h2>
              <div className="prose prose-gray max-w-none">
                <TextWithLineBreaks text={problem.existingSolutions || "No competitors listed."} />
              </div>
            </section>}

            {problem.currentGaps && <section>
              <h2 className="text-2xl font-semibold text-vj-primary mb-4 flex items-center">
                <div className="w-1 h-6 bg-vj-accent rounded-full mr-3"></div>Current Gaps
              </h2>
              <div className="prose prose-gray max-w-none">
                <TextWithLineBreaks text={problem.currentGaps || "No gaps specified."} />
              </div>
            </section>}
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReply={handleReply}
        />
      </div>
    </div>
  );
};

export default ProblemDetail;
