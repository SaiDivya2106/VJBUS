export interface StartupProgram {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  status: 'active' | 'planned' | 'completed';
  edition: number | null; // How many times conducted
  category: 'challenge' | 'internship' | 'learning' | 'networking' | 'training' | 'event' | 'initiative';
  shortDescription: string;
  overview: string;
  howToParticipate: string[];
  support: string[];
  benefits: string[];
  eligibility: string[];
  timeline?: string[];
  successStories?: {
    title: string;
    description: string;
    outcome: string;
  }[];
  resources?: {
    title: string;
    description: string;
    link?: string;
  }[];
  mentors?: {
    name: string;
    designation: string;
    expertise: string[];
  }[];
  contact: {
    email: string;
    coordinator: string;
  };
}

export const startupPrograms: StartupProgram[] = [
  {
    id: 'startup-challenge-2',
    title: 'Startup Challenge',
    subtitle: 'Try a business idea with ₹1000',
    duration: '10-15 days',
    status: 'active',
    edition: 3,
    category: 'challenge',
    shortDescription: 'Grow ₹1000 in 15 days  with your business idea, under successful mentors.',
    overview: `The Startup Challenge is an intensive 10-15 day program where students receive upto ₹1000 as seed money and challenge themselves to grow it through entrepreneurial activities. This hands-on experience teaches practical business skills, customer validation, and resource management.`,
    howToParticipate: [
      'Submit your business proposal with a basic business idea or growth strategy',
      'Receive upto ₹1000 seed money and begin your challenge',
      'You will be assigned a mentor, Stay in touch with him/her',
      'Document your journey and learnings throughout the period',
      'Present your results and learning at the final showcase'
    ],
    support: [
      'Initial seed funding of upto ₹1000',
      'Dedicated mentorship from Prevous Participants who successfully completed the challenge',
      'Access to university resources and networks',
      'Documentation templates and tracking tools'
    ],
    benefits: [
      'Real-world entrepreneurial experience',
      'Hands-on learning about customer acquisition',
      'Network building with mentors and peers',
      'Certificate of participation',
      'Potential for follow-up funding for promising ideas'
    ],
    eligibility: [
      'Current VNRVJIET students (all branches)',
      'Commitment to participate for full duration',
      'Willingness to document and share learnings',
      'Basic business presentation skills'
    ],
    timeline: [
      'Day 1-2: Conclusions on Customers & Products/Services',
      'Day 3-5: Active out reach & Promotions',
      'Day 6-10: Early Stage Sales',
      'Day 11-13: Scaling Up of Sales',
      'Day 14-15: Documentation and final presentation'
    ],
    contact: {
      email: 'head.iie+startup.challenge@vnrvjiet.in',
      coordinator: 'Head of Innovation, Incubation and Entrepreneurship'
    }
  },
  {
    id: 'innovation-internship-1',
    title: 'Innovation Internship',
    subtitle: 'Structured Problem-to-Solution Journey',
    duration: '1-2 months',
    status: 'active',
    edition: 2,
    category: 'internship',
    shortDescription: 'Transform your problem into a viable solution through structured TRL progression',
    overview: `The Innovation Internship is a comprehensive 1-2 month program that guides students through the Technology Readiness Levels (TRL) framework to develop viable solutions for real-world problems. Students work on their own identified problems with structured guidance.`,
    howToParticipate: [
      'Submit a problem statement you want to solve on ProblemHub',
      'Attend the TRL framework orientation session',
      'Commit to the structured milestone-based approach',
      'Participate in weekly review sessions',
      'Complete all three TRL stages with documentation'
    ],
    support: [
      'Structured TRL framework guidance',
      'Weekly mentorship sessions',
      'Access to research databases and resources',
      'Customer validation support and networks',
      'Prototype development guidance',
      'Scheme application assistance'
    ],
    benefits: [
      'Systematic approach to innovation',
      'Market research and validation skills',
      'Prototype development experience',
      'Eligibility for government schemes',
      'Professional documentation portfolio',
      'Industry mentor connections'
    ],
    eligibility: [
      'Students with a clearly defined problem statement',
      'Commitment to 1-2 month program duration',
      'Willingness to engage with potential customers',
      'Basic research and presentation skills',
      '1-2 week break due to personal issues, exams is acceptable.',
    ],
    timeline: [
      'Week 1: TRL1 - Problem Clarity (Context, Root cause), Customers, Emotional Impact & Market Size',
      'Week 2: TRL1 - Alternatives , Alternaties Short comings, Clarity on your solution, Find Customers',
      'Week 3: TRL2 - Solution Design, Feature Prioritization & Customer Approval on Designs ',
      'Week 4: TRL2 - Refinement of Solutions until Customer approves',
      'Week 5-6: TRL3 - Proof of Concept Development and Iterative imporvemnets with Customer Feedback',
      'Week 7-8: TRL3 - Launching the solution to a wider audience and collecting feedback',
      'Week 8: TRL3 - Presentation of the complete journey and Conclusions on the next steps',
    ],
    contact: {
      email: 'head.iie+innovation.internships@vnrvjiet.in',
      coordinator: 'Head of Innovation, Incubation and Entrepreneurship'
    }
  },
  {
    id: 'evening-focus-groups-1',
    title: 'Evening Focus Groups',
    subtitle: 'Collaborative Learning & Building Sessions',
    duration: 'Ongoing (3-4 hours per session)',
    status: 'completed',
    edition: 1,
    category: 'learning',
    shortDescription: 'Evening sessions for collaborative learning, idea development, and prototype building',
    overview: `Evening Focus Groups provide a dedicated space for students to learn, collaborate, and build together. These sessions create a community of innovators working on various projects while learning from each other.`,
    howToParticipate: [
      'Register for upcoming focus group sessions',
      'Bring your ideas, projects, or learning goals',
      'Participate actively in group discussions',
      'Share your knowledge and learn from others',
      'Commit to regular attendance for best results',
      'Next Series may begin by end of September 2025, stay tuned!'
    ],
    support: [
      'Dedicated workspace and facilities',
      'Access to development tools and resources',
      'Peer learning environment',
      'Occasional expert guest speakers',
      'Project collaboration opportunities'
    ],
    benefits: [
      'Collaborative learning environment',
      'Peer networking and team formation',
      'Regular progress on personal projects',
      'Knowledge sharing across disciplines',
      'Motivation through community support'
    ],
    eligibility: [
      'All VNRVJIET students interested in innovation',
      'Willingness to share and collaborate',
      'Regular evening availability',
      'Respect for collaborative learning principles'
    ],
    contact: {
      email: 'head.iie+event.focus.group@vnrvjiet.in',
      coordinator: 'Head of Innovation, Incubation and Entrepreneurship'
    }
  },
  {
    id: 'monthly-connect-4',
    title: 'Monthly Connect',
    subtitle: 'Startup Progress & Learning Showcase',
    duration: '2-3 hours monthly',
    status: 'active',
    edition: 4,
    category: 'networking',
    shortDescription: 'Monthly gatherings where startups share progress, failures, and learnings',
    overview: `Monthly Connect brings together all startup teams to share their journey - the successes, failures, challenges, and key learnings. This creates a transparent community where everyone learns from collective experiences.`,
    howToParticipate: [
      'Register your startup/project for presentation',
      'Prepare honest updates including challenges faced',
      'Attend monthly sessions as audience member',
      'Engage in Q&A and peer discussions',
      'Follow up on connections made during sessions'
    ],
    support: [
      'Platform to showcase your progress',
      'Community feedback and suggestions',
      'Networking with other entrepreneurs',
      'Learning from others\' experiences',
      'Recognition for achievements and learning'
    ],
    benefits: [
      'Regular accountability and progress tracking',
      'Learning from failures and successes of others',
      'Building presentation and communication skills',
      'Expanding professional network',
      'Motivation through community support'
    ],
    eligibility: [
      'Active startup teams or individual entrepreneurs',
      'Willingness to share both successes and failures',
      'Commitment to constructive feedback culture',
      'Regular participation in monthly sessions'
    ],
    contact: {
      email: 'head.iie+monthly.connect@vnrvjiet.in',
      coordinator: 'Startup Community Manager'
    }
  },
  {
    id: 'peer-reviews',
    title: 'Peer Reviews',
    subtitle: 'Pitch Deck Practice & Feedback Sessions',
    duration: '2-3 hours per session',
    status: 'planned',
    edition: null,
    category: 'training',
    shortDescription: 'Practice pitch presentations and receive feedback from peer teams',
    overview: `Peer Reviews provide a safe environment for teams to practice their pitch decks and receive constructive feedback from other student entrepreneurs. This improves presentation skills and refines business propositions.`,
    howToParticipate: [
      'Submit your pitch deck for review sessions',
      'Sign up as both presenter and reviewer',
      'Attend sessions with prepared feedback frameworks',
      'Give and receive constructive criticism',
      'Iterate on your pitch based on feedback received'
    ],
    support: [
      'Structured feedback frameworks',
      'Peer-to-peer learning environment',
      'Practice presentation opportunities',
      'Constructive criticism culture',
      'Presentation skill development guidance'
    ],
    benefits: [
      'Improved pitch presentation skills',
      'Refined business propositions',
      'Confidence building through practice',
      'Learning from diverse perspectives',
      'Network building with peer entrepreneurs'
    ],
    eligibility: [
      'Teams with business ideas or startups',
      'Willingness to give and receive feedback',
      'Basic pitch deck prepared',
      'Commitment to improvement mindset'
    ],
    contact: {
      email: 'head.iie+peer.reviews@vnrvjiet.in',
      coordinator: 'Presentation Skills Coordinator'
    }
  },
  {
    id: 'tech-trainings-4',
    title: 'Tech Trainings',
    subtitle: 'Skill Development in Emerging Technologies',
    duration: 'Varies (1 day to 1 week)',
    status: 'active',
    edition: 4,
    category: 'training',
    shortDescription: 'Targeted technical training sessions on most needed technologies and skills',
    overview: `Tech Trainings identify and address the most needed technical skills in the startup community. From AI immersion to practical codelabs, these sessions ensure entrepreneurs have the technical foundation needed for their ventures.`,
    howToParticipate: [
      'Participate in skill assessment surveys',
      'Register for relevant training sessions',
      'Attend sessions with laptops and required software',
      'Complete hands-on exercises and projects',
      'Apply learnings to your startup projects'
    ],
    support: [
      'Expert trainers and industry professionals',
      'Hands-on practical exercises',
      'Access to latest tools and platforms',
      'Project-based learning approach',
      'Post-training support and resources'
    ],
    benefits: [
      'Up-to-date technical skills',
      'Practical implementation experience',
      'Industry-relevant knowledge',
      'Enhanced product development capabilities',
      'Technical confidence for startup building'
    ],
    eligibility: [
      'Basic computer literacy',
      'Interest in technical skill development',
      'Commitment to attend full training sessions',
      'Willingness to apply skills in practical projects'
    ],
    contact: {
      email: 'head.iie+tech.trainings@vnrvjiet.in',
      coordinator: 'Technical Skills Coordinator'
    }
  },
  {
    id: 'problem-hunt-3',
    title: 'Problem Hunt',
    subtitle: 'Community-Driven Problem Discovery',
    duration: '1 day event',
    status: 'active',
    edition: 3,
    category: 'event',
    shortDescription: 'Collaborative event to discover, validate, and prioritize real-world problems',
    overview: `Problem Hunt is a community-driven event that brings together students, faculty, and industry professionals to identify, discuss, and prioritize real-world problems worth solving. The best problems get community validation and special recognition.`,
    howToParticipate: [
      'Submit problems you\'ve observed or experienced',
      'Participate in problem validation discussions',
      'Vote and provide feedback on submitted problems',
      'Attend problem presentation sessions',
      'Consider taking on highly-voted problems for solutions'
    ],
    support: [
      'Problem validation frameworks',
      'Community voting and feedback platform',
      'Expert evaluation panels',
      'Problem documentation templates',
      'Special recognition and rewards for best problems'
    ],
    benefits: [
      'Problem identification and validation skills',
      'Community recognition for valuable problems',
      'Potential reward money for solving top problems',
      'Foundation for future innovation projects',
      'Network building with problem validators'
    ],
    eligibility: [
      'All VNRVJIET community members',
      'Real-world problem observation skills',
      'Willingness to engage in community validation',
      'Interest in problem-solution thinking'
    ],
    contact: {
      email: 'head.iie+problem.hunt@vnrvjiet.in',
      coordinator: 'Problem Discovery Lead'
    }
  },
  {
    id: 'idea-jammings',
    title: 'Idea Jammings',
    subtitle: 'Collaborative Solution Brainstorming',
    duration: '4-6 hours per session',
    status: 'planned',
    edition: null,
    category: 'event',
    shortDescription: 'Intensive brainstorming sessions to generate multiple solutions for selected problems',
    overview: `Idea Jammings bring together diverse student groups to brainstorm creative solutions for carefully selected problems. These intensive sessions foster creativity, collaboration, and team formation around promising solution approaches.`,
    howToParticipate: [
      'Register for upcoming jamming sessions',
      'Come prepared with creative thinking mindset',
      'Participate actively in brainstorming activities',
      'Collaborate effectively with diverse team members',
      'Consider joining teams for solution development'
    ],
    support: [
      'Structured brainstorming frameworks',
      'Diverse team formation facilitation',
      'Creative thinking tools and techniques',
      'Problem context and research materials',
      'Team formation and follow-up support'
    ],
    benefits: [
      'Creative problem-solving skills',
      'Collaboration with interdisciplinary teams',
      'Exposure to diverse solution approaches',
      'Potential team formation for future projects',
      'Innovation mindset development'
    ],
    eligibility: [
      'Creative and collaborative mindset',
      'Willingness to work in diverse teams',
      'Active participation in brainstorming',
      'Open to exploring unconventional solutions'
    ],
    contact: {
      email: 'idea.jammings@vnrvjiet.in',
      coordinator: 'Creative Innovation Lead'
    }
  },
  {
    id: 'campus-digitisation',
    title: 'Campus Digitisation',
    subtitle: 'Student-Led Digital Transformation',
    duration: 'Ongoing projects',
    status: 'active',
    edition: null,
    category: 'initiative',
    shortDescription: 'Identify manual campus processes and build digital solutions',
    overview: `Campus Digitisation empowers students to identify manual activities around campus and develop digital solutions to improve efficiency. This initiative promotes practical product development while solving real institutional problems.`,
    howToParticipate: [
      'Identify manual processes that can be digitized',
      'Propose digital solution approaches',
      'Form teams to build proposed solutions',
      'Coordinate with relevant campus departments',
      'Develop and deploy digital solutions'
    ],
    support: [
      'Access to campus stakeholders and departments',
      'Technical development resources',
      'Data centralization guidance',
      'Implementation support from administration',
      'Recognition and potential institutionalization of solutions'
    ],
    benefits: [
      'Real-world product development experience',
      'Direct impact on campus community',
      'Practical problem-solving skills',
      'Portfolio development for future opportunities',
      'Potential for solution scaling beyond campus'
    ],
    eligibility: [
      'Technical development skills or willingness to learn',
      'Understanding of campus processes and challenges',
      'Collaboration skills for working with departments',
      'Commitment to see projects through completion'
    ],
    contact: {
      email: 'campus.digitisation@vnrvjiet.in',
      coordinator: 'Digital Innovation Coordinator'
    }
  }
];

// Helper functions
export const getStartupProgramById = (id: string): StartupProgram | undefined => {
  return startupPrograms.find(program => program.id === id);
};

export const getActivePrograms = (): StartupProgram[] => {
  return startupPrograms.filter(program => program.status === 'active');
};

export const getProgramsByCategory = (category: StartupProgram['category']): StartupProgram[] => {
  return startupPrograms.filter(program => program.category === category);
};

// Success stories helper functions (to be used with successStories.ts)
export const getSuccessStoriesByProgram = (programId: string) => {
  // This will be implemented in successStories.ts
  // Placeholder for consistency
  return [];
};
