import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import ProblemSubmissionForm from "@/components/ProblemSubmissionForm";
import axios from "axios";
import { useUser } from "../pages/UserContext"; 

const Problems = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showAllTags, setShowAllTags] = useState(false);
  const { user } = useUser();

  // Fetch problems from backend
useEffect(() => {
  const fetchProblems = async () => {
    if (!user?.email) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/problem-api/problems`);
      // Mark which problems the current user has already liked
      const updatedProblems = res.data.map((p: any) => ({
        ...p,
        likedByUser: p.upvotedBy.includes(user.email)
      }));
      setProblems(updatedProblems);
    } catch (err) {
      console.error("Error fetching problems:", err);
    }
  };
  fetchProblems();
}, [user?.email]);

// Handle scrolling to a specific problem card based on URL hash
useEffect(() => {
  // Only run after the problems data has been loaded
  if (problems.length > 0) {
    // Check if there's a problem ID in the URL hash
    const hash = window.location.hash;
    if (hash && hash.startsWith('#problem-')) {
      // Extract the problem ID from the hash
      const problemId = hash.replace('#problem-', '');
      
      // Use a longer timeout to ensure DOM is fully rendered and images are loaded
      setTimeout(() => {
        const problemCard = document.getElementById(`problem-${problemId}`);
        if (problemCard) {
          // First scroll to ensure the element is in the DOM view
          problemCard.scrollIntoView({ behavior: 'auto' });
          
          // Then calculate and set the final scroll position with header offset
          const cardPosition = problemCard.getBoundingClientRect().top;
          const scrollPosition = window.pageYOffset + cardPosition - 120; // 120px offset for header
          window.scrollTo({
            top: scrollPosition,
            behavior: 'auto'
          });
          
          // Add a highlight effect to make the card more noticeable
          problemCard.classList.add('ring-2', 'ring-orange-400');
          setTimeout(() => {
            problemCard.classList.remove('ring-2', 'ring-orange-400');
          }, 2000); // Remove highlight after 2 seconds
        }
      }, 500); // Longer timeout to ensure everything is loaded
    }
  }
}, [problems.length]);


  // Get all unique tags and tag counts
  const getTagsWithCounts = (problems: any[]) => {
    // Count occurrences of each tag
    const tagCounts: Record<string, number> = {};
    problems.forEach(problem => {
      problem.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA);
  };
  
  // Get all tags sorted by popularity
  const tagsWithCounts = getTagsWithCounts(problems);
  
  // Get all unique tags
  const allTags = tagsWithCounts.map(([tag]) => tag);
  
  // Get top 20 tags
  const topTags = allTags.slice(0, 20);

  // Filter and sort problems
  const filteredProblems = problems
    .filter(problem =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.briefparagraph.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(problem =>
      selectedTags.length === 0 ||
      selectedTags.some(tag => problem.tags.includes(tag))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "upvotes":
          return b.upvotes - a.upvotes;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "comments":
          return b.comments.length - a.comments.length;
        default:
          return 0;
      }
    });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

const handleUpvote = async (problemId: string) => {
  if (!user?.email) return;

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/problem-api/problem/${problemId}/upvote`,
      { email: user.email }
    );

    // Update the problem in state dynamically
    setProblems(prev =>
      prev.map(p =>
        p.problemId === problemId
          ? {
              ...p,
              upvotes: res.data.upvotes,
              likedByUser: res.data.upvotedBy.includes(user.email)
            }
          : p
      )
    );
  } catch (err) {
    console.error("Error toggling upvote:", err);
  }
};


  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16">
          <div className="text-center lg:text-left flex-1 mb-8 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
              Problems Worth Solving
            </h1>
            <p className="text-xl text-vj-muted max-w-3xl">
              Real challenges identified by our community. Each problem represents an opportunity 
              to create meaningful impact through innovative solutions.
            </p>
          </div>
<div>
  <ProblemSubmissionForm onProblemAdded={(newProblem) => setProblems(prev => [newProblem, ...prev])} />
