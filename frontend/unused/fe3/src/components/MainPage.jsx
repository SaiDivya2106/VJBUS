import React, { useState, useEffect, useRef } from 'react';
import './MainPage.css';
import Loader from './Loader';
import Form from './Form';
import { useSelector } from 'react-redux';
import Header from './Header';
import Card from './Card';
import OpenCloseButton from '../external/OpenCloseButton';
import Update_App from './Update_App';

function MainPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const iframeRef = useRef(null);
  const [appNames, setAppNames] = useState([]);
  const [user, setUser] = useState(null);
  const [iframeSrc, setIframeSrc] = useState('');
  const {token}=useSelector(state=>state.auth);
  const { ApplicationsData } = useSelector(state => state.applications);
  useEffect(() => {
    fetch("http://campus.vnrzone.site/sa-be/api/user", {
        method:"GET",
        credentials: 'include'  
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Unauthorized');
        }
        return response.json();
    })
    .then(data => {
        if (data.user) {
            setUser(data.user);  
        }
    })
    .catch(err => console.log('Error fetching user data:', err));
}, []);


  const handleLogout = () => {
    fetch("http://campus.vnrzone.site/sa-be/logout", {
        method: 'GET',
        credentials: 'include'  
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = "http://campus.vnrzone.site";  
    })
    .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    if (ApplicationsData.length > 0) {
      const names = ApplicationsData.map(app => app.appName);
      setAppNames(names);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [ApplicationsData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    performSearch(search);
  };

  const performSearch = (query) => {
    if (query.length > 0) {
      setLoading(true);
      const filteredResults = appNames
        .filter(item => item.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
          const queryLower = query.toLowerCase();
          const aLower = a.toLowerCase();
          const bLower = b.toLowerCase();

          const aStarts = aLower.startsWith(queryLower);
          const bStarts = bLower.startsWith(queryLower);

          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;

          return a.localeCompare(b);
        });

      setResults(filteredResults);
      setLoading(false);
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(search);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          const links = iframeDocument.querySelectorAll('a[target="_blank"]');

          links.forEach(link => {
            link.removeAttribute('target');
            link.addEventListener('click', (e) => {
              e.preventDefault();
              setIframeSrc(link.href);
            });
          });
        } catch (error) {
          console.error("Unable to modify iframe content due to cross-origin restrictions.", error);
        }
      };
    }
  }, [iframeSrc]);

  const handleAppClick = (appName) => {
    if (user) {
      const selectedApp = ApplicationsData.find(app => app.appName === appName);
      
      if (selectedApp && selectedApp.url) {
        setIframeSrc(selectedApp.url);  
        setShowIframe(true);            
        setSideMenuOpen(false);
        setLoading(true); 
        setSearch('');        
      } else {
        alert('Application URL not found.');
      }
    } else {
      alert('Please login to access the application.');
      setShowIframe(true); 
      setSearch('');       
    }
  };
  const handleIframeLoad = () => {
    setLoading(false); 
  };

  return (
    <div className='whole'>
      <Header />
      <header>
        <OpenCloseButton toggleSideMenu={() => setSideMenuOpen(!sideMenuOpen)} sideMenuOpen={sideMenuOpen} />
        {user ? (
          <div className="user-info">
            <div className="headline">
              {user.avatar && <img src={user.avatar} alt="User Avatar" className="profile" />}
              <p className={user.avatar ? 'username-with-avatar' : 'username-no-avatar'}>
                {user.username}..!
              </p>
            </div>

            <button className="btn-17" onClick={handleLogout}>
              <span className="text-container">
                <span className="text">Logout</span>
              </span>
            </button>
          </div>
        ) : (
          <button className="btn-17" onClick={() => setShowIframe(true)}>
            <span className="text-container">
              <span className="text">Login</span>
            </span>
          </button>
        )}
      </header>

      {sideMenuOpen && (
        <div className="side-menu">
          <h1>Applications..</h1>
          <ul>
            {appNames.length > 0 ? (
              appNames.map((name, index) => (
                <li key={index} onClick={() => handleAppClick(name)}>{name}</li>
              ))
            ) : (
              <p className="not-found">No Applications Found..!</p>
            )}
            {user ? (
              <li onClick={handleLogout}>Logout</li>  
            ) : (
              <li onClick={() => setShowIframe(true)}>Login</li>
            )}
          </ul>
        </div>
      )}

      <main>
        <h1>VJ Campus Apps</h1>
        <form onSubmit={handleSubmit}>
          <div className="group">
            <svg className={`icon ${showIframe ? 'search-move' : ''}`} aria-hidden="true" viewBox="0 0 24 24">
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </svg>
            <input
              placeholder="Search Applications.."
              id="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setLoading(true);  
              }}
              type="search"
              className={`input ${showIframe ? 'move-to-top' : ''}`}
            />
          </div>
          <p className={`search2 ${search.length === 0 ? 'disabled' : ''} ${showIframe ? 'searchtex-move' : ''}`}>
        Search..
          </p>
        </form>
      </main>

      <div className="results">
  {loading ? (
    <Loader />
  ) : results.length > 0 ? (
    results.map((result, index) => (
      <Card 
        key={index} 
        appName={result} 
        className="card_col" 
        onClick={() => handleAppClick(result)}  
      />
    ))
  ) : (
    search && <p className="no-results">No Applications found...</p>
  )}
</div>


      {showIframe && (
        <div className="iframe-container" ref={iframeRef}>
          {iframeSrc ? (
            <iframe src={iframeSrc} title="Application Iframe" width="100%" height="100%" />
          ) : (
            <Form closeForm={() => setShowIframe(false)} />
          )}
        </div>
      )}
    </div>
  );
}

export default MainPage;

