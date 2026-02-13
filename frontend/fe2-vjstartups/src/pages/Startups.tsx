import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Startup {
  _id: string;
  startupName: string;
  description: string;
  stage: number;
  fundingStatus: string;
  upvotes: number;
  coverImage?: string;
}

const Startups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/startup-api`);
        setStartups(response.data);
      } catch (err) {
        console.error('Error fetching startups:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  const filteredStartups = startups
    .filter(startup => startup.stage >= 4) // Only show Prototype stage and above
    .filter(startup => 
      startup.startupName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-startup-primary mx-auto mb-4"></div>
          <p className="text-vj-muted">Loading startups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-vj-primary mb-4">
            Startups
          </h1>
          <p className="text-xl text-vj-muted max-w-3xl mx-auto">
            From campus ideas to funded companies.
          </p>
        </div>
        
        <div className="vj-card rounded-xl p-6 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vj-muted" size={20} />
            <Input
              placeholder="Search startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredStartups.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-vj-muted mb-4">No startups found.</p>
            <Link to="/startup-form">
              <Button className="bg-startup-primary hover:bg-startup-primary/90 text-white">
                Create First Startup
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredStartups.map(startup => (
              <div key={startup._id} className="vj-card-startup hover-lift">
                {startup.coverImage && (
                  <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={`${import.meta.env.VITE_API_BASE_URL}${startup.coverImage}`}
                      alt={startup.startupName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-vj-primary mb-2">
                    {startup.startupName}
                  </h3>
                  <p className="text-sm text-startup-primary font-medium">
                    Stage {startup.stage} • {startup.fundingStatus}
                  </p>
                </div>
                
                <p className="text-vj-muted mb-4">
                  {startup.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <Link to={`/startups/${startup._id}`}>
                    <Button size="sm" className="bg-startup-primary hover:bg-startup-primary/90 text-white">
                      View Details
                    </Button>
                  </Link>
                  <span className="text-sm text-vj-muted">
                    {startup.upvotes} upvotes
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Startups;
