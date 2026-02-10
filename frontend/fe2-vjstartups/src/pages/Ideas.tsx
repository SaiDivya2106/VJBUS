import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import IdeaSubmissionForm from "@/components/IdeaSubmissionForm";
import axios from "axios";
import { useUser } from "./UserContext";

const Ideas = () => {
  const [searchParams] = useSearchParams();
  const problemFilter = searchParams.get("problem");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [sortBy, setSortBy] = useState("upvotes");
  const [showAllTags, setShowAllTags] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [relatedProblem, setRelatedProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  
  // Fetch ideas from backend
  useEffect(() => {
    const fetchIdeas = async () => {
      if (!user?.email) return;

      try {
        let endpoint = `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas`;
        
        // If filtering by problem, use the problem-specific endpoint
        if (problemFilter) {
          endpoint = `${import.meta.env.VITE_API_BASE_URL}/idea-api/ideas/problem/${problemFilter}`;
        }
        
        const res = await axios.get(endpoint);
        
        // Mark which ideas the current user has already liked
        const updatedIdeas = res.data.map((i: any) => ({
          ...i,
          likedByUser: i.upvotedBy.includes(user.email)
        }));
        
        setIdeas(updatedIdeas);
      } catch (err) {
        console.error("Error fetching ideas:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIdeas();
  }, [user?.email, problemFilter]);
  
  // Fetch problem details if filtering by problem
  useEffect(() => {
    const fetchProblemDetails = async () => {
      if (!problemFilter) {
        setRelatedProblem(null);
        return;
      }
      
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${problemFilter}`
        );
        setRelatedProblem(res.data);
      } catch (err) {
        console.error("Error fetching problem details:", err);
      }
    };
    
    fetchProblemDetails();
  }, [problemFilter]);
  
  // Handle scroll position when navigating from idea detail page
  useEffect(() => {
    if (ideas.length > 0) {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#idea-')) {
        const ideaId = hash.replace('#idea-', '');
        
        setTimeout(() => {
          const ideaCard = document.getElementById(`idea-${ideaId}`);
          if (ideaCard) {
            // First scroll to ensure the element is in the DOM view
            ideaCard.scrollIntoView({ behavior: 'auto' });
            
            // Then calculate and set the final scroll position with header offset
            const cardPosition = ideaCard.getBoundingClientRect().top;
            const scrollPosition = window.pageYOffset + cardPosition - 120; // 120px offset for header
            window.scrollTo({
              top: scrollPosition,
              behavior: 'auto'
            });
            
            // Add a highlight effect
            ideaCard.classList.add('ring-2', 'ring-idea-primary');
            setTimeout(() => {
              ideaCard.classList.remove('ring-2', 'ring-idea-primary');
            }, 2000);
          }
        }, 500);
      }
    }
  }, [ideas.length]);
  
  // Handle upvoting an idea
  const handleUpvote = async (ideaId: string) => {
    if (!user?.email) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/idea/${ideaId}/upvote`,
        { email: user.email }
      );

      // Update the idea in state dynamically
      setIdeas(prev =>
        prev.map(idea =>
          idea.ideaId === ideaId
            ? {
                ...idea,
                upvotes: res.data.upvotes,
                likedByUser: res.data.upvotedBy.includes(user.email)
              }
            : idea
        )
      );
    } catch (err) {
      console.error("Error toggling upvote:", err);
    }
  };
  
  // Get all tags with counts from ideas
  const getTagsWithCounts = (ideas: any[]) => {
    // Count occurrences of each tag
    const tagCounts: Record<string, number> = {};
    ideas.forEach(idea => {
      if (!idea.tags) return;
      
      idea.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA);
  };
  
  // Get tags with counts
  const tagsWithCounts = getTagsWithCounts(ideas);
  
  // Filter and sort ideas
  const filteredIdeas = ideas
    .filter(idea => 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (idea.description && idea.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(idea => 
      !stageFilter || (idea.stage && idea.stage.toString() === stageFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "upvotes":
          return b.upvotes - a.upvotes;
        case "stage":
          return (b.stage || 1) - (a.stage || 1);
        case "comments":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
              {problemFilter && relatedProblem ? `Ideas for: ${relatedProblem.title}` : "Innovative Ideas"}
            </h1>
            <p className="text-xl text-vj-muted max-w-3xl mx-auto">
              {problemFilter 
                ? "Student teams working on solutions for this specific problem"
                : "Discover innovative solutions being developed by student entrepreneurs across all problem areas"
              }
            </p>
          </div>
          <div className="hidden lg:block">
            <IdeaSubmissionForm />
          </div>
        </div>
        
        {/* Mobile Submit Button */}
        <div className="lg:hidden flex justify-center mb-8">
          <IdeaSubmissionForm />
        </div>
        
        {/* Filters & Search */}
        <div className="bg-vj-neutral rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vj-muted" size={20} />
              <Input
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Stage Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-vj-muted" />
              <select 
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Stages</option>
                <option value="1">Ideation</option>
                <option value="2">Research</option>
                <option value="3">Validation</option>
                <option value="4">Prototype</option>
                <option value="5">Testing</option>
                <option value="6">Launch Prep</option>
                <option value="7">MVP Launch</option>
                <option value="8">Growth</option>
                <option value="9">Scale/Exit</option>
              </select>
            </div>
            
            {/* Sort */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="upvotes">Highest Rated</option>
              <option value="stage">Most Advanced</option>
              <option value="comments">Most Discussed</option>
            </select>
          </div>
          
          {/* Tags Filter */}
          {tagsWithCounts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-vj-border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-vj-muted">Popular Tags:</span>
                {tagsWithCounts
                  .slice(0, showAllTags ? tagsWithCounts.length : 20)
                  .map(([tag, count]) => (
                    <Badge
                      key={tag}
                      className="bg-idea-light text-idea-primary hover:bg-idea-light/80 cursor-pointer"
                    >
                      {tag} ({count})
                    </Badge>
                  ))}
                {tagsWithCounts.length > 20 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-idea-primary hover:text-idea-primary/80"
                    onClick={() => setShowAllTags(!showAllTags)}
                  >
                    {showAllTags ? "Show Less" : `Show All (${tagsWithCounts.length})`}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-idea-primary/30 border-t-idea-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-vj-muted">Loading ideas...</p>
          </div>
        ) : (
          <>
            {/* Ideas Grid */}
            <div className="ideas-grid">
              {filteredIdeas.map((idea) => (
                <div 
                  key={idea.ideaId} 
                  id={`idea-${idea.ideaId}`}
                  className="vj-card-idea group"
                >
                  {/* Idea Header with Title Image or Creative Visual */}
                  <div className="aspect-video relative overflow-hidden rounded-vj-large mb-6 bg-gradient-to-br from-idea-light to-idea-primary/20">
                    {idea.titleImage ? (
                      <img 
                        src={idea.titleImage} 
                        alt={idea.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-idea-primary/30 rounded-full flex items-center justify-center">
                          <span className="text-3xl">💡</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-white text-xs font-medium">Idea</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <StatusBadge stage={idea.stage || 1} />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-1 text-white bg-black/70 px-2 py-1 rounded-full">
                        <MessageCircle size={12} />
                        <span className="text-xs">{idea.comments?.length || 0}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <UpvoteButton 
                        upvotes={idea.upvotes || 0}
                        hasUpvoted={!!idea.likedByUser}
                        onClick={() => handleUpvote(idea.ideaId)}
                        className="bg-white/90 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-vj-primary mb-2 group-hover:text-idea-primary transition-colors">
                      {idea.title}
                    </h3>
                    
                    <div className="h-24 relative overflow-hidden">
                      <p className="text-vj-muted leading-relaxed">
                        {idea.description}
                      </p>
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent"></div>
                    </div>
                    
                    {/* Team */}
                    {idea.team && idea.team.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-vj-primary mb-3 flex items-center gap-2">
                          <Users size={16} className="text-idea-primary" />
                          Team Members
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {idea.team.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-2 dark:bg-gray-800 bg-idea-light border border-idea-primary/20 px-3 py-2 rounded-full hover:bg-idea-primary/10 dark:hover:bg-idea-primary/20 transition-colors">
                              <div className="w-6 h-6 rounded-full bg-idea-primary/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-idea-primary">{member.name[0]}</span>
                              </div>
                              <div className="text-xs">
                                <div className="font-medium text-idea-primary">{member.name}</div>
                                <div className="text-idea-muted dark:text-gray-300">{member.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Mentor */}
                    {idea.mentor && (
                      <div className="p-3 bg-idea-light rounded-lg border border-idea-primary/20">
                        <p className="text-sm">
                          <span className="font-medium text-idea-primary">🎓 Mentor:</span> 
                          <span className="text-vj-muted ml-1">{idea.mentor}</span>
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-2">
                      <Link to={`/ideas/${idea.ideaId}`} className="flex-1">
                        <Button size="sm" className="w-full bg-idea-primary hover:bg-idea-primary/90 text-white">
                          View Details
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="flex-1 border-idea-primary/30 text-idea-primary hover:bg-idea-light">
                        Contact Team
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredIdeas.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-vj-muted text-lg">
                  {problemFilter ? "No ideas found for this problem yet." : "No ideas match your current filters."}
                </p>
                <div className="flex gap-4 justify-center mt-4">
                  {problemFilter && (
                    <Button className="btn-primary" onClick={() => {}}>
                      Submit First Idea
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => { setSearchTerm(""); setStageFilter(""); }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Ideas;