</div>

        </div>

        {/* Filters & Search */}
        <div className="bg-vj-neutral rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vj-muted" size={20} />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-vj-muted" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="upvotes">Most Upvoted</option>
                <option value="comments">Most Discussed</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-vj-muted" />
                <span className="text-sm font-medium text-vj-primary">
                  {showAllTags ? "All tags:" : "Top tags:"}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAllTags(!showAllTags)} 
                className="text-xs"
              >
                {showAllTags ? "Show top 20" : "Show all tags"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(showAllTags ? tagsWithCounts : tagsWithCounts.slice(0, 20)).map(([tag, count]) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer transition-all flex items-center gap-1"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    selectedTags.includes(tag) 
                      ? 'bg-white/20 text-white' 
                      : 'bg-vj-muted/10 text-vj-muted'
                  }`}>
                    {count}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProblems.map(problem => (
            <div 
              key={problem.problemId} 
              id={`problem-${problem.problemId}`}
              className="vj-card-problem group rounded-xl shadow-lg overflow-hidden transition-all duration-300">
              {/* Problem Image */}
              <Link to={`/problems/${problem.problemId}`} className="block cursor-pointer">
                <div className="aspect-video relative overflow-hidden rounded-t-xl">
                  <img 
                    src={problem.image || '/problem_placeholder_cover1.png'}
                    alt={problem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-white text-xs font-medium">Problem</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                  <UpvoteButton
                    upvotes={problem.upvotes}
                    hasUpvoted={problem.likedByUser} // this controls the highlight
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      e.stopPropagation(); // Stop event bubbling
                      handleUpvote(problem.problemId);
                    }}
                  />
                  </div>
                </div>
              </Link>

              <div className="p-4 space-y-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-problem-primary/30 text-problem-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-vj-primary group-hover:text-problem-primary transition-colors">
                  <Link to={`/problems/${problem.problemId}`} className="hover:underline">
                    {problem.title}
                  </Link>
                </h3>

                <Link to={`/problems/${problem.problemId}`}>
                  <p className="text-vj-muted leading-relaxed h-[168px] overflow-hidden relative cursor-pointer hover:text-vj-primary transition-colors">
                    {problem.briefparagraph}
                    <span className="absolute bottom-0 right-0 bg-gradient-to-l from-white via-white to-transparent w-full h-8 dark:from-[rgb(25,15,17)] dark:via-[rgb(25,15,17)]"></span>
                    {/* Only show ellipsis if the text is actually truncated/overflowing, TODO(mkrishna): Above colors to be adjusted */}
                    {problem.briefparagraph && problem.briefparagraph.length > 300 && (
                      <span className="absolute bottom-0 right-0 mr-2 text-vj-muted">...</span>
                    )}
                  </p>
                </Link>

                <div className="flex items-center justify-between text-sm text-vj-muted pt-2 border-t border-vj-border/50">
                  <span>by {problem.addedByName}</span>

                  <span>{problem.comments.length} comments</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link to={`/problems/${problem.problemId}`} className="flex-1">
                  <Button 
  size="default"
  variant="outline"
  className="w-full"
>
  View Details
</Button>
                  </Link>
                  {/* <Link to={`/ideas?problem=${problem.problemId}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full border-problem-primary/30 text-problem-primary hover:bg-problem-light">
                      View Ideas
                    </Button>
                  </Link> */}
                </div>
              </div>
            </div>
          ))}
        </div>

{!user ? (
  <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-xl shadow-inner border border-orange-200">
    <h2 className="text-2xl font-bold text-orange-600 mb-3">Join the Community 🚀</h2>
    <p className="text-vj-muted max-w-md text-center mb-6">
      You need to be logged in to explore community problems, upvote ideas, and submit your own challenges.  
      Sign in and start making an impact today!
    </p>
    <Link to="/login">
      <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105">
        Login to Continue
      </Button>
    </Link>
  </div>
) : filteredProblems.length === 0 && (
  <div className="text-center py-16">
    <p className="text-vj-muted text-lg">No problems match your current filters.</p>
    <Button 
      variant="ghost" 
      onClick={() => { setSearchTerm(""); setSelectedTags([]); }}
      className="mt-4"
    >
      Clear Filters
    </Button>
  </div>
)}

      </div>
    </div>
  );
};

export default Problems;
