import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, MessageCircle, Share2, Bookmark, Eye, Download, Award, TrendingUp, Target, Building, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import CommentSection from "@/components/CommentSection";
import { mockStartups, stageLabels, mockComments } from "@/data/mockData";
import studyspaceImage from "@/assets/studyspace-startup.jpg";
import ecotrackImage from "@/assets/ecotrack-startup.jpg";

const imageMap: Record<string, string> = {
  "1": studyspaceImage,
  "2": ecotrackImage,
};

export default function StartupDetail() {
  const { id } = useParams();
  const startup = mockStartups.find(s => s.id === id);
  const [comments, setComments] = useState(mockComments);

  if (!startup) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vj-primary mb-4">Startup Not Found</h1>
          <Link to="/startups">
            <Button>Back to Startups</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddComment = (content: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: "Current User",
      avatar: "/api/placeholder/32/32",
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };
    setComments([...comments, newComment]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  const handleReply = (commentId: string, content: string) => {
    const newReply = {
      id: `${commentId}-${Date.now()}`,
      author: "Current User",
      avatar: "/api/placeholder/32/32",
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };
    
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, replies: [...(comment.replies || []), newReply] }
        : comment
    ));
  };

  const startupImage = imageMap[startup.id] || "/api/placeholder/800/400";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/startups" className="inline-flex items-center text-vj-muted hover:text-startup-primary transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Startups
          </Link>
        </div>

        {/* Startup Header */}
        <div className="vj-card-startup mb-8">
          {/* Startup Image */}
          <div className="aspect-video relative overflow-hidden rounded-vj-large mb-6">
            <img 
              src={startupImage}
              alt={startup.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                <span className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-medium">🚀 Startup</span>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <StatusBadge stage={startup.stage} />
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-playfair">
                    {startup.name}
                  </h1>
                  <p className="text-white/90 text-lg">
                    Stage {startup.stage}: {stageLabels[startup.stage - 1]}
                  </p>
                </div>
                <UpvoteButton 
                  upvotes={startup.upvotes}
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
                <span>156 views</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>12 comments</span>
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

          {/* Funding Status */}
          <div className="p-4 bg-startup-light rounded-lg border border-startup-primary/20 mb-6">
            <h3 className="font-semibold mb-2 flex items-center text-startup-primary">
              💰 Funding Status
            </h3>
            <p className="text-vj-primary font-medium">{startup.fundingStatus}</p>
          </div>

          {/* Startup Description */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-vj-primary mb-4">Company Overview</h2>
            <p className="text-vj-muted leading-relaxed mb-6">
              {startup.description}
            </p>
          </div>
        </div>

        {/* Detailed Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Details */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Building className="text-startup-primary" />
                Business Model
              </h3>
              <div className="space-y-4 text-vj-muted">
                <p>
                  {startup.id === "1" ? 
                    "StudySpace revolutionizes how students access and utilize study spaces through AI-powered room booking and collaborative learning features. Our platform eliminates the frustration of finding available study rooms by providing real-time availability, smart scheduling, and personalized recommendations." :
                    "EcoTrack Campus provides comprehensive sustainability tracking and carbon footprint reduction tools specifically designed for college campuses. Our platform helps institutions monitor energy consumption, waste management, and overall environmental impact."
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-startup-primary mb-2">Key Features</h4>
                    <ul className="text-sm space-y-1">
                      {startup.id === "1" ? (
                        <>
                          <li>• AI-powered room recommendations</li>
                          <li>• Real-time availability tracking</li>
                          <li>• Group study matching</li>
                          <li>• Study session analytics</li>
                        </>
                      ) : (
                        <>
                          <li>• Carbon footprint tracking</li>
                          <li>• Energy consumption monitoring</li>
                          <li>• Waste management analytics</li>
                          <li>• Student engagement features</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-startup-primary mb-2">Technology</h4>
                    <ul className="text-sm space-y-1">
                      {startup.id === "1" ? (
                        <>
                          <li>• React Native mobile app</li>
                          <li>• Machine learning algorithms</li>
                          <li>• IoT sensor integration</li>
                          <li>• Cloud infrastructure</li>
                        </>
                      ) : (
                        <>
                          <li>• IoT environmental sensors</li>
                          <li>• Data analytics platform</li>
                          <li>• Mobile and web apps</li>
                          <li>• API integrations</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <TrendingUp className="text-startup-primary" />
                Market Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-startup-light rounded-lg border border-startup-primary/20">
                  <p className="text-2xl font-bold text-startup-primary">
                    {startup.id === "1" ? "$1.2B" : "$800M"}
                  </p>
                  <p className="text-sm text-vj-muted">Market Size</p>
                </div>
                <div className="text-center p-4 bg-startup-light rounded-lg border border-startup-primary/20">
                  <p className="text-2xl font-bold text-startup-primary">
                    {startup.id === "1" ? "15%" : "22%"}
                  </p>
                  <p className="text-sm text-vj-muted">Annual Growth</p>
                </div>
                <div className="text-center p-4 bg-startup-light rounded-lg border border-startup-primary/20">
                  <p className="text-2xl font-bold text-startup-primary">
                    {startup.id === "1" ? "2.5M" : "1.8M"}
                  </p>
                  <p className="text-sm text-vj-muted">Target Users</p>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Target className="text-startup-primary" />
                Milestones & Progress
              </h3>
              <div className="space-y-4">
                {startup.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${milestone.completed ? 'bg-startup-primary' : 'bg-startup-muted/30'}`}>
                      <CheckCircle className={`h-4 w-4 ${milestone.completed ? 'text-white' : 'text-startup-muted'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${milestone.completed ? 'text-vj-primary' : 'text-vj-muted'}`}>
                        {milestone.title}
                      </p>
                      <p className="text-sm text-startup-muted flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {milestone.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Users className="text-startup-primary" />
                Leadership Team
              </h3>
              <div className="space-y-4">
                {startup.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-startup-primary/20 text-startup-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-vj-primary">{member.name}</p>
                      <p className="text-sm text-startup-muted">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding & Schemes */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4 flex items-center gap-2">
                <Award className="text-startup-primary" />
                Support & Recognition
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-startup-primary mb-2">Programs</h4>
                  <div className="flex flex-wrap gap-2">
                    {startup.schemes.map((scheme, index) => (
                      <Badge key={index} variant="outline" className="border-startup-primary/30 text-startup-primary text-xs">
                        {scheme}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="vj-card-startup bg-startup-light/50">
              <h3 className="font-semibold mb-2 text-startup-primary">Interested in {startup.name}?</h3>
              <p className="text-sm text-vj-muted mb-4">
                Connect for partnerships, investment opportunities, or collaboration.
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-startup-primary hover:bg-startup-primary/90 text-white">
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full border-startup-primary/30 text-startup-primary hover:bg-startup-light">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                {startup.onePager && (
                  <Button variant="outline" className="w-full border-startup-primary/30 text-startup-primary hover:bg-startup-light">
                    <Download className="mr-2 h-4 w-4" />
                    Download Pitch Deck
                  </Button>
                )}
              </div>
            </div>

            {/* Company Stats */}
            <div className="vj-card-startup">
              <h3 className="text-lg font-semibold text-vj-primary mb-4">Company Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-vj-muted">Community Support</span>
                  <span className="font-medium text-startup-primary">{startup.upvotes} upvotes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Development Stage</span>
                  <span className="font-medium text-startup-primary">{Math.round((startup.stage / 9) * 100)}% complete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Team Size</span>
                  <span className="font-medium text-startup-primary">{startup.team.length} members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vj-muted">Milestones Achieved</span>
                  <span className="font-medium text-startup-primary">
                    {startup.milestones.filter(m => m.completed).length}/{startup.milestones.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReply={handleReply}
        />
      </div>
    </div>
  );
}