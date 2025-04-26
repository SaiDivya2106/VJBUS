import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AppGrid from './components/AppGrid';
import WebView from './components/WebView';
import LoginModal from './components/LoginModal'; // Assuming LoginModal is in components
import { AuthProvider, useAuth } from './components/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleAppClick = (url: string, authRequired: boolean) => {
    setSelectedUrl(url);
    setRequiresAuth(authRequired);
    if (authRequired && !isAuthenticated) {
      setIsModalOpen(true); // Show login modal if auth is required and user isn’t logged in
    }
  };

  const handleBack = () => {
    setSelectedUrl(null);
    setRequiresAuth(false);
  };

  const handleLogin = (username: string, email: string, picture?: string) => {
    console.log('Logged in:', { username, email, picture });
    setIsModalOpen(false);
    if (selectedUrl && requiresAuth) {
      // Refresh WebView after login if it requires auth
      setSelectedUrl(null);
      setTimeout(() => setSelectedUrl(selectedUrl), 100);
    }
  };

  // Listen for login/logout events to update embedded websites
  useEffect(() => {
    const handleAuthChange = () => {
      if (selectedUrl && requiresAuth && !isAuthenticated) {
        setIsModalOpen(true); // Show login modal if logged out and auth is required
      } else if (selectedUrl) {
        // Refresh WebView on auth change
        setSelectedUrl(null);
        setTimeout(() => setSelectedUrl(selectedUrl), 100);
      }
    };

    // Custom event for login/logout actions
    window.addEventListener('loginStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('loginStateChanged', handleAuthChange);
    };
  }, [selectedUrl, requiresAuth, isAuthenticated]);

  // Trigger custom event on auth change
  useEffect(() => {
    window.dispatchEvent(new Event('loginStateChanged'));
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isModalOpen && (
          <LoginModal onClose={() => setIsModalOpen(false)} onLogin={handleLogin} />
        )}
        {selectedUrl ? (
          <WebView url={selectedUrl} onBack={handleBack} />
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-indigo-800 mb-2">
                All College Services in One Place
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Access all VNRVJIET services with a single click. No more searching for different
                portals.
              </p>
            </div>
            <AppGrid onAppClick={handleAppClick} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;