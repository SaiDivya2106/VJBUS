import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UpvoteButton from "@/components/UpvoteButton";
import StatusBadge from "@/components/StatusBadge";
import { mockStartups } from "@/data/mockData";

const Startups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fundingFilter, setFundingFilter] = useState("");
  const [sortBy, setSortBy] = useState("stage");
  
  // Filter and sort startups
  const filteredStartups = mockStartups
    .filter(startup => 
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(startup => 
      !fundingFilter || startup.fundingStatus.toLowerCase().includes(fundingFilter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "stage":
          return b.stage - a.stage;
        case "upvotes":
          return b.upvotes - a.upvotes;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4 font-playfair">
            Success Stories
          </h1>
          <p className="text-xl text-vj-muted max-w-3xl mx-auto">
            From campus ideas to funded companies. Discover the startups that started right here 
            in our community and are now making real impact in the world.
          </p>
        </div>
        
        {/* Filters & Search */}
        <div className="bg-vj-neutral rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vj-muted" size={20} />
              <Input
                placeholder="Search startups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Funding Filter */}
            <select 
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value)}
              className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Funding Stages</option>
              <option value="pre-seed">Pre-Seed</option>
              <option value="seed">Seed</option>
              <option value="series">Series A+</option>
            </select>
            
            {/* Sort */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-vj-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="stage">Most Advanced</option>
              <option value="upvotes">Most Popular</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
        
        {/* Startups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredStartups.map(startup => (
            <div key={startup.id} className="vj-card-startup group">
              {/* Startup Logo/Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-vj-large overflow-hidden bg-startup-light border-2 border-startup-primary/20 flex items-center justify-center group-hover:border-startup-primary/40 transition-colors">
                  <img 
                    src={`/src/assets/startup-logo-${startup.id}.png`}
                    alt={`${startup.name} logo`}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.textContent = startup.name.slice(0, 2).toUpperCase();
                        fallback.style.display = 'block';
                      }
                    }}
                  />
                  <span className="text-lg font-bold text-startup-primary hidden"></span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-vj-primary group-hover:text-startup-primary transition-colors leading-tight">
                      {startup.name}
                    </h3>
                    <StatusBadge stage={startup.stage} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <UpvoteButton upvotes={startup.upvotes} className="scale-75" />
                    <div className="flex items-center gap-1 px-2 py-1 bg-startup-light text-startup-primary text-xs font-medium rounded-full">
                      🚀 <span>Startup</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-vj-muted leading-relaxed mb-6">
                {startup.description}
              </p>
              
              {/* Funding */}
              <div className="mb-4 p-3 bg-startup-light rounded-lg border border-startup-primary/20">
                <p className="text-sm">
                  <span className="font-medium text-startup-primary">💰 Funding:</span>
                  <span className="text-vj-muted ml-1">{startup.fundingStatus}</span>
                </p>
              </div>
              
              {/* Team */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-vj-primary mb-3 flex items-center gap-2">
                  <Users size={16} className="text-startup-primary" />
                  Team ({startup.team.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {startup.team.slice(0, 3).map((member, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-startup-light border border-startup-primary/20 px-3 py-1.5 rounded-full hover:bg-startup-primary/10 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-startup-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-startup-primary">{member.name[0]}</span>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium text-startup-primary">{member.name}</div>
                        <div className="text-startup-muted">{member.role}</div>
                      </div>
                    </div>
                  ))}
                  {startup.team.length > 3 && (
                    <div className="flex items-center px-3 py-1.5 bg-startup-light border border-startup-primary/20 rounded-full">
                      <span className="text-xs text-startup-primary font-medium">+{startup.team.length - 3} more</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Schemes */}
              {startup.schemes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-startup-muted mb-2">🏆 Programs:</p>
                  <div className="flex flex-wrap gap-1">
                    {startup.schemes.map((scheme, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-startup-primary/30 text-startup-primary">
                        {scheme}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recent Milestones */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-startup-primary" />
                  <span className="text-sm font-medium text-vj-primary">Recent Milestones</span>
                </div>
                <div className="space-y-2">
                  {startup.milestones.slice(-2).map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-startup-primary' : 'bg-startup-muted/30'}`}></div>
                      <span className={milestone.completed ? 'text-vj-primary font-medium' : 'text-vj-muted'}>
                        {milestone.title}
                      </span>
                      <span className="text-startup-muted ml-auto">
                        {new Date(milestone.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link to={`/startups/${startup.id}`} className="flex-1">
                  <Button size="sm" className="w-full bg-startup-primary hover:bg-startup-primary/90 text-white">
                    View Details
                  </Button>
                </Link>
                {startup.onePager && (
                  <Button size="sm" variant="outline" className="flex-1 border-startup-primary/30 text-startup-primary hover:bg-startup-light gap-2">
                    <Download size={12} />
                    One-Pager
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredStartups.length === 0 && (
          <div className="text-center py-16">
            <p className="text-vj-muted text-lg">No startups match your current filters.</p>
            <Button 
              variant="ghost" 
              onClick={() => { setSearchTerm(""); setFundingFilter(""); }}
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

export default Startups;