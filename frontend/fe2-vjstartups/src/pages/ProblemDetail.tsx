import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, TrendingUp, Users, Target, Lightbulb, BarChart3, Zap, AlertCircle, Calendar, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading problem details...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Card className="max-w-md mx-auto text-center bg-white dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="pt-6">
            <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Problem Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The problem you're looking for doesn't exist or has been removed.</p>
            <Link to={`/problems#problem-${id}`}>
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Problems
              </Button>
            </Link>
          </CardContent>
        </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section with Background */}
      <div className="relative pt-16 pb-8 px-4 bg-gradient-to-r from-green-600 via-green-700 to-blue-600 dark:from-green-700 dark:via-green-800 dark:to-blue-700 shadow-xl">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <Link 
              to={`/problems#problem-${problem.problemId}`}
              className="inline-flex items-center text-white hover:text-white/90 transition-all duration-300 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Problems
            </Link>
            
            {/* Right-aligned buttons */}
            {(user?.email === problem.addedByEmail || (problem.collaborators && problem.collaborators.includes(user?.email))) && (
              <div className="flex gap-2">
                <Link to={`/update-problem/${problem.problemId}`} state={{ problem }}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                  >
                    Update
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-500/80 hover:bg-red-600 backdrop-blur-sm"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this problem?")) {
                      try {
                        await axios.delete(
                          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${problem.problemId}`,
                          {
                            data: { email: user?.email }
                          }
                        );
                        alert("Problem deleted successfully!");
                        window.location.href = '/problems';
                      } catch (err: any) {
                        console.error("Error deleting problem:", err);
                        alert(err.response?.data?.message || "Failed to delete problem");
                      }
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
          
          {/* Hero Content */}
          <div className="text-white">
            <div className="flex flex-wrap gap-1.5 mb-3 animate-fade-in">
              {problem.tags?.map((tag: string) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm px-3 py-0.5 text-xs rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-playfair leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80 animate-fade-in-up">
              {problem.title}
            </h1>
            
            <div className="flex items-center justify-between gap-3 mb-4 animate-fade-in-up delay-100">
              <div className="flex flex-wrap items-center gap-2 text-white/90">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-300 text-sm">
                  <User size={14} className="text-green-300" />
                  <span>Posted by {problem.addedByName}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-300 text-sm">
                  <Calendar size={14} className="text-blue-300" />
                  <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-300 text-sm">
                  <MessageCircle size={14} className="text-purple-300" />
                  <span>{comments.length} comments</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-300 text-sm">
                  <Eye size={14} className="text-orange-300" />
                  <span>{problem.upvotes || 0} upvotes</span>
                </div>
              </div>
              
              <div className="transform hover:scale-105 transition-transform duration-300">
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
              </div>
            </div>
            
            <div className="animate-fade-in-up delay-200">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-white/10 to-white/5 dark:from-white/5 dark:to-transparent backdrop-blur-sm p-6 shadow-xl border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 dark:opacity-30"></div>
                <p className="text-xl text-white/95 leading-relaxed max-w-4xl font-light relative z-10">
                  <TextWithLineBreaks text={problem.briefparagraph || ""} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-4 py-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/50 to-gray-100/50 dark:via-gray-900/50 dark:to-gray-900/50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative">

          {/* Problem Image */}
          {problem.image && (
            <Card className="mb-6 overflow-hidden shadow-xl transform hover:scale-[1.01] transition-all duration-500 bg-transparent">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <img 
                  src={problem.image} 
                  alt={problem.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-out" 
                />
              </div>
            </Card>
          )}
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {problem.targetCustomers && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in-up">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg mr-3 animate-slide-in-left">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      Target Customer(s)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed">
                      <TextWithLineBreaks text={problem.targetCustomers || "Not specified."} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.description && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in-up delay-100">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-lg mr-3 animate-slide-in-left delay-100">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      Problem Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed">
                      <TextWithLineBreaks text={problem.description || ""} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.background && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in-up delay-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-lg mr-3 animate-slide-in-left delay-200">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed">
                      <TextWithLineBreaks text={problem.background || ""} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.currentGaps && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in-up delay-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg mr-3 animate-slide-in-left delay-300">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      Current Gaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed">
                      <TextWithLineBreaks text={problem.currentGaps || "No gaps specified."} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {problem.scalability && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-slide-in-right">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-lg mr-3 animate-fade-in">
                        <Zap className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      Scalability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <TextWithLineBreaks text={problem.scalability || ""} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.marketSize && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-slide-in-right delay-100">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-lg mr-3 animate-fade-in delay-100">
                        <BarChart3 className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      Market Size & Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <TextWithLineBreaks text={problem.marketSize || "Not available."} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {problem.existingSolutions && (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-slide-in-right delay-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-lg mr-3 animate-fade-in delay-200">
                        <TrendingUp className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      Existing Solutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <TextWithLineBreaks text={problem.existingSolutions || "No competitors listed."} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="mt-8 relative animate-fade-in-up delay-400">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 dark:to-gray-900/10 pointer-events-none backdrop-blur-sm rounded-lg"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-xl">
              <CommentSection
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onReply={handleReply}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
