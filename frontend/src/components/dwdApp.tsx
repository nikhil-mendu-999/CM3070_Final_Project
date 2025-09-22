import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Profiles from './components/Profiles';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.');
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      // Robustly extract sub as string, convert to number
      if (decoded && decoded.sub) {
        setUserId(Number(decoded.sub));
      } else {
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, [token]);

  if (!token || !userId) {
    return <Login onLoginSuccess={setToken} />;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <button onClick={() => setToken(null)} style={{ marginBottom: 20 }}>
        Logout
      </button>
      <Profiles token={token} userId={userId} />
    </div>
  );
};

export default App;
