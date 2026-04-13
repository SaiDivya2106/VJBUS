import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, Clock, ArrowRight, CheckCircle, Circle, PlayCircle } from "lucide-react";
import { startupPrograms, StartupProgram } from "@/data/startupPrograms";

const Programs = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'planned':
        return <Circle className="h-4 w-4 text-orange-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'planned':
        return 'Planned';
      default:
        return 'Unknown';
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

  const groupedPrograms = startupPrograms.reduce((acc, program) => {
    if (!acc[program.category]) {
      acc[program.category] = [];
    }
    acc[program.category].push(program);
    return acc;
  }, {} as Record<string, StartupProgram[]>);

  const categoryTitles = {
    challenge: 'Challenges & Competitions',
    internship: 'Internships & Mentorship',
    learning: 'Learning & Development',
    networking: 'Networking & Community',
    training: 'Technical Training',
    event: 'Events & Workshops',
    initiative: 'Campus Initiatives'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              VNRVJIET Startup Programs
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Comprehensive ecosystem of programs, workshops, and initiatives designed to nurture student entrepreneurship
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>{startupPrograms.length} Programs</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>All Students Welcome</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>1 Hour to 2 Months</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(groupedPrograms).map(([category, programs]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {categoryTitles[category as keyof typeof categoryTitles] || category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Card key={program.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`${getCategoryColor(program.category)} border-0`}>
                        {program.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        {getStatusIcon(program.status)}
                        <span className="text-gray-600 dark:text-gray-300">
                          {getStatusText(program.status)}
                        </span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {program.title}
                      {program.edition && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          #{program.edition}
                        </span>
                      )}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
                      {program.subtitle}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {program.shortDescription}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{program.duration}</span>
                      </div>
                    </div>
                    
                    <Link to={`/programs/${program.id}`}>
                      <Button className="w-full group/btn bg-blue-600 hover:bg-blue-700 text-white">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Entrepreneurial Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join our thriving startup community and transform your ideas into reality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
              Contact Innovation Cell
            </Button>
            <Link to="/problems">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                Explore Problems
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Programs;
