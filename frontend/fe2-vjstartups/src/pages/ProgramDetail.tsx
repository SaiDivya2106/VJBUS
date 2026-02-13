import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CheckCircle, 
  Circle, 
  PlayCircle,
  Mail,
  User,
  Clock,
  Target,
  Lightbulb,
  Award,
  BookOpen,
  MessageSquare,
  Trophy,
  ExternalLink
} from "lucide-react";
import { startupPrograms } from "@/data/startupPrograms";
import { getSuccessStoriesByProgram } from "@/data/successStories";

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const program = startupPrograms.find(p => p.id === id);
  const successStories = program ? getSuccessStoriesByProgram(program.id) : [];

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Program Not Found
          </h1>
          <Link to="/programs">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-5 w-5 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'planned':
        return <Circle className="h-5 w-5 text-orange-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Currently Active';
      case 'completed':
        return 'Program Completed';
      case 'planned':
        return 'Coming Soon';
      default:
        return 'Status Unknown';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'challenge':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'internship':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'learning':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'networking':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'training':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'event':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'initiative':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/programs">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Programs
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`${getCategoryColor(program.category)} border-0`}>
                  {program.category}
                </Badge>
                <div className="flex items-center gap-2">
                  {getStatusIcon(program.status)}
                  <span className="text-blue-100">{getStatusText(program.status)}</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {program.title}
                {program.edition && (
                  <span className="text-xl font-normal text-blue-200 ml-3">
                    Edition #{program.edition}
                  </span>
                )}
              </h1>
              
              <p className="text-xl text-blue-100 mb-4">
                {program.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Open to all VNRVJIET students</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participate">How to Join</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            {program.timeline && <TabsTrigger value="timeline">Timeline</TabsTrigger>}
            <TabsTrigger value="success-stories" className="relative">
              Success Stories
              {successStories.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {successStories.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Program Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {program.overview}
                </p>
              </CardContent>
            </Card>

            {program.eligibility && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="participate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  How to Participate
                </CardTitle>
                <CardDescription>
                  Follow these steps to join the {program.title} program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {program.howToParticipate.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  What Support You'll Get
                </CardTitle>
                <CardDescription>
                  Comprehensive support system designed for your success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.support.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Program Benefits
                </CardTitle>
                <CardDescription>
                  What you'll gain from participating in this program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Award className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {program.timeline && (
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Program Timeline
                  </CardTitle>
                  <CardDescription>
                    Detailed schedule and milestones for the program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {program.timeline.map((phase, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-semibold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 pb-4">
                          <p className="text-gray-700 dark:text-gray-300">{phase}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="success-stories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Success Stories
                </CardTitle>
                <CardDescription>
                  Inspiring journeys and achievements from our program participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                {successStories.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-vj-primary mb-2">Success Stories Coming Soon</h3>
                    <p className="text-vj-muted mb-4">
                      We're currently documenting the amazing achievements from this program.
                    </p>
                    <p className="text-sm text-vj-muted">
                      Be the first to create a success story by joining this program!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-vj-muted">
                        {successStories.length} success {successStories.length === 1 ? 'story' : 'stories'} from this program
                      </p>
                      <Button variant="outline" asChild size="sm">
                        <Link to={`/programs/${program.id}/success-stories`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View All Stories
                        </Link>
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {successStories.slice(0, 4).map((story) => (
                        <Card key={story.id} className="group hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
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
                            <CardTitle className="text-base group-hover:text-problem-primary transition-colors">
                              {story.title}
                            </CardTitle>
                            <p className="text-sm text-vj-muted">{story.subtitle}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-4 text-xs text-vj-muted">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {story.participants.length} members
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(story.date).getFullYear()}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <h5 className="text-xs font-semibold text-vj-primary">Key Achievements:</h5>
                                {story.achievements.slice(0, 2).map((achievement, index) => (
                                  <div key={index} className="text-xs text-vj-muted flex items-center gap-1">
                                    <Trophy className="h-3 w-3 text-yellow-500" />
                                    {achievement}
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-between items-center pt-2">
                                <div className="flex flex-wrap gap-1">
                                  {story.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Button variant="ghost" size="sm" asChild className="h-7 px-2">
                                  <Link to={`/programs/${program.id}/success-stories/${story.id}`}>
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {successStories.length > 4 && (
                      <div className="text-center pt-4">
                        <Button asChild className="bg-problem-primary hover:bg-problem-primary/90">
                          <Link to={`/programs/${program.id}/success-stories`}>
                            View All {successStories.length} Success Stories
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Get in Touch
                </CardTitle>
                <CardDescription>
                  Contact information for program coordination and queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email</p>
                        <p className="text-gray-600 dark:text-gray-300">{program.contact.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Coordinator</p>
                        <p className="text-gray-600 dark:text-gray-300">{program.contact.coordinator}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgramDetail;
