export interface Problem {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  image: string;
  author: string;
  date: string;
  upvotes: number;
  comments: number;
  tags: string[];
  background: string;
  scalability: string;
  marketSize: string;
  competitors: string[];
  currentGaps: string;
}

export interface Idea {
  id: string;
  problemId: string;
  title: string;
  description: string;
  team: TeamMember[];
  stage: number; // 1-9
  upvotes: number;
  downvotes: number;
  comments: number;
  mentor?: string;
  attachments: string[];
  contact: string;
}

export interface Startup {
  id: string;
  name: string;
  description: string;
  team: TeamMember[];
  stage: number;
  fundingStatus: string;
  schemes: string[];
  upvotes: number;
  milestones: Milestone[];
  onePager?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface Milestone {
  title: string;
  date: string;
  completed: boolean;
}

export const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Campus Food Waste Management",
    excerpt: "College cafeterias waste tons of food daily while students struggle with meal costs",
    description: "Every day, college cafeterias across the country throw away massive amounts of perfectly good food while many students face food insecurity. This problem represents a massive opportunity to address both environmental sustainability and student welfare simultaneously. Current cafeteria operations lack efficient systems to redistribute surplus food, creating a dual crisis of waste and hunger on campus.",
    image: "food-waste-problem.jpg",
    author: "Sarah Chen",
    date: "2024-01-15",
    upvotes: 147,
    comments: 23,
    tags: ["Sustainability", "Food", "Campus Life"],
    background: "Studies show that college cafeterias waste 22% of food purchased, while 39% of students experience food insecurity.",
    scalability: "Applicable to 4,000+ colleges nationwide with immediate implementation potential",
    marketSize: "$2.3B annual food waste in higher education",
    competitors: ["Food Recovery Network", "Copia", "Imperfect Foods"],
    currentGaps: "Existing solutions lack real-time tracking and student-cafeteria integration"
  },
  {
    id: "2", 
    title: "Mental Health Support Accessibility",
    excerpt: "Limited counseling resources create massive wait times for student mental health support",
    description: "College counseling centers are overwhelmed, with average wait times of 2-3 weeks for appointments. The mental health crisis among college students has reached unprecedented levels, yet traditional support systems remain inadequate. Students facing acute mental health challenges often go without timely intervention, leading to academic failure, withdrawal, and in severe cases, self-harm. The gap between demand and available resources continues to widen each semester.",
    image: "mental-health-problem.jpg",
    author: "Marcus Johnson",
    date: "2024-01-12",
    upvotes: 203,
    comments: 41,
    tags: ["Mental Health", "Student Support", "Healthcare"],
    background: "1 in 3 college students experience significant mental distress, but only 34% seek help due to accessibility barriers.",
    scalability: "Expandable to all higher education institutions globally",
    marketSize: "$240M market for college mental health services",
    competitors: ["BetterHelp", "Talkspace", "CAPS services"],
    currentGaps: "No 24/7 peer support networks integrated with professional services"
  },
  {
    id: "3",
    title: "Textbook Cost Crisis", 
    excerpt: "Students pay thousands for textbooks they use for one semester",
    description: "The average student spends $1,240 annually on textbooks, creating financial barriers to education. This unsustainable cost structure forces students to choose between buying required materials and meeting basic needs like food and housing. Many students resort to sharing books, using outdated editions, or going without, directly impacting their academic performance and future career prospects.",
    image: "textbook-cost-problem.jpg",
    author: "Alex Rivera",
    date: "2024-01-10",
    upvotes: 89,
    comments: 15,
    tags: ["Education", "Finance", "Resources"],
    background: "Textbook costs have increased 812% since 1980, far outpacing inflation and tuition increases.",
    scalability: "Every college student globally faces this issue - 20M+ in US alone",
    marketSize: "$5B annual textbook market in higher education",
    competitors: ["Chegg", "VitalSource", "Pearson"],
    currentGaps: "Limited peer-to-peer sharing platforms with quality assurance"
  }
];

