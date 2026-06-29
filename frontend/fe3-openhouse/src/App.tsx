import { useState, useEffect } from 'react';
import { Route, Routes, useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, PlayCircle, ThumbsUp, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import ProjectModal from './components/ProjectModal';
import Navbar from './components/Navbar';
import { Project } from './types';
import MyProjects from './components/MyProjects';
import Upload from './components/Upload';
import ProjectView from './components/ProjectView';
import Dashboard from './components/Dashboard';
import './App.css';
import bgImage from './images/12.png'; // adjust the path if you're in a subfolder



declare global {
  interface Window {
    google: any;
  }
}

const API_URL = `${import.meta.env.VITE_API_URL || ''}`;
// Shuffle function
// const shuffleArray = (array: Project[]): Project[] => {
//   return [...array].sort(() => Math.random() - 0.5);
// };

// Randomize the order



export interface User {
  name: string;
  email: string;
  picture: string;
}


// SSO: Always check auth-server for user state
async function fetchUserFromAuthServer(): Promise<User | null> {
  try {
    const res = await fetch(`${import.meta.env.VITE_AUTH_SERVER_URL || ''}/check-auth`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.logged_in && data.user) {
      return data.user;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch user from auth-server:', err);
    return null;
  }
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Track selected project for modal
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(['OpenHouse2026']));
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const pageSize = 30;

  // SSO: On mount, check auth-server for user
  useEffect(() => {
    fetchUserFromAuthServer().then(setUser);
  }, []);

  // useEffect(() => {
  //   const handleMessage = async (event: MessageEvent) => {
  //     // security check
  //     if (event.origin !== window.location.origin) return;

  //     if (event.data?.type === "AUTH_UPDATED") {
  //       await fetchUserFromAuthServer();
  //       setUser(event.data.user)
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);
  //   return () => window.removeEventListener("message", handleMessage);
  // }, []);

  useEffect(() => {
    if (user) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
          width: 250,
        }
      );
    };
  }, [user]);

  // Metadata fetch (all unique tags and departments for filters)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`);
        const data = await response.json();
        const rawProjects = data.projects || data;
        const allTags = new Set<string>();
        const allDepts = new Set<string>();
        rawProjects.forEach((item: any) => {
          if (item.tags) {
            item.tags.split(',').forEach((tag: string) => allTags.add(tag.trim()));
          }
          if (item.department) allDepts.add(item.department);
        });
        setTags(Array.from(allTags));
        setDepartments(Array.from(allDepts));
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  // Main projects fetch (paginated and filtered)
  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        const tagParams = Array.from(selectedTags).map(t => `tags=${encodeURIComponent(t)}`).join('&');
        const deptParams = Array.from(selectedDepartments).map(d => `department=${encodeURIComponent(d)}`).join('&');
        const url = `${API_URL}/projects?page=${currentPage}&limit=${pageSize}&${tagParams}&${deptParams}`;

        const response = await fetch(url);
        const data = await response.json();
        const rawProjects = data.projects || [];

        const formatted = rawProjects.map((item: any) => ({
          id: item.id,
          title: item.title,
          abstract: item.abstract,
          techStack: item.domain ? item.domain.split(',').map((s: string) => s.trim()) : [],
          tags: item.tags ? item.tags.split(',').map((tag: string) => tag.trim()) : [],
          thumbnail: item.cover_poster ? `${API_URL}/uploads/${item.cover_poster}` : 'https://via.placeholder.com/500x300?text=No+Cover',
          images: [
            item.cover_poster ? `${API_URL}/uploads/${item.cover_poster}` : 'https://via.placeholder.com/800x500?text=No+Cover',
            item.result ? `${API_URL}/uploads/${item.result}` : 'https://via.placeholder.com/800x500?text=No+Result',
            item.methodology ? `${API_URL}/uploads/${item.methodology}` : 'https://via.placeholder.com/800x500?text=No+Methodology'
          ],
          demoUrl: item.drive_link || '#',
          drive_link: item.drive_link,
          likes: item.aggr_upvote_count || 0,
          comments: item.aggr_comment_count || 0,
          aggr_upvote_count: item.aggr_upvote_count,
          aggr_comment_count: item.aggr_comment_count,
          department: item.department || 'General',
          team: item.team_details || '',
          mentor: item.mentor_name || '',
          isSoftware: item.is_software === 'true',
          startupPotential: item.startup_potential || '',
          uploadedBy: item.user_name || '',
          pdfPoster: item.pdf_poster ? `${API_URL}/uploads/${item.pdf_poster}` : null
        }));

        setProjects(formatted);
        setTotalProjects(data.total || rawProjects.length);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [user, currentPage, selectedTags, selectedDepartments]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTags, selectedDepartments]);

  // Redundant toggle handlers removed

  const handleGoogleResponse = async (response: any) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_AUTH_SERVER_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // VERY IMPORTANT for cookies
          body: JSON.stringify({
            token: response.credential,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Auth failed:", data);
        return;
      }

      console.log("✅ Logged in:", data.user);

      // set user in frontend
      setUser(data.user);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };


  // Redundant toggle handlers removed

  const navigate = useNavigate();

  const finalProjects = projects;

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Optional dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Transparent Glassmorphism Card */}
        <div className="relative bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 max-w-md w-full text-center border border-white/30">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Project Explorer
          </h1>
          <p className="text-white mb-6">
            Login with your Google account to explore exciting student projects
          </p>

          {/* Center the Google button */}
          <div className="flex justify-center">
            <div id="google-login-button" />
          </div>
        </div>
      </div>


    );
  }

  // handleLike was here

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      <Navbar currentRoute="projects" user={user} setUser={setUser} onGoogleCredentialResponse={() => { }} />

      <Routes>
        <Route path="/myprojects" element={<MyProjects user={user} />} />
        <Route path="/upload" element={<Upload user={user} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectView user={user} setUser={setUser} />} />
        <Route path="/" element={<Home projects={projects} setSelectedProject={setSelectedProject} filteredProjects={finalProjects} setSelectedTags={setSelectedTags} selectedTags={selectedTags} setSelectedDepartments={setSelectedDepartments} selectedDepartments={selectedDepartments} isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} departments={departments} tags={tags} currentPage={currentPage} setCurrentPage={setCurrentPage} totalProjects={totalProjects} pageSize={pageSize} />} />
      </Routes>

      {selectedProject && (
        <ProjectModal user={user} project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}

// Separate Home component to handle deep-linking and main view
function Home({
  projects, setSelectedProject, filteredProjects,
  setSelectedTags, selectedTags, setSelectedDepartments, selectedDepartments,
  isFilterOpen, setIsFilterOpen,
  departments, tags, currentPage, setCurrentPage, totalProjects, pageSize
}: any) {
  // Deep-linking logic removed to favor dedicated ProjectView route

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev: Set<string>) => {
      const newTags = new Set(prev);
      newTags.has(tag) ? newTags.delete(tag) : newTags.add(tag);
      return newTags;
    });
  };

  const handleDepartmentToggle = (department: string) => {
    setSelectedDepartments((prev: Set<string>) => {
      const newDepartments = new Set(prev);
      newDepartments.has(department)
        ? newDepartments.delete(department)
        : newDepartments.add(department);
      return newDepartments;
    });
  };

  const totalPages = Math.ceil(totalProjects / pageSize);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Filter Toggle */}
      <div className="relative mb-8">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full bg-white rounded-xl shadow-lg p-4 flex items-center justify-between border"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-2 rounded-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Filter Projects</span>
            {(selectedTags.size > 0 || selectedDepartments.size > 0) && (
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm">
                  {selectedTags.size + selectedDepartments.size} selected
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTags(new Set());
                    setSelectedDepartments(new Set());
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium logout-button logout-mobile mb-4"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          {isFilterOpen ? <ChevronUp /> : <ChevronDown />}
        </button>

        <div className={`absolute w-full bg-white rounded-xl shadow-xl mt-2 p-4 border transition-all duration-300 z-10 ${isFilterOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Departments</h3>
              <div className="flex flex-wrap gap-2">
                {departments.map((department: string) => (
                  <button
                    key={department}
                    onClick={() => handleDepartmentToggle(department)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedDepartments.has(department) ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md scale-105' : 'bg-gradient-to-r from-purple-50 to-indigo-50 text-gray-800 hover:from-purple-100 hover:to-indigo-100'}`}
                  >
                    {department}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 30).map((tag: string) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedTags.has(tag) ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md scale-105' : 'bg-gradient-to-r from-emerald-50 to-cyan-50 text-gray-800 hover:from-emerald-100 hover:to-cyan-100'}`}
                  >
                    {tag}
                  </button>
                ))}
                {/* show more button */}
                {/* {tags.length > 100 && (
                  <button
                    onClick={() => {
                      setSelectedTags(new Set(tags));
                    }}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md scale-105"
                  >
                    Show More
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Empty State */}
      {
        filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-10 w-10 text-emerald-500 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No projects matching the filter</h3>
            <p className="text-gray-500">Try clearing your filters to see more projects.</p>
            <button
              onClick={() => {
                setSelectedTags(new Set());
                setSelectedDepartments(new Set());
              }}
              className="mt-6 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        )
      }

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project: Project) => (
          <div key={project.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl border">
            <div onClick={() => setSelectedProject(project)} className="relative cursor-pointer h-48 overflow-hidden">
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm">{project.department}</div>
            </div>
            <div className="p-4">
              <div onClick={() => setSelectedProject(project)} className="cursor-pointer hover:text-emerald-600 transition-colors">
                <h3 className="text-xl font-semibold">{project.title}</h3>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{project.abstract}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 text-white shadow"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MessageCircle size={18} />
                    <span className="text-sm">{project.aggr_comment_count || 0}</span>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-600">
                    <ThumbsUp size={18} />
                    <span className="text-sm">{project.aggr_upvote_count || 0}</span>
                  </div>
                </div>
                <a href={project.drive_link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800">
                  <PlayCircle size={18} />
                  <span className="text-sm">View</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {
        totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-10 h-10 rounded-lg border font-semibold transition ${currentPage === p ? 'bg-emerald-600 text-white border-emerald-600' : 'hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalProjects)} of {totalProjects} projects
            </p>
          </div>
        )
      }
    </main >
  );
}

export default App;