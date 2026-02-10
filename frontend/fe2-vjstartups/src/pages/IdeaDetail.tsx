import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, MessageCircle, Share2, Bookmark, Eye, Mail, Award, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import CommentSection from "@/components/CommentSection";
import { stageLabels } from "@/data/mockData";
import axios from "axios";
import { useUser } from "./UserContext";
import foodshareImage from "@/assets/foodshare-idea.jpg";
import mindbridge from "@/assets/mindbridge-idea.jpg";

const imageMap: Record<string, string> = {
  "1": foodshareImage,
  "2": mindbridge,
};

export default function IdeaDetail() {
  const { id } = useParams();
  const [idea, setIdea] = useState<any>(null);
  const [problem, setProblem] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  
  // Handle upvoting an idea
  const handleUpvote = async (ideaId: string) => {
    if (!user?.email) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/idea/${ideaId}/upvote`,
        { email: user.email }
      );

      // Update the idea in state
      setIdea(prev => ({
        ...prev,
        upvotes: res.data.upvotes,
        upvotedBy: res.data.upvotedBy
      }));
    } catch (err) {
      console.error("Error toggling upvote:", err);
    }
  };
  
  // Fetch idea details
  useEffect(() => {
    const fetchIdeaDetails = async () => {
      if (!id) return;
      
      try {
        const ideaResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}`);
        setIdea(ideaResponse.data);
        
        // Fetch related problem if available
        if (ideaResponse.data.problemId) {
          const problemResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${ideaResponse.data.problemId}`
          );
          setProblem(problemResponse.data);
        }
        
        // Fetch comments
        const commentsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/comments`
        );
        console.log("Comments data received:", commentsResponse.data);
        
        // Make sure we have a proper array of comment objects
        const safeComments = Array.isArray(commentsResponse.data) 
          ? commentsResponse.data.map(comment => typeof comment === 'object' ? {...comment} : {})
          : [];
          
        setComments(safeComments);
      } catch (error) {
        console.error("Error fetching idea details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIdeaDetails();
  }, [id]);

  if (!idea) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vj-primary mb-4">Idea Not Found</h1>
          <Link to="/ideas">
            <Button>Back to Ideas</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddComment = async (content: string) => {
    if (!user?.email || !id) return;
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/comments`,
        {
          author: user.name || user.email,
          content,
          email: user.email
        }
      );
      
      // Add the new comment to the list
      setComments([...comments, response.data]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user?.email || !id) return;
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/comments/${commentId}/like`,
        { email: user.email }
      );
      
      // Update the comment in the list - make sure we don't accidentally use the whole comment object directly
      setComments(comments.map(comment =>
        comment._id === commentId ? {...response.data} : comment
      ));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    if (!user?.email || !id) return;
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/${id}/comments/${commentId}/replies`,
        {
          author: user.name || user.email,
          content,
          email: user.email
        }
      );
      
      // Update the comment with the new reply - use a copy to avoid React rendering issues
      setComments(comments.map(comment =>
        comment._id === commentId ? {...response.data} : comment
      ));
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Safely determine which image to use
  const getIdeaImage = () => {
    if (idea?.titleImage) return idea.titleImage;
    if (idea?.ideaId && imageMap[idea.ideaId.substring(0, 1)]) return imageMap[idea.ideaId.substring(0, 1)];
    return "/placeholder.svg";
  };
  
  const ideaImage = getIdeaImage();
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-idea-primary/30 border-t-idea-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-vj-muted">Loading idea details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to={`/ideas#idea-${idea.ideaId}`} className="inline-flex items-center text-vj-muted hover:text-idea-primary transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Ideas
          </Link>
        </div>

        {/* Idea Header */}
        <div className="vj-card-idea mb-8">
          {/* Idea Image */}
          <div className="aspect-video relative overflow-hidden rounded-vj-large mb-6">
            <img 
              src={ideaImage}
              alt={idea.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-medium">Innovation Idea</span>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <StatusBadge stage={idea.stage} />
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-playfair">
                    {idea.title}
                  </h1>
                  <p className="text-white/90 text-lg">
                    Stage {idea.stage}: {stageLabels[idea.stage - 1]}
                  </p>
                </div>
                <UpvoteButton 
                  upvotes={idea.upvotes || 0} 
                  hasUpvoted={idea.upvotedBy?.includes(user?.email)}
                  onClick={() => handleUpvote(idea.ideaId)}
                  className="bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-sm text-vj-muted">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>89 views</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{comments?.length || 0} comments</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark size={16} className="mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Problem Link */}
          {problem && (
            <div className="p-4 bg-idea-light rounded-lg border border-idea-primary/20 mb-6">
              <h3 className="font-semibold mb-2 flex items-center text-idea-primary">
                <Target className="mr-2 h-4 w-4" />
                Addressing Problem
              </h3>
              <Link 
                to={`/problems/${problem.problemId}`}
                className="text-vj-primary hover:text-idea-primary transition-colors font-medium"
              >
                {problem.title}
              </Link>
            </div>
          )}

          {/* Idea Description */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-vj-primary mb-4">Solution Overview</h2>
            <p className="text-vj-muted leading-relaxed mb-6">
              {idea.description}
            </p>
          </div>
        </div>

        {/* Detailed Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Solution */}
            <div className="vj-card-idea">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Lightbulb className="text-idea-primary" />
                Detailed Solution
              </h3>
              <div className="space-y-4 text-vj-muted">
                <p>
                  {idea.detailedDescription || "This innovative solution addresses key challenges through technology and community engagement, creating sustainable impact for the target audience."}
                </p>
                <p>
                  {idea.features || "The platform includes multiple features designed to enhance user experience and maximize effectiveness across various use cases."}
                </p>
              </div>
            </div>

            {/* Market Opportunity */}
            <div className="vj-card-idea">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <TrendingUp className="text-idea-primary" />
                Market Opportunity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-idea-primary mb-2">Target Market</h4>
                  <p className="text-sm text-vj-muted">
                    {idea.targetMarket || "Educational institutions and student populations facing related challenges"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-idea-primary mb-2">Revenue Model</h4>
                  <p className="text-sm text-vj-muted">
                    {idea.revenueModel || "Subscription-based model with institutional partnerships and premium services"}
                  </p>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {idea.attachments && idea.attachments.length > 0 && (
              <div className="vj-card-idea">
                <h3 className="text-lg font-semibold text-vj-primary mb-4">Project Materials</h3>
                <div className="space-y-3">
                  {idea.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-idea-light rounded-lg border border-idea-primary/20">
                      <span className="font-medium text-idea-primary">{attachment}</span>
                      <Button size="sm" variant="outline" className="border-idea-primary/30 text-idea-primary hover:bg-idea-light">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            {idea.team && idea.team.length > 0 && (
              <div className="vj-card-idea">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <Users className="text-idea-primary" />
                  Team
                </h3>
                <div className="space-y-4">
                  {idea.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-idea-primary/20 text-idea-primary">
                          {member.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-vj-primary">{member.name}</p>
                        <p className="text-sm text-idea-muted dark:text-gray-300">{member.role || 'Team Member'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-idea-primary hover:bg-idea-primary/90 text-white">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Team
                </Button>
              </div>
            )}

            {/* Mentor */}
            {idea.mentor && (
              <div className="vj-card-idea">
                <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                  <Award className="text-idea-primary" />
                  Mentor
                </h3>
                <p className="font-medium text-vj-primary mb-3">{idea.mentor}</p>
                <Button variant="outline" size="sm" className="border-idea-primary/30 text-idea-primary hover:bg-idea-light">
                  Connect
                </Button>
              </div>
            )}

            {/* Engagement Stats */}
            <div className="vj-card-idea">
              <h3 className="text-lg font-semibold text-vj-primary mb-4">Community Engagement</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-vj-muted">Upvotes</span>
                  <span className="font-medium text-idea-primary">{idea.upvotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Comments</span>
                  <span className="font-medium text-idea-primary">{comments?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Stage Progress</span>
                  <span className="font-medium text-idea-primary">{idea.stage ? Math.round((idea.stage / 9) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection
          comments={(comments || []).map(comment => {
            // Ensure we're working with a proper object, not a raw MongoDB document
            const safeComment = typeof comment === 'object' ? comment : {};
            
            return {
              id: safeComment._id || `temp-${Math.random().toString(36).substring(7)}`,
              author: safeComment.author || "Anonymous",
              avatar: "",  // We don't have avatars in our API
              content: safeComment.content || "",
              timestamp: safeComment.createdAt ? new Date(safeComment.createdAt).toLocaleString() : new Date().toLocaleString(),
              likes: safeComment.likes?.length || 0,
              isLiked: safeComment.likes?.includes(user?.email) || false,
              replies: (safeComment.replies || []).map(reply => {
                // Also ensure each reply is properly formatted
                const safeReply = typeof reply === 'object' ? reply : {};
                
                return {
                  id: safeReply._id || `temp-reply-${Math.random().toString(36).substring(7)}`,
                  author: safeReply.author || "Anonymous",
                  avatar: "",
                  content: safeReply.content || "",
                  timestamp: safeReply.createdAt ? new Date(safeReply.createdAt).toLocaleString() : new Date().toLocaleString(),
                  likes: safeReply.likes?.length || 0,
                  isLiked: safeReply.likes?.includes(user?.email) || false
                };
              })
            };
          })}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReply={handleReply}
        />
      </div>
    </div>
  );
}