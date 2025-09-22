import React, { useState } from "react";
import {
  Box, Container, Typography, Button, Stack, Card, CardContent,
  Grid, useTheme, Tabs, Tab
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";
import RuleIcon from "@mui/icons-material/Rule";
import KeyIcon from "@mui/icons-material/VpnKey";
import CodeIcon from "@mui/icons-material/Code";
import PersonIcon from "@mui/icons-material/Person";
import UserDocumentation from "./UserDocumentation";
import DeveloperDocumentation from "./DeveloperDocumentation";

const features = [
  {
    icon: <KeyIcon sx={{ fontSize: 48, color: "primary.main" }} aria-label="Single sign-on" />,
    title: "Single Sign-On & OIDC",
    desc: "Modern OAuth2/OIDC login and SSO, secure JWT tokens, and seamless integration for internal and third-party apps. Provide users with a unified login experience, reduce password fatigue, and enforce robust security standards. Integrates with major providers and supports extensible claims mapping for your organization."
  },
  {
    icon: <GroupIcon sx={{ fontSize: 48, color: "primary.main" }} aria-label="Multi-profile" />,
    title: "Multi-Profile, Multi-Context",
    desc: "Create and manage multiple identities for personal, professional, and other contexts. Isolate personal data, adjust privacy settings uniquely for each profile, and delegate access or share specific data only when you want. Useful for freelancers, dual roles, or anyone needing true identity separation."
  },
  {
    icon: <RuleIcon sx={{ fontSize: 48, color: "primary.main" }} aria-label="Granular consent" />,
    title: "Granular Consent & Privacy",
    desc: "Control who sees what: field-level privacy configuration allows you to share only the information you choose with each application. Instantly view, review, and revoke access by app, track when your data was seen, and get notified when consents change, for full peace of mind."
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 48, color: "primary.main" }} aria-label="GDPR and security" />,
    title: "Audit, GDPR, & Security",
    desc: "GDPR-compliant by design: full audit logs of all account activity, data export & deletion on demand, automated reminders and security checks. Transparent design assures personal, enterprise, and regulatory requirements are met. Stay in control and know your data is always protected."
  },
];

const LandingPage = ({ onShowSignup, onShowLogin }) => {
  const theme = useTheme();
  const [showDocs, setShowDocs] = useState(false);
  const [docType, setDocType] = useState(0); // 0 = user docs, 1 = developer docs

  const handleDocumentationClick = () => {
    setShowDocs(true);
    setDocType(0);
  };

  if (showDocs) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 0, width: "100vw" }}>
        {/* Documentation Header */}
        <Box sx={{ bgcolor: "primary.main", color: "white", py: 3 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h4" fontWeight={700}>Documentation</Typography>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setShowDocs(false)}
                sx={{ fontWeight: 700 }}
              >
                ← Back to Home
              </Button>
            </Box>
            <Tabs
              value={docType}
              onChange={(e, v) => setDocType(v)}
              sx={{
                mt: 2,
                '& .MuiTab-root': {
                  color: 'white',
                  fontWeight: 600,
                  '&.Mui-selected': { color: 'secondary.main' }
                }
              }}
              indicatorColor="secondary"
            >
              <Tab
                icon={<PersonIcon />}
                label="User Guide"
                iconPosition="start"
                sx={{ mr: 4 }}
              />
              <Tab
                icon={<CodeIcon />}
                label="Developer API"
                iconPosition="start"
              />
            </Tabs>
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ py: 0 }}>
          {docType === 0 ? <UserDocumentation /> : <DeveloperDocumentation />}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', width: '100vw', py: 0 }}>
      {/* Banner */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80,
          minHeight: { xs: 320, md: 420 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 5, md: 8 },
          textAlign: "center"
        }}
        role="banner"
        aria-label="Welcome section"
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} letterSpacing={1} sx={{ mb: 2 }}>
            Welcome to Identity App
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.92, maxWidth: 600, mx: "auto", mb: 5 }}>
            Control your digital identity. Launch secure single sign-on, manage multiple profiles, and share only what you want.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ minWidth: 160, fontWeight: 700 }}
              onClick={onShowSignup}
              aria-label="Sign up"
            >
              Sign Up
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              sx={{ minWidth: 160, fontWeight: 700 }}
              onClick={onShowLogin}
              aria-label="Login"
            >
              Login
            </Button>
            <Button
              variant="text"
              color="inherit"
              size="large"
              sx={{
                minWidth: 160,
                fontWeight: 700,
                mt: { xs: 2, sm: 0 },
                border: `2px solid ${theme.palette.primary.light}`,
                color: 'white'
              }}
              onClick={handleDocumentationClick}
              aria-label="Documentation"
            >
              Documentation
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Feature Highlights */}
      <Container maxWidth="md" sx={{ mt: -6 }}>
        <Grid
          container
          spacing={4}
          sx={{
            mb: 6,
            alignItems: "stretch"
          }}
        >
          {features.map((f, i) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={i}
              sx={{
                display: "flex"
              }}
            >
              <Card
                elevation={3}
                sx={{
                  borderRadius: 4,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%"
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    flex: "1 1 auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: 315,
                    py: 6,
                    px: 3
                  }}
                >
                  <Box mb={2}>{f.icon}</Box>
                  <Typography
                    variant="h6"
                    mb={2}
                    fontWeight={700}
                    sx={{ fontSize: { xs: "1.15rem", sm: "1.22rem" } }}
                  >
                    {f.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "1.05rem", sm: "1.10rem" },
                      mt: 1
                    }}
                  >
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 6, mt: 4, textAlign: "center", opacity: 0.55 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Identity App
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
