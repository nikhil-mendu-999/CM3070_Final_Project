import React, { useState, useEffect, useRef } from "react";
import {
  AppBar, Toolbar, Typography, Box, Avatar, Button, Grid,
  Card, CardContent, Stack, Skeleton, Tabs, Tab
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountActions from "./AccountActions";
import LinkedAccounts from "./LinkedAccounts";
import Profiles from "./Profiles";
import ContextSelector from "./ContextSelector";
import CreateContext from "./CreateContext";
import UserProfileForm from "./UserProfileForm";
import GrantedConsents from "./GrantedConsents";
import MyAuditLogs from "./MyAuditLogs";
import EditProfile from "./EditProfile";
import { getProfiles, getContexts } from "../api";

const NAV_SECTIONS = [
  { key: "profiles", label: "Profiles" },
  { key: "contexts", label: "Contexts" },
  { key: "account", label: "Account & Privacy" },
  { key: "consents", label: "My Consents" },
  { key: "activity", label: "My Activity" }
];

const StatCard = ({ label, value }) => (
  <Card elevation={2} sx={{ borderRadius: 3, minWidth: 150, textAlign: 'center' }}>
    <CardContent>
      <Typography variant="h6" color="primary">{label}</Typography>
      <Typography variant="h4" fontWeight={700}>{value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = ({ token, userId, onLogout }) => {
  const [profileStats, setProfileStats] = useState({ profiles: null, contexts: null, loaded: false });
  const [activeSection, setActiveSection] = useState('profiles');
  const [activeContextId, setActiveContextId] = useState(null);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const mainRef = useRef(null);

  useEffect(() => {
    if (!token || !userId) return;
    let cancelled = false;
    async function fetchStats() {
      try {
        const [profiles, contexts] = await Promise.all([
          getProfiles(userId, token),
          getContexts(token)
        ]);
        if (!cancelled) {
          setProfileStats({
            profiles: profiles.length,
            contexts: contexts.length,
            loaded: true
          });
        }
      } catch {
        if (!cancelled) setProfileStats({ profiles: "?", contexts: "?", loaded: true });
      }
    }
    fetchStats();
    return () => { cancelled = true; };
  }, [userId, token]);

  useEffect(() => {
    if (mainRef.current) mainRef.current.focus();
  }, [activeSection]);

  const handleTabChange = (event, newValue) => {
    setActiveSection(newValue);
    setEditingProfileId(null);
  };

  return (
    <Box sx={{ bgcolor: "#f8fafe", minHeight: "100vh" }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <AppBar position="static" color="primary" sx={{ boxShadow: 2 }}>
        <Toolbar
          sx={{
            minHeight: 70,
            px: { xs: 2, sm: 4, md: 10, xl: 24 },
            backgroundColor: "primary.main"
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          <Avatar sx={{ bgcolor: "background.paper", color: "primary.main", mr: 2 }}>
            <AccountCircle fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight={700} sx={{ mr: 6, color: "white" }}>
            ContextID
          </Typography>
          <Tabs
            value={activeSection}
            onChange={handleTabChange}
            aria-label="Dashboard navigation"
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              flexGrow: 1,
              ".MuiTabs-flexContainer": { gap: 3 }
            }}
          >
            {NAV_SECTIONS.map(section => (
              <Tab
                key={section.key}
                value={section.key}
                label={section.label}
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "white",
                  '&.Mui-selected': { color: 'secondary.main' }
                }}
                aria-current={activeSection === section.key ? "page" : undefined}
              />
            ))}
          </Tabs>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            size="large"
            onClick={onLogout}
            sx={{ fontWeight: 700, ml: 2 }}
            aria-label="Logout"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box maxWidth="lg" mx="auto" py={5} minHeight="100vh" width="100%">
        <Box
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          aria-label="Dashboard main region"
          role="main"
          sx={{ px: { xs: 2, md: 4 } }}
        >
          {activeSection === "activity" ? (
            <Box display="flex" justifyContent="center">
              <Card
                elevation={4}
                sx={{
                  p: 3,
                  mb: 4,
                  width: "100%",
                  maxWidth: 950,
                  borderRadius: 4,
                  mx: "auto"
                }}
              >
                <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
                  My Activity
                </Typography>
                <MyAuditLogs token={token} />
              </Card>
            </Box>
          ) : activeSection === "consents" ? (
            <Box display="flex" justifyContent="center">
              <Card
                elevation={4}
                sx={{
                  p: 3,
                  mb: 4,
                  width: "100%",
                  maxWidth: 950,
                  borderRadius: 4,
                  mx: "auto"
                }}
              >
                <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
                  My Consents
                </Typography>
                <Box mt={2} width="100%">
                  <GrantedConsents token={token} />
                </Box>
              </Card>
            </Box>
          ) : (
            <Box
              sx={{
                display: { xs: "block", md: "flex" },
                alignItems: "flex-start",
                gap: 5,
                width: "100%",
                maxWidth: "lg",
                mx: "auto"
              }}
            >
              {/* Main content */}
              <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: { md: "56%" }, width: "100%" }}>
                <Card elevation={4} sx={{ p: 3, mb: 4, width: "100%" }}>
                  {activeSection === "profiles" && (
                    editingProfileId ? (
                      <EditProfile
                        token={token}
                        userId={userId}
                        profileId={editingProfileId}
                        onSaved={() => setEditingProfileId(null)}
                        onLogout={onLogout}
                      />
                    ) : (
                      <>
                        <Grid container spacing={4} mb={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <StatCard label="Profiles" value={profileStats.loaded ? profileStats.profiles : <Skeleton width={40} />} />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <StatCard label="Contexts" value={profileStats.loaded ? profileStats.contexts : <Skeleton width={40} />} />
                          </Grid>
                        </Grid>
                        <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
                          Profiles
                        </Typography>
                        <Profiles
                          token={token}
                          userId={userId}
                          onEditProfile={id => setEditingProfileId(id)}
                          showOnlyForm={false}
                          showOnlyList={false}
                        />
                      </>
                    )
                  )}
                  {activeSection === "contexts" && (
                    <>
                      <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
                        Contexts
                      </Typography>
                      <CreateContext token={token} onCreated={() => {}} />
                      <Box sx={{ mt: 2 }}>
                        <ContextSelector
                          token={token}
                          userId={userId}
                          activeContextId={activeContextId}
                          onChange={setActiveContextId}
                        />
                      </Box>
                    </>
                  )}
                  {activeSection === "account" && (
                    <>
                      <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
                        Account & Privacy
                      </Typography>
                      <UserProfileForm token={token} />
                      <LinkedAccounts token={token} />
                    </>
                  )}
                </Card>
              </Box>
              {/* Sidebar */}
              <Box sx={{
                minWidth: { md: 470 },
                maxWidth: { md: 528 },
                width: { xs: "100%", md: 520 },
                flexShrink: 0,
                mt: { xs: 4, md: 0 }
              }}>
                <Stack spacing={4} sx={{ width: "100%" }}>
                  {(activeSection === "profiles" || activeSection === "account") && (
                    <Card elevation={4} sx={{ p: 3, width: "100%" }}>
                      <AccountActions token={token} onLogout={onLogout} />
                    </Card>
                  )}
                  {(activeSection === "profiles" || activeSection === "account") && (
                    <Card elevation={4} sx={{ p: 3, width: "100%" }}>
                      <LinkedAccounts token={token} />
                    </Card>
                  )}
                </Stack>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
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
          background: #447AC9;
          color: white;
          font-weight: bold;
          z-index: 1000;
          border-radius: 5px;
        }
      `}
      </style>
    </Box>
  );
};

export default Dashboard;