export const mockIdeas: Idea[] = [
  {
    id: "1",
    problemId: "1",
    title: "FoodShare Campus",
    description: "AI-powered platform connecting cafeterias with students for discounted surplus food pickup",
    team: [
      { name: "Emma Wilson", role: "CEO & Developer", avatar: "/api/placeholder/64/64" },
      { name: "David Park", role: "CTO", avatar: "/api/placeholder/64/64" },
      { name: "Lisa Zhang", role: "Operations", avatar: "/api/placeholder/64/64" }
    ],
    stage: 4,
    upvotes: 87,
    downvotes: 3,
    comments: 12,
    mentor: "Prof. Susan Miller - Sustainability",
    attachments: ["prototype-demo.mp4", "business-plan.pdf"],
    contact: "emma.wilson@student.edu"
  },
  {
    id: "2", 
    problemId: "2",
    title: "MindBridge Peer Network",
    description: "24/7 peer support platform with trained student counselors and crisis intervention",
    team: [
      { name: "Jordan Smith", role: "Founder", avatar: "/api/placeholder/64/64" },
      { name: "Priya Patel", role: "Psychology Lead", avatar: "/api/placeholder/64/64" }
    ],
    stage: 6,
    upvotes: 142,
    downvotes: 7,
    comments: 28,
    mentor: "Dr. Rachel Green - Clinical Psychology",
    attachments: ["pilot-results.pdf", "user-testimonials.pdf"],
    contact: "jordan.smith@student.edu"
  }
];

export const mockStartups: Startup[] = [
  {
    id: "1",
    name: "StudySpace",
    description: "AI-powered study room booking and collaborative learning platform that revolutionizes campus study environments",
    team: [
      { name: "Michael Chen", role: "CEO", avatar: "/api/placeholder/64/64" },
      { name: "Sofia Rodriguez", role: "CTO", avatar: "/api/placeholder/64/64" },
      { name: "James Kim", role: "Head of Product", avatar: "/api/placeholder/64/64" }
    ],
    stage: 8,
    fundingStatus: "Series A - $2.3M raised",
    schemes: ["University Innovation Grant", "Tech Stars Accelerator"],
    upvotes: 234,
    milestones: [
      { title: "MVP Launch", date: "2023-09-15", completed: true },
      { title: "First 1000 Users", date: "2023-11-30", completed: true },
      { title: "University Partnerships", date: "2024-02-15", completed: true },
      { title: "Series A Funding", date: "2024-06-01", completed: true }
    ],
    onePager: "studyspace-onepager.pdf"
  },
  {
    id: "2",
    name: "EcoTrack Campus",
    description: "Sustainability tracking and carbon footprint reduction platform designed specifically for college campuses worldwide",
    team: [
      { name: "Taylor Johnson", role: "CEO", avatar: "/api/placeholder/64/64" },
      { name: "Arjun Kapoor", role: "Environmental Engineer", avatar: "/api/placeholder/64/64" }
    ],
    stage: 5,
    fundingStatus: "Seed Round - $500K raised",
    schemes: ["Green Innovation Fund", "Climate Action Accelerator"],
    upvotes: 156,
    milestones: [
      { title: "Pilot Program", date: "2024-01-30", completed: true },
      { title: "3 Campus Deployments", date: "2024-04-15", completed: true },
      { title: "Seed Funding", date: "2024-07-01", completed: true }
    ]
  }
];

// Mock comments data
export const mockComments = [
  {
    id: "1",
    author: "Sarah Johnson",
    avatar: "/api/placeholder/32/32",
    content: "This is exactly what our campus needs! The food waste problem is so real and visible every day.",
    timestamp: "2 hours ago",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: "1-1",
        author: "Mike Chen",
        avatar: "/api/placeholder/32/32",
        content: "Totally agree! We should also consider partnerships with local food banks.",
        timestamp: "1 hour ago",
        likes: 5,
        isLiked: true,
      }
    ]
  },
  {
    id: "2",
    author: "Alex Rivera",
    avatar: "/api/placeholder/32/32",
    content: "Have you considered the logistical challenges of food pickup timing? Students have unpredictable schedules.",
    timestamp: "4 hours ago",
    likes: 8,
    isLiked: false,
  },
  {
    id: "3",
    author: "Emma Davis",
    avatar: "/api/placeholder/32/32",
    content: "This could work great with a mobile app for real-time notifications!",
    timestamp: "6 hours ago",
    likes: 15,
    isLiked: true,
  }
];

export const stageLabels = [
  "Ideation",
  "Research", 
  "Validation",
  "Prototype",
  "Testing",
  "Launch Prep",
  "MVP Launch",
  "Growth",
  "Scale/Exit"
];

export const counters = {
  startups: 36,
  students: 88, 
  funded: 9
};