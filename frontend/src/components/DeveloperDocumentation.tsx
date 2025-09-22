import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Accordion, AccordionSummary, 
  AccordionDetails, Alert, Button, Divider, List, ListItem, 
  ListItemIcon, ListItemText, Paper, Grid, Chip, Stack, Tab, Tabs
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import ApiIcon from '@mui/icons-material/Api';
import SecurityIcon from '@mui/icons-material/Security';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CodeBlock = ({ children, language = "javascript" }) => (
  <Paper 
    sx={{ 
      p: 3, 
      bgcolor: '#1e1e1e', 
      color: '#d4d4d4', 
      borderRadius: 2, 
      fontFamily: 'Monaco, "Courier New", monospace',
      fontSize: '0.875rem',
      overflow: 'auto',
      position: 'relative'
    }}
  >
    <Button
      size="small"
      startIcon={<ContentCopyIcon />}
      sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        minWidth: 'auto',
        color: '#d4d4d4',
        fontSize: '0.75rem'
      }}
      onClick={() => navigator.clipboard.writeText(children)}
    >
      Copy
    </Button>
    <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap' }}>
      {children}
    </Box>
  </Paper>
);

const DeveloperDocumentation = () => {
  const [expandedPanel, setExpandedPanel] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" fontWeight={700} color="primary" mb={2}>
          Developer Documentation
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={3}>
          Complete API reference and integration guide for the Identity Platform
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          This documentation covers OAuth2/OIDC integration, REST API endpoints, SDKs, and implementation examples.
        </Alert>
      </Box>

      {/* Quick Links */}
      <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
            🚀 Quick Start
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                    1. Register Your App
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    Get your client credentials and configure OAuth2 settings
                  </Typography>
                  <Chip label="5 minutes" size="small" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                    2. Implement OAuth2
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    Add OIDC authentication flow to your application
                  </Typography>
                  <Chip label="15 minutes" size="small" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                    3. Access User Data
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    Use REST API to get user profiles and attributes
                  </Typography>
                  <Chip label="10 minutes" size="small" />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* OAuth2/OIDC Integration */}
      <Accordion 
        expanded={expandedPanel === 'oauth'} 
        onChange={handleAccordionChange('oauth')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>OAuth2 & OIDC Integration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>OAuth2 Authorization Code Flow</Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Step 1: Register Your Application</Typography>
            <Typography paragraph>
              Contact the platform administrator to register your application and receive:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText primary="Client ID" secondary="Public identifier for your application" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText primary="Client Secret" secondary="Private key for server-to-server communication" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText primary="Redirect URI" secondary="Where users are sent after authorization" />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Step 2: Authorization Request</Typography>
            <Typography paragraph>
              Redirect users to the authorization endpoint:
            </Typography>
            <CodeBlock>
{`GET https://your-identity-platform.com/oauth/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=openid profile email&
  state=RANDOM_STATE_VALUE`}
            </CodeBlock>
            
            <Typography variant="h6" fontWeight={600} mt={3} mb={2}>Available Scopes:</Typography>
            <Grid container spacing={1} mb={2}>
              <Grid item><Chip label="openid" variant="outlined" size="small" /></Grid>
              <Grid item><Chip label="profile" variant="outlined" size="small" /></Grid>
              <Grid item><Chip label="email" variant="outlined" size="small" /></Grid>
              <Grid item><Chip label="phone" variant="outlined" size="small" /></Grid>
              <Grid item><Chip label="address" variant="outlined" size="small" /></Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Step 3: Handle Authorization Response</Typography>
            <Typography paragraph>
              After user consent, they're redirected back with an authorization code:
            </Typography>
            <CodeBlock>
{`// Example callback URL
https://yourapp.com/callback?code=AUTH_CODE&state=RANDOM_STATE_VALUE

// Node.js/Express example
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Verify state parameter
  if (state !== expectedState) {
    return res.status(400).send('Invalid state');
  }
  
  // Exchange code for tokens
  const tokenResponse = await exchangeCodeForTokens(code);
  const { access_token, id_token, refresh_token } = tokenResponse;
  
  // Store tokens securely
  // Redirect to your app
});`}
            </CodeBlock>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Step 4: Exchange Code for Tokens</Typography>
            <CodeBlock>
{`POST https://your-identity-platform.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=YOUR_REDIRECT_URI`}
            </CodeBlock>
            
            <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1}>Response:</Typography>
            <CodeBlock language="json">
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "def50200684b10d5...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}`}
            </CodeBlock>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* REST API Reference */}
      <Accordion 
        expanded={expandedPanel === 'api'} 
        onChange={handleAccordionChange('api')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ApiIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>REST API Reference</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>API Base URL</Typography>
          <CodeBlock>
            https://your-identity-platform.com/api
          </CodeBlock>

          <Typography variant="h6" fontWeight={600} mt={4} mb={2}>Authentication</Typography>
          <Typography paragraph>
            All API requests must include the access token in the Authorization header:
          </Typography>
          <CodeBlock>
            Authorization: Bearer YOUR_ACCESS_TOKEN
          </CodeBlock>

          {/* User Profile Endpoints */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>User Profile Endpoints</Typography>
            
            <Typography variant="subtitle1" fontWeight={600} mb={1}>Get User Info</Typography>
            <CodeBlock>
{`GET /api/userinfo

Response:
{
  "sub": "12345",
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified": true,
  "profile": {
    "id": 1,
    "name": "Professional Profile",
    "displayName": "John Doe",
    "visibility": "public"
  }
}`}
            </CodeBlock>

            <Typography variant="subtitle1" fontWeight={600} mt={3} mb={1}>Get User Profiles</Typography>
            <CodeBlock>
{`GET /api/profiles

Response:
{
  "profiles": [
    {
      "id": 1,
      "name": "Professional",
      "displayName": "John Doe",
      "visibility": "public",
      "context": "work",
      "attributes": {
        "email": "john.work@example.com",
        "phone": "+1234567890"
      }
    },
    {
      "id": 2,
      "name": "Personal",
      "displayName": "Johnny",
      "visibility": "private",
      "context": "personal",
      "attributes": {
        "email": "john.personal@example.com"
      }
    }
  ]
}`}
            </CodeBlock>

            <Typography variant="subtitle1" fontWeight={600} mt={3} mb={1}>Get Specific Profile</Typography>
            <CodeBlock>
{`GET /api/profiles/{profileId}

Response:
{
  "id": 1,
  "name": "Professional",
  "displayName": "John Doe",
  "visibility": "public",
  "context": "work",
  "attributes": {
    "email": "john.work@example.com",
    "phone": "+1234567890",
    "company": "Tech Corp",
    "title": "Software Engineer"
  },
  "createdAt": "2023-01-15T10:30:00Z",
  "updatedAt": "2023-06-20T14:45:00Z"
}`}
            </CodeBlock>
          </Paper>

          {/* Context Endpoints */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Context Endpoints</Typography>
            
            <Typography variant="subtitle1" fontWeight={600} mb={1}>Get User Contexts</Typography>
            <CodeBlock>
{`GET /api/contexts

Response:
{
  "contexts": [
    {
      "id": 1,
      "name": "work",
      "description": "Professional context",
      "profileCount": 2
    },
    {
      "id": 2,
      "name": "personal",
      "description": "Personal context",
      "profileCount": 1
    }
  ]
}`}
            </CodeBlock>
          </Paper>

          {/* Consent Endpoints */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Consent Management</Typography>
            
            <Typography variant="subtitle1" fontWeight={600} mb={1}>Get User Consents</Typography>
            <CodeBlock>
{`GET /api/consents

Response:
{
  "consents": [
    {
      "id": "consent_123",
      "clientId": "your_app_id",
      "profileId": 1,
      "scope": "openid profile email",
      "grantedAttrs": ["email", "name", "phone"],
      "issuedAt": "2023-06-01T10:00:00Z",
      "expiresAt": "2024-06-01T10:00:00Z",
      "revoked": false
    }
  ]
}`}
            </CodeBlock>

            <Typography variant="subtitle1" fontWeight={600} mt={3} mb={1}>Revoke Consent</Typography>
            <CodeBlock>
{`DELETE /api/consents/{consentId}

Response:
{
  "message": "Consent revoked successfully",
  "consentId": "consent_123",
  "revokedAt": "2023-06-20T15:30:00Z"
}`}
            </CodeBlock>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* SDKs and Libraries */}
      <Accordion 
        expanded={expandedPanel === 'sdks'} 
        onChange={handleAccordionChange('sdks')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <CodeIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>SDKs & Code Examples</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>JavaScript/Node.js SDK</Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Installation</Typography>
            <CodeBlock>
              npm install @identity-platform/sdk
            </CodeBlock>

            <Typography variant="h6" fontWeight={600} mt={3} mb={2}>Basic Usage</Typography>
            <CodeBlock>
{`const { IdentityClient } = require('@identity-platform/sdk');

const client = new IdentityClient({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  redirectUri: 'https://yourapp.com/callback',
  baseUrl: 'https://your-identity-platform.com'
});

// Get authorization URL
const authUrl = client.getAuthorizationUrl({
  scope: 'openid profile email',
  state: 'random_state_value'
});

// Exchange code for tokens
const tokens = await client.exchangeCodeForTokens(authCode);

// Get user info
const userInfo = await client.getUserInfo(tokens.access_token);

// Get user profiles
const profiles = await client.getUserProfiles(tokens.access_token);`}
            </CodeBlock>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Express.js Integration</Typography>
            <CodeBlock>
{`const express = require('express');
const { IdentityClient } = require('@identity-platform/sdk');

const app = express();
const client = new IdentityClient({ /* config */ });

// Login route
app.get('/login', (req, res) => {
  const authUrl = client.getAuthorizationUrl({
    scope: 'openid profile email',
    state: req.session.state
  });
  res.redirect(authUrl);
});

// Callback route
app.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    // Verify state
    if (state !== req.session.state) {
      return res.status(400).send('Invalid state');
    }
    
    // Exchange code for tokens
    const tokens = await client.exchangeCodeForTokens(code);
    
    // Get user info
    const userInfo = await client.getUserInfo(tokens.access_token);
    
    // Store user session
    req.session.user = userInfo;
    req.session.tokens = tokens;
    
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
});

// Protected route
app.get('/dashboard', requireAuth, async (req, res) => {
  const profiles = await client.getUserProfiles(req.session.tokens.access_token);
  res.render('dashboard', { user: req.session.user, profiles });
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}`}
            </CodeBlock>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>React Integration</Typography>
            <CodeBlock>
{`import React, { createContext, useContext, useState, useEffect } from 'react';
import { IdentityClient } from '@identity-platform/sdk';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const client = new IdentityClient({
    clientId: process.env.REACT_APP_CLIENT_ID,
    redirectUri: window.location.origin + '/callback',
    baseUrl: process.env.REACT_APP_API_BASE_URL
  });

  const login = () => {
    const authUrl = client.getAuthorizationUrl({
      scope: 'openid profile email',
      state: Math.random().toString(36).substring(7)
    });
    window.location.href = authUrl;
  };

  const handleCallback = async (code, state) => {
    try {
      const tokens = await client.exchangeCodeForTokens(code);
      const userInfo = await client.getUserInfo(tokens.access_token);
      
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      
      setUser(userInfo);
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/';
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      client.getUserInfo(token)
        .then(setUser)
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      handleCallback,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Usage in component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const token = localStorage.getItem('access_token');
      const userProfiles = await client.getUserProfiles(token);
      setProfiles(userProfiles.profiles);
    };
    
    fetchProfiles();
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
      
      <h2>Your Profiles:</h2>
      {profiles.map(profile => (
        <div key={profile.id}>
          <h3>{profile.name}</h3>
          <p>Display Name: {profile.displayName}</p>
          <p>Context: {profile.context}</p>
        </div>
      ))}
    </div>
  );
};`}
            </CodeBlock>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Integration Examples */}
      <Accordion 
        expanded={expandedPanel === 'examples'} 
        onChange={handleAccordionChange('examples')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <IntegrationInstructionsIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>Integration Examples</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Python/Flask Example</Typography>
            <CodeBlock>
{`from flask import Flask, request, redirect, session, jsonify
import requests
import secrets

app = Flask(__name__)
app.secret_key = 'your_secret_key'

CLIENT_ID = 'your_client_id'
CLIENT_SECRET = 'your_client_secret'
REDIRECT_URI = 'http://localhost:5000/callback'
BASE_URL = 'https://your-identity-platform.com'

@app.route('/login')
def login():
    state = secrets.token_urlsafe(32)
    session['state'] = state
    
    auth_url = f"{BASE_URL}/oauth/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=openid profile email&state={state}"
    return redirect(auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    state = request.args.get('state')
    
    if state != session.get('state'):
        return 'Invalid state', 400
    
    # Exchange code for tokens
    token_response = requests.post(f"{BASE_URL}/oauth/token", data={
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': REDIRECT_URI
    })
    
    tokens = token_response.json()
    
    # Get user info
    user_response = requests.get(f"{BASE_URL}/api/userinfo", 
        headers={'Authorization': f"Bearer {tokens['access_token']}"})
    
    user = user_response.json()
    session['user'] = user
    session['access_token'] = tokens['access_token']
    
    return redirect('/dashboard')

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect('/login')
    
    # Get user profiles
    profiles_response = requests.get(f"{BASE_URL}/api/profiles",
        headers={'Authorization': f"Bearer {session['access_token']}"})
    
    profiles = profiles_response.json()
    
    return jsonify({
        'user': session['user'],
        'profiles': profiles.get('profiles', [])
    })

if __name__ == '__main__':
    app.run(debug=True)`}
            </CodeBlock>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>PHP Example</Typography>
            <CodeBlock>
{`<?php
session_start();

class IdentityPlatformClient {
    private $clientId;
    private $clientSecret;
    private $redirectUri;
    private $baseUrl;
    
    public function __construct($clientId, $clientSecret, $redirectUri, $baseUrl) {
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
        $this->redirectUri = $redirectUri;
        $this->baseUrl = $baseUrl;
    }
    
    public function getAuthorizationUrl($scope = 'openid profile email') {
        $state = bin2hex(random_bytes(16));
        $_SESSION['oauth_state'] = $state;
        
        $params = [
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'scope' => $scope,
            'state' => $state
        ];
        
        return $this->baseUrl . '/oauth/authorize?' . http_build_query($params);
    }
    
    public function exchangeCodeForTokens($code) {
        $data = [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'redirect_uri' => $this->redirectUri
        ];
        
        $ch = curl_init($this->baseUrl . '/oauth/token');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    public function getUserInfo($accessToken) {
        $ch = curl_init($this->baseUrl . '/api/userinfo');
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $accessToken]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
}

// Usage
$client = new IdentityPlatformClient(
    'your_client_id',
    'your_client_secret', 
    'http://localhost:8000/callback.php',
    'https://your-identity-platform.com'
);

// In login.php
if ($_GET['action'] === 'login') {
    $authUrl = $client->getAuthorizationUrl();
    header('Location: ' . $authUrl);
    exit;
}

// In callback.php
if (isset($_GET['code']) && isset($_GET['state'])) {
    if ($_GET['state'] !== $_SESSION['oauth_state']) {
        die('Invalid state parameter');
    }
    
    $tokens = $client->exchangeCodeForTokens($_GET['code']);
    $userInfo = $client->getUserInfo($tokens['access_token']);
    
    $_SESSION['user'] = $userInfo;
    $_SESSION['access_token'] = $tokens['access_token'];
    
    header('Location: /dashboard.php');
    exit;
}
?>`}
            </CodeBlock>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Error Handling */}
      <Accordion 
        expanded={expandedPanel === 'errors'} 
        onChange={handleAccordionChange('errors')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <WarningIcon sx={{ mr: 2, color: 'warning.main' }} />
          <Typography variant="h5" fontWeight={600}>Error Handling & Troubleshooting</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Common Error Responses</Typography>
            
            <Typography variant="subtitle1" fontWeight={600} mb={1}>Invalid Client</Typography>
            <CodeBlock language="json">
{`{
  "error": "invalid_client",
  "error_description": "Client authentication failed",
  "status": 401
}`}
            </CodeBlock>
            
            <Typography variant="subtitle1" fontWeight={600} mt={3} mb={1}>Invalid Grant</Typography>
            <CodeBlock language="json">
{`{
  "error": "invalid_grant",
  "error_description": "Authorization code expired or invalid",
  "status": 400
}`}
            </CodeBlock>
            
            <Typography variant="subtitle1" fontWeight={600} mt={3} mb={1}>Insufficient Scope</Typography>
            <CodeBlock language="json">
{`{
  "error": "insufficient_scope", 
  "error_description": "The request requires higher privileges than provided",
  "status": 403
}`}
            </CodeBlock>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Error Handling Best Practices</Typography>
            <List>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Always verify the state parameter"
                  secondary="Prevents CSRF attacks during OAuth flow"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Handle token expiration gracefully"
                  secondary="Use refresh tokens to get new access tokens"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Implement proper error logging"
                  secondary="Log errors for debugging but don't expose sensitive info"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Validate all API responses"
                  secondary="Check for error fields before processing data"
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Troubleshooting Guide</Typography>
            
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Issue: "invalid_client" error during token exchange
            </Typography>
            <Typography paragraph>
              <strong>Causes:</strong> Wrong client_id/client_secret, incorrect authentication method
              <br />
              <strong>Solution:</strong> Verify credentials, ensure using POST with form data
            </Typography>
            
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Issue: User gets "access_denied" error
            </Typography>
            <Typography paragraph>
              <strong>Causes:</strong> User declined consent, app not approved
              <br />
              <strong>Solution:</strong> Handle gracefully, allow user to retry
            </Typography>
            
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Issue: "invalid_scope" error
            </Typography>
            <Typography paragraph>
              <strong>Causes:</strong> Requesting scopes not approved for your app
              <br />
              <strong>Solution:</strong> Request only approved scopes, contact admin to request additional scopes
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Security Best Practices */}
      <Accordion 
        expanded={expandedPanel === 'security'} 
        onChange={handleAccordionChange('security')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SecurityIcon sx={{ mr: 2, color: 'error.main' }} />
          <Typography variant="h5" fontWeight={600}>Security Best Practices</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>OAuth2 Security</Typography>
            <List>
              <ListItem>
                <ListItemIcon><SecurityIcon color="error" /></ListItemIcon>
                <ListItemText 
                  primary="Always use HTTPS"
                  secondary="Never send tokens or sensitive data over HTTP"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SecurityIcon color="error" /></ListItemIcon>
                <ListItemText 
                  primary="Validate state parameter"
                  secondary="Prevents CSRF attacks, use cryptographically secure random values"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SecurityIcon color="error" /></ListItemIcon>
                <ListItemText 
                  primary="Store client secret securely"
                  secondary="Never expose client secret in frontend code or public repositories"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SecurityIcon color="error" /></ListItemIcon>
                <ListItemText 
                  primary="Implement token rotation"
                  secondary="Use refresh tokens and rotate access tokens regularly"
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Token Storage</Typography>
            
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Frontend Applications</Typography>
              <Typography>
                Store tokens in memory or secure HTTP-only cookies. Avoid localStorage for sensitive tokens.
              </Typography>
            </Alert>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Backend Applications</Typography>
              <Typography>
                Store tokens in secure server-side sessions or encrypted database fields.
              </Typography>
            </Alert>

            <CodeBlock>
{`// ❌ Bad: Storing tokens in localStorage (vulnerable to XSS)
localStorage.setItem('access_token', token);

// ✅ Good: Storing in memory with automatic cleanup
class TokenManager {
  constructor() {
    this.tokens = new Map();
    this.setupCleanup();
  }
  
  setToken(userId, token, expiresIn) {
    this.tokens.set(userId, {
      token,
      expiresAt: Date.now() + expiresIn * 1000
    });
  }
  
  getToken(userId) {
    const tokenData = this.tokens.get(userId);
    if (tokenData && tokenData.expiresAt > Date.now()) {
      return tokenData.token;
    }
    this.tokens.delete(userId);
    return null;
  }
}`}
            </CodeBlock>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Rate Limiting</Typography>
            <Typography paragraph>
              The API implements rate limiting to prevent abuse:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Authentication endpoints: 5 requests per minute"
                  secondary="Token exchange, refresh token operations"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="API endpoints: 100 requests per minute per user"
                  secondary="Profile data, consent management"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Rate limit headers are included in responses"
                  secondary="X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset"
                />
              </ListItem>
            </List>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Footer */}
      <Box textAlign="center" mt={6} p={3}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary">
          Developer Documentation v1.0 | Last updated: September 2025
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          For technical support, contact developers@identityplatform.com
        </Typography>
      </Box>
    </Box>
  );
};

export default DeveloperDocumentation;
