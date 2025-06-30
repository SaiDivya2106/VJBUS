import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';

interface WebViewProps {
  url: string;
  onBack: () => void;
}

const WebView: React.FC<WebViewProps> = ({ url, onBack }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(!isAuthenticated);
  

  useEffect(() => {
    if (!isAuthenticated) return;

    const targetOrigin = new URL(url).origin;

    const sendAuthToIframe = () => {
        if (!iframeRef.current?.contentWindow || !isAuthenticated) return;


        const { user } = useAuth(); // From context


        iframeRef.current.contentWindow.postMessage({
            type: 'AUTH_DATA',
            data: {
                ...user,
                userToken,
                isAuthenticated: true
            }
        }, targetOrigin);
    };

    const handleIframeLoad = () => {
        setIframeLoaded(true);
        sendAuthToIframe();
    };

    iframeRef.current?.addEventListener('load', handleIframeLoad);

    return () => {
        iframeRef.current?.removeEventListener('load', handleIframeLoad);
    };
}, [url, isAuthenticated]);


  const handleClosePrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleLoginRedirect = () => {
    window.location.href = 'https://auth.vjstartup.com/login';  // Redirect to SSO login page
};


  return (
    <div className="space-y-4">
      {showLoginPrompt && !isAuthenticated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-lg mb-4">
              You can only view this content if you log in to the parent application.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClosePrompt}
                className="text-gray-600 hover:text-gray-800 px-4 py-2"
              >
                Close
              </button>
              <button
                onClick={handleLoginRedirect}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Apps</span>
        </button>
        <div className="flex-1 bg-white rounded-lg overflow-hidden shadow px-4 py-2 truncate flex items-center">
          <span className="text-gray-500 flex-1 truncate">{url}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden h-[calc(100vh-100px)] min-h-[700px]">
          <iframe
            ref={iframeRef}
            src={url}
            title="Web Content"
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden h-[calc(100vh-100px)] min-h-[700px] flex items-center justify-center">
          <p className="text-lg text-gray-700">Please log in to view the content.</p>
        </div>
      )}
    </div>
  );
};

export default WebView;