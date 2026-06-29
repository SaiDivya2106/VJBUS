import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Users, 
  Target, 
  Eye, 
  Mail, 
  Phone, 
  ExternalLink, 
  Award,
  Rocket,
  TrendingUp,
  Calendar,
  MapPin,
  Building,
  Star,
  CheckCircle
} from "lucide-react";
import { clubInfo, wings, Wing } from "@/data/clubInfo";

const ClubPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">{clubInfo.name}</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">{clubInfo.tagline}</p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{clubInfo.totalMembers}+</div>
                <div className="text-blue-100">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{clubInfo.totalStartups}+</div>
                <div className="text-blue-100">Potential Startups</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{clubInfo.totalFunding}</div>
                <div className="text-blue-100">Funding Raise Target</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{clubInfo.outReach}</div>
                <div className="text-blue-100">Members Outreach</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wings">Wings Structure</TabsTrigger>
            <TabsTrigger value="team">Team Directory</TabsTrigger>
            <TabsTrigger value="join">Get Involved</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-blue-600" />
                  About VJ Startups Club
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-vj-muted text-lg leading-relaxed mb-6">{clubInfo.description}</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-vj-primary mb-4">
                      <Target className="h-5 w-5 text-green-600" />
                      Our Mission
                    </h3>
                    <p className="text-vj-muted">{clubInfo.mission}</p>
                  </div>
                  
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-vj-primary mb-4">
                      <Eye className="h-5 w-5 text-purple-600" />
                      Our Vision
                    </h3>
                    <p className="text-vj-muted">{clubInfo.vision}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wings Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Our Eight Wings</CardTitle>
                <CardDescription>
                  Each wing adds different level of support to startups in our ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {wings.map((wing) => (
                    <div key={wing.id} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold text-vj-primary mb-2">{wing.name}</h4>
                      <p className="text-sm text-vj-muted mb-3">{wing.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {wing.coreTeam.length + 1} Team Members
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wings Structure Tab */}
          <TabsContent value="wings" className="space-y-6">
            {wings.map((wing, index) => (
              <Card key={wing.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{wing.name}</CardTitle>
                      <CardDescription className="text-lg mt-2">{wing.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      Wing {index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Purpose */}
                    <div>
                      <h4 className="font-semibold text-vj-primary mb-2">Purpose</h4>
                      <p className="text-vj-muted">{wing.purpose}</p>
                    </div>

                    {/* Focus Areas */}
                    <div>
                      <h4 className="font-semibold text-vj-primary mb-3">Focus Areas</h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {wing.focusAreas.map((area, areaIndex) => (
                          <div key={areaIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-vj-muted">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements & Current Projects */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {wing.achievements && (
                        <div>
                          <h4 className="font-semibold text-vj-primary mb-3 flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-600" />
                            Key Achievements
                          </h4>
                          <ul className="space-y-1">
                            {wing.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="text-sm text-vj-muted flex items-center gap-2">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {wing.currentProjects && (
                        <div>
                          <h4 className="font-semibold text-vj-primary mb-3 flex items-center gap-2">
                            <Rocket className="h-4 w-4 text-blue-600" />
                            Current Projects
                          </h4>
                          <ul className="space-y-1">
                            {wing.currentProjects.map((project, projIndex) => (
                              <li key={projIndex} className="text-sm text-vj-muted flex items-center gap-2">
                                <TrendingUp className="h-3 w-3 text-blue-500" />
                                {project}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-vj-primary mb-2">Contact This Wing</h4>
                      <div className="flex items-center gap-2 text-sm text-vj-muted">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${wing.contactEmail}`} className="hover:text-blue-600">
                          {wing.contactEmail}
                        </a>
                      </div>
                    </div>

                    {/* Sub-Wings (if available) */}
                    {wing.subWings && wing.subWings.length > 0 && (
                      <div>
                        <Separator className="my-6" />
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="sub-wings" className="border-none">
                            <AccordionTrigger className="hover:no-underline py-3">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-purple-600" />
                                <span className="font-semibold text-vj-primary">
                                  Program Sub-Wings ({wing.subWings.length})
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-0">
                              <div className="grid gap-4 mt-4">
                                {wing.subWings.map((subWing) => (
                                  <div key={subWing.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h5 className="font-medium text-vj-primary">{subWing.name}</h5>
                                        <p className="text-sm text-vj-muted mt-1">{subWing.description}</p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Badge variant={subWing.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                          {subWing.status}
                                        </Badge>
                                        {subWing.edition && (
                                          <Badge variant="outline" className="text-xs">
                                            Season {subWing.edition}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium text-vj-primary">Team Lead:</span>
                                        <div className="text-vj-muted mt-1">
                                          {subWing.teamLead.name} - {subWing.teamLead.role}
                                          <br />
                                          <span className="text-xs">{subWing.teamLead.branch}, {subWing.teamLead.year}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <span className="font-medium text-vj-primary">Team Size:</span>
                                        <div className="text-vj-muted mt-1">{subWing.team.length + 1} members</div>
                                        
                                        {subWing.currentActivity && (
                                          <div className="mt-2">
                                            <span className="font-medium text-vj-primary">Current Activity:</span>
                                            <div className="text-vj-muted text-xs mt-1">{subWing.currentActivity}</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {subWing.achievements && subWing.achievements.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <span className="font-medium text-vj-primary text-xs">Key Achievements:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {subWing.achievements.slice(0, 2).map((achievement, achIdx) => (
                                            <span key={achIdx} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                                              {achievement}
                                            </span>
                                          ))}
                                          {subWing.achievements.length > 2 && (
                                            <span className="text-xs text-vj-muted">+{subWing.achievements.length - 2} more</span>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                      <div className="flex items-center gap-2 text-xs text-vj-muted">
                                        <Mail className="h-3 w-3" />
                                        <a href={`mailto:${subWing.contactEmail}`} className="hover:text-blue-600">
                                          {subWing.contactEmail}
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Team Directory Tab */}
          <TabsContent value="team" className="space-y-6">
            {wings.map((wing) => (
              <Card key={wing.id}>
                <CardHeader>
                  <CardTitle>{wing.name} - Team</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Wing Master */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-vj-primary mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Wing Master
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        {wing.wingMaster.imageUrl ? (
                          <img 
                            src={wing.wingMaster.imageUrl} 
                            alt={wing.wingMaster.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {wing.wingMaster.name.charAt(0)}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h5 className="font-semibold text-vj-primary">{wing.wingMaster.name}</h5>
                          <p className="text-sm text-vj-muted mb-2">{wing.wingMaster.role}</p>
                          
                          <div className="flex flex-wrap gap-3 text-sm">
                            {wing.wingMaster.email && (
                              <a 
                                href={`mailto:${wing.wingMaster.email}`}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                              >
                                <Mail className="h-3 w-3" />
                                Email
                              </a>
                            )}
                            {wing.wingMaster.phone && (
                              <a 
                                href={`tel:${wing.wingMaster.phone}`}
                                className="flex items-center gap-1 text-green-600 hover:text-green-800"
                              >
                                <Phone className="h-3 w-3" />
                                Call
                              </a>
                            )}
                            {wing.wingMaster.linkedinUrl && (
                              <a 
                                href={wing.wingMaster.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3" />
                                LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Team */}
                  <div>
                    <h4 className="font-semibold text-vj-primary mb-4">Core Team Members</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {wing.coreTeam.map((member, memberIndex) => (
                        <div key={memberIndex} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            {member.imageUrl ? (
                              <img 
                                src={member.imageUrl} 
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                                {member.name.charAt(0)}
                              </div>
                            )}
                            
                            <div className="flex-1">
                              <h5 className="font-semibold text-vj-primary text-sm">{member.name}</h5>
                              <p className="text-xs text-vj-muted mb-1">{member.role}</p>
                              {member.branch && member.year && (
                                <p className="text-xs text-gray-500">{member.branch} • {member.year}</p>
                              )}
                              
                              <div className="flex gap-2 mt-2">
                                {member.email && (
                                  <a 
                                    href={`mailto:${member.email}`}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    <Mail className="h-3 w-3" />
                                  </a>
                                )}
                                {member.linkedinUrl && (
                                  <a 
                                    href={member.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Get Involved Tab */}
          <TabsContent value="join" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Join VJ Startups Club</CardTitle>
                <CardDescription>
                  Be part of VNRVJIET's most dynamic entrepreneurship community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-vj-primary mb-4">Why Join Us?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Access to industry mentors and experts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Funding opportunities and investor connects</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Practical entrepreneurship experience</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Strong alumni and industry network</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Leadership and teamwork skills development</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-vj-primary mb-4">How to Join</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</div>
                        <div>
                          <p className="text-sm font-medium">Fill Registration Form</p>
                          <p className="text-xs text-vj-muted">Complete our online registration with your interests</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</div>
                        <div>
                          <p className="text-sm font-medium">Attend Orientation</p>
                          <p className="text-xs text-vj-muted">Join our monthly orientation session</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</div>
                        <div>
                          <p className="text-sm font-medium">Choose Your Wing</p>
                          <p className="text-xs text-vj-muted">Select the wing that matches your interests</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">4</div>
                        <div>
                          <p className="text-sm font-medium">Start Your Journey</p>
                          <p className="text-xs text-vj-muted">Begin participating in programs and events</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="text-center">
                  <h3 className="font-semibold text-vj-primary mb-4">Ready to Start Your Entrepreneurial Journey?</h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button variant="outline" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      Attend Next Meetup
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-sm text-vj-muted">
                    <p>Have questions? Contact us at <a href="mailto:head.iie+questions@vnrvjiet.in" className="text-blue-600 hover:text-blue-800">head.iie+questions@vnrvjiet.in</a></p>
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

export default ClubPage;
