import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, ExternalLink, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./context/AuthContext.tsx"; // ✅ Import hook

const apps = [
  {
    id: "bus-tracking",
    name: "Bus Tracking",
    description: "Track college buses in real-time",
    url: "https://bus.vjstartup.com/"
  },
  {
    id: "complaints",
    name: "Complaints",
    description: "Register complaints and grievances",
    url: "https://complaints.vjstartup.com/"
  },
  {
    id: "fake-news",
    name: "Fake News Check",
    description: "Fake message verification",
    url: "https://wall.vjstartup.com/"
  },
  {
    id: "projects",
    name: "Projects App",
    description: "Manage Projects life cycle",
    url: "https://projecthub.vjstartup.com/"
  },
  {
    id: "open-house",
    name: "Open House",
    description: "Explore working projects through demos",
    url: "https://openhouse.vjstartup.com/"
  },
  {
    id: "easyfind",
    name: "EasyFind",
    description: "Find your lost items here.",
    url: "https://easyfind.vjstartup.com/"
  },
  {
    id: "student-activity",
    name: "Student Activity",
    description: "Generate Resume based on activity",
    url: "https://activity.vjstartup.com/"
  }
];

const AppView = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, login, logout } = useAuth(); // ✅ Use hook inside the component

  const app = apps.find(a => a.id === appId);

  if (!app) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">App Not Found</h1>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const openInNewTab = () => {
    window.open(app.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800">{app.name}</h1>
              <p className="text-sm text-gray-600">{app.description}</p>
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              onClick={openInNewTab}
              variant="outline"
              className="bg-white/90 text-gray-700 hover:bg-gray-50 border border-gray-300 flex items-center gap-2 shadow-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>

            {isAuthenticated ? (
              <Button onClick={logout} className="text-sm px-3 py-1">
                Logout
              </Button>
            ) : (
              <Button onClick={login} className="text-sm px-3 py-1">
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 flex flex-col gap-2 sm:hidden">
            <div className="text-base font-semibold text-gray-800">{app.name}</div>
            <div className="text-sm text-gray-600 mb-2">{app.description}</div>
            <Button
              onClick={openInNewTab}
              variant="outline"
              className="text-gray-700 border border-gray-300 flex items-center gap-2 shadow-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>
            {isAuthenticated ? (
              <Button onClick={logout} className="text-gray-800 border border-gray-300 flex items-center gap-2 shadow-sm">
                Logout
              </Button>
            ) : (
              <Button onClick={login} className="text-gray-800 border border-gray-300 flex items-center gap-2 shadow-sm">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto h-full">
          <div className="h-full rounded-lg overflow-hidden border border-gray-200 bg-white shadow-lg">
            <iframe
              src={app.url}
              className="w-full h-full"
              title={app.name}
              frameBorder="0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppView;
