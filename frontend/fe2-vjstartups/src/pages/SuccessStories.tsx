import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, ExternalLink, Calendar, Users, Trophy, FileText } from "lucide-react";
import { getSuccessStoriesByProgram, startupPrograms } from "@/data/startupPrograms";
import { getSuccessStoryById } from "@/data/successStories";

const SuccessStories = () => {
  const { programId } = useParams();
  
  if (!programId) {
    return <div>Program not found</div>;
  }

  const program = startupPrograms.find(p => p.id === programId);
  const successStories = getSuccessStoriesByProgram(programId);

  if (!program) {
    return <div>Program not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/programs/${programId}`} className="inline-flex items-center gap-2 text-problem-primary hover:text-problem-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to {program.title}
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-vj-primary">Success Stories</h1>
          </div>
          <p className="text-xl text-vj-muted mb-4">{program.title} - Celebrating our achievers</p>
          
          <div className="flex items-center gap-4 text-sm text-vj-muted">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {successStories.length} Stories
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {successStories.reduce((acc, story) => acc + story.participants.length, 0)} Participants
            </span>
          </div>
        </div>

        {/* Success Stories Grid */}
        {successStories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-vj-primary mb-2">Success Stories Coming Soon</h3>
              <p className="text-vj-muted">
                We're currently documenting the amazing achievements from this program. 
                Check back soon to read inspiring stories from our participants!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map((story) => (
              <Card key={story.id} className="group hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {story.season}
                    </Badge>
                    {story.featured && (
                      <Badge variant="default" className="text-xs bg-yellow-500 text-yellow-50">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg leading-tight group-hover:text-problem-primary transition-colors">
                    {story.title}
                  </CardTitle>
                  <p className="text-sm text-vj-muted">{story.subtitle}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-vj-muted mt-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(story.date).toLocaleDateString()}
                    <Users className="h-3 w-3 ml-2" />
                    {story.participants.length} participants
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Participants */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-vj-primary mb-2">Team Members</h4>
                    <div className="space-y-1">
                      {story.participants.slice(0, 2).map((participant, index) => (
                        <div key={index} className="text-xs text-vj-muted">
                          <span className="font-medium">{participant.name}</span>
                          <span className="text-gray-400"> • {participant.branch}</span>
                        </div>
                      ))}
                      {story.participants.length > 2 && (
                        <div className="text-xs text-vj-muted">
                          +{story.participants.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Achievements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-vj-primary mb-2">Key Achievements</h4>
                    <div className="space-y-1">
                      {story.achievements.slice(0, 2).map((achievement, index) => (
                        <div key={index} className="text-xs text-vj-muted flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {story.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {story.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{story.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {story.contentType === 'web' || story.contentType === 'hybrid' ? (
                      <Button 
                        asChild 
                        size="sm" 
                        className="flex-1 bg-problem-primary hover:bg-problem-primary/90"
                      >
                        <Link to={`/programs/${programId}/success-stories/${story.id}`}>
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Read Story
                        </Link>
                      </Button>
                    ) : null}
                    
                    {story.pdfUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className={story.contentType === 'pdf' ? 'flex-1' : ''}
                      >
                        <a href={story.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-3 w-3 mr-1" />
                          {story.contentType === 'pdf' ? 'Download Report' : 'PDF'}
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-problem-primary/5 to-idea-primary/5 border-problem-primary/20">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold text-vj-primary mb-2">Want to Create Your Own Success Story?</h3>
            <p className="text-vj-muted mb-4">
              Join our {program.title} program and become part of VNRVJIET's innovation ecosystem.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild className="bg-problem-primary hover:bg-problem-primary/90">
                <Link to={`/programs/${programId}`}>
                  Learn More About {program.title}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/programs">
                  Explore All Programs
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessStories;
