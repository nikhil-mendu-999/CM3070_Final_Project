import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import ConsentDialog from './components/ConsentDialog';
import EditProfile from './components/EditProfile';
import Dashboard from './components/Dashboard';
import { isAdminUser } from './components/isAdminUser';
import { Button } from '@mui/material';
import theme from './theme';

// Utility: Parse JWT for userId
function parseJwt(token) {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const payload = atob(base64);
    return JSON.parse(payload);
  } catch (err) {
    console.error("JWT parse error:", err);
    return null;
  }
}

// OIDC consent flow query parameters
function getOIDCConsentParams() {
  const params = new URLSearchParams(window.location.search);
  return params.get('client_id') && params.get('redirect_uri')
    ? {
        clientId: params.get('client_id'),
        redirectUri: params.get('redirect_uri'),
        scope: params.get('scope') || '',
        state: params.get('state') || '',
      }
    : null;
}

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [view, setView] = useState("landing");
  const mainContentRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
      localStorage.setItem("jwt", urlToken);
      window.history.replaceState({}, '', window.location.pathname + window.location.search);
    } else {
      const stored = localStorage.getItem("jwt");
      if (stored) setToken(stored);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.sub && !isNaN(Number(decoded.sub))) {
        setUserId(Number(decoded.sub));
      } else setUserId(null);
    } else {
      setUserId(null);
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("jwt");
    setView("landing");
  };

  const consentParams = getOIDCConsentParams();

  if (consentParams && (!token || !userId)) {
    const currentPath = window.location.pathname + window.location.search;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Login
          onLoginSuccess={(tok) => {
            setToken(tok);
            localStorage.setItem("jwt", tok);
            window.location.replace(currentPath);
          }}
          onShowSignup={() => setView("signup")}
        />
        <style>
          {`
          .skip-link {
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
          }
          .skip-link:focus {
            left: 16px;
            top: 16px;
            width: auto;
            height: auto;
            padding: 8px 16px;
            background: #1A233A;
            color: #FFD166;
            font-weight: bold;
            z-index: 1000;
            border-radius: 5px;
          }
        `}
        </style>
      </ThemeProvider>
    );
  }

  if (consentParams && token && userId) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConsentDialog
          clientId={consentParams.clientId}
          redirectUri={consentParams.redirectUri}
          scope={consentParams.scope}
          state={consentParams.state}
          token={token}
          onLoginNeeded={handleLogout}
        />
      </ThemeProvider>
    );
  }

  if (!token || !userId) {
    if (view === "landing") {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <LandingPage
            onShowSignup={() => setView("signup")}
            onShowLogin={() => setView("login")}
          />
          <style>
            {`
            .skip-link {
              position: absolute;
              left: -10000px;
              top: auto;
              width: 1px;
              height: 1px;
              overflow: hidden;
            }
            .skip-link:focus {
              left: 16px;
              top: 16px;
              width: auto;
              height: auto;
              padding: 8px 16px;
              background: #1A233A;
              color: #FFD166;
              font-weight: bold;
              z-index: 1000;
              border-radius: 5px;
            }
          `}
          </style>
        </ThemeProvider>
      );
    }
    if (view === "signup") {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Signup onSignupSuccess={() => setView("login")} />
          <Button onClick={() => setView("login")} sx={{ mt: 3 }}>
            Back to Login
          </Button>
          <style>
            {`
            .skip-link {
              position: absolute;
              left: -10000px;
              top: auto;
              width: 1px;
              height: 1px;
              overflow: hidden;
            }
            .skip-link:focus {
              left: 16px;
              top: 16px;
              width: auto;
              height: auto;
              padding: 8px 16px;
              background: #1A233A;
              color: #FFD166;
              font-weight: bold;
              z-index: 1000;
              border-radius: 5px;
            }
          `}
          </style>
        </ThemeProvider>
      );
    }
    if (view === "login") {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Login
            onLoginSuccess={(tok) => {
              setToken(tok);
              localStorage.setItem("jwt", tok);
            }}
            onShowSignup={() => setView("signup")}
          />
          <Button
            onClick={() => setView("signup")}
            sx={{ display: "block", mx: "auto", mt: 4, fontWeight: 700 }}
            size="large"
          >
            Create Account
          </Button>
          <style>
            {`
            .skip-link {
              position: absolute;
              left: -10000px;
              top: auto;
              width: 1px;
              height: 1px;
              overflow: hidden;
            }
            .skip-link:focus {
              left: 16px;
              top: 16px;
              width: auto;
              height: auto;
              padding: 8px 16px;
              background: #1A233A;
              color: #FFD166;
              font-weight: bold;
              z-index: 1000;
              border-radius: 5px;
            }
          `}
          </style>
        </ThemeProvider>
      );
    }
  }

  if (editingProfileId !== null) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <EditProfile
          token={token}
          userId={userId}
          profileId={editingProfileId}
          onSaved={() => setEditingProfileId(null)}
        />
        <Button onClick={() => setEditingProfileId(null)} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
        <Button onClick={handleLogout} color="error" sx={{ float: 'right', mt: 2 }}>
          Logout
        </Button>
        <style>
          {`
          .skip-link {
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
          }
          .skip-link:focus {
            left: 16px;
            top: 16px;
            width: auto;
            height: auto;
            padding: 8px 16px;
            background: #1A233A;
            color: #FFD166;
            font-weight: bold;
            z-index: 1000;
            border-radius: 5px;
          }
        `}
        </style>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" ref={mainContentRef} tabIndex={-1} aria-label="Main dashboard area">
        <Dashboard
          token={token}
          userId={userId}
          onLogout={handleLogout}
          onEditProfile={setEditingProfileId}
        />
      </main>
      <style>
        {`
        .skip-link {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        .skip-link:focus {
          left: 16px;
          top: 16px;
          width: auto;
          height: auto;
          padding: 8px 16px;
          background: #1A233A;
          color: #FFD166;
          font-weight: bold;
          z-index: 1000;
          border-radius: 5px;
        }
      `}
      </style>
    </ThemeProvider>
  );
};

export default App;
