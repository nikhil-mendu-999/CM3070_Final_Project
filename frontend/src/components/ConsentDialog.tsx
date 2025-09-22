import React, { useEffect, useState } from "react";
import {
  Box, Container, Paper, Typography, Button, Checkbox, Stack, Chip, Divider, Snackbar, Alert,
  Card, CardContent, Grid, CircularProgress, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { getSharableIdentities, grantConsent, getMyConsents, revokeConsent } from "../api";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ConsentDialog = ({ clientId, redirectUri, scope, state, token, onLoginNeeded }) => {
  const [loading, setLoading] = useState(true);
  const [identities, setIdentities] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [granting, setGranting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showGrants, setShowGrants] = useState(false);
  const [myGrants, setMyGrants] = useState([]);
  const [revokeStatus, setRevokeStatus] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      onLoginNeeded && onLoginNeeded();
      return;
    }
    setLoading(true);
    getSharableIdentities(token)
      .then(idts => {
        setIdentities(idts);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || "Failed to load identities");
        setLoading(false);
      });
  }, [token, onLoginNeeded]);

  const handleProfileSelect = (profileId) => {
    setSelectedProfileId(profileId);
    const profile = identities.find(idt => idt.id === profileId);
    if (profile) {
      setSelectedAttributes(Object.keys(profile).filter(k => typeof profile[k] === "string" && k !== "id"));
    } else {
      setSelectedAttributes([]);
    }
  };

  const handleAttributeToggle = (attr) => {
    setSelectedAttributes(attrs =>
      attrs.includes(attr) ? attrs.filter(a => a !== attr) : [...attrs, attr]
    );
  };

  const handleGrant = () => {
    setGranting(true);
    setError("");
    setSuccess("");
    grantConsent(token, {
      clientId,
      redirectUri,
      profileId: selectedProfileId,
      attributes: selectedAttributes,
      scope,
      state
    })
      .then(resp => {
        setSuccess("Consent granted! Redirecting...");
        setTimeout(() => { window.location.href = resp.redirectUrl || redirectUri; }, 1000);
      })
      .catch(e => {
        setError(e.message || "Failed to grant consent.");
        setGranting(false);
      });
  };

  const loadMyGrants = () => {
    setShowGrants(true);
    setLoading(true);
    setError("");
    getMyConsents(token)
      .then(grants => {
        setMyGrants(grants);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || "Failed to load consents");
        setLoading(false);
      });
  };

  const handleRevoke = (grantId) => {
    setRevokeStatus("");
    revokeConsent(token, grantId)
      .then(() => {
        setRevokeStatus("Consent revoked successfully.");
        setMyGrants(grants => grants.map(g => g.id === grantId ? { ...g, revoked: true } : g));
      })
      .catch(e => {
        setRevokeStatus("Failed to revoke: " + (e.message || ""));
      });
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="55vh"><CircularProgress /></Box>
  );
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>Error: {error}</Alert>;

  if (showGrants) {
    return (
      <Dialog open onClose={() => setShowGrants(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Your Granted Consents</DialogTitle>
        <DialogContent>
          {!myGrants.length && <Typography mt={2}>No active grants found.</Typography>}
          <Stack gap={2} mt={2}>
            {myGrants.map(grant => (
              <Paper key={grant.id} elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                <Typography>
                  <FingerprintIcon sx={{ mb: -.5, mr: 1 }} color="action" />
                  <b>Profile:</b> {grant.profile?.name} (#{grant.profileId})
                </Typography>
                <Typography><b>Client:</b> {grant.clientId}</Typography>
                <Typography><b>Attributes:</b> {Array.isArray(grant.grantedAttrs) ? grant.grantedAttrs.join(", ") : "-"}</Typography>
                <Typography><b>Expires:</b> {grant.expiresAt ? new Date(grant.expiresAt).toLocaleString() : "N/A"}</Typography>
                <Box display="flex" gap={2} alignItems="center" mt={.75}>
                  <Chip
                    label={grant.revoked ? "Revoked" : "Active"}
                    color={grant.revoked ? "default" : "success"}
                    icon={grant.revoked ? <HighlightOffIcon /> : <CheckCircleIcon />}
                  />
                  {!grant.revoked && (
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      sx={{ ml: 1 }}
                      onClick={() => handleRevoke(grant.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </Box>
              </Paper>
            ))}
          </Stack>
          {revokeStatus && <Alert severity="error" sx={{ mt: 2 }}>{revokeStatus}</Alert>}
          <Button sx={{ mt: 3 }} onClick={() => setShowGrants(false)}>← Back to Consent</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          minHeight: { xs: 150, md: 170 },
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
          mb: 3,
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            fontWeight={800}
            letterSpacing={0.12}
            gutterBottom
            sx={{ mb: 0 }}
          >
            Grant Access to Your Identity
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
            Approve which profile and information to share with <Chip label={clientId} color="secondary" />
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.83, mt: 2 }}>
            You’re in control. Select only what this app should access. Revoke anytime.
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="md" sx={{ pb: 8 }}>
        <Paper sx={{ borderRadius: 4, boxShadow: 3, p: { xs: 2, md: 4 }, mt: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="primary">
            Choose Identity Profile and Fields
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {identities.map(profile => (
              <Grid item xs={12} key={profile.id}>
                <Card
                  elevation={selectedProfileId === profile.id ? 6 : 1}
                  sx={{
                    border: selectedProfileId === profile.id ? "2px solid #447AC9" : "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    cursor: "pointer",
                    bgcolor: selectedProfileId === profile.id ? "action.selected" : "background.paper",
                    mb: 1
                  }}
                  onClick={() => handleProfileSelect(profile.id)}
                >
                  <CardContent>
                    <Typography fontWeight={700} mb={.5}>{profile.name} <Chip label={`#${profile.id}`} size="small" /></Typography>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box flex={1}>
                        {Object.entries(profile)
                          .filter(([k, v]) => typeof v === "string" && k !== "id")
                          .map(([k, v]) => (
                            <Box key={k} display="flex" alignItems="center" gap={1.2} mt={.5}>
                              <Checkbox
                                checked={selectedProfileId === profile.id && selectedAttributes.includes(k)}
                                disabled={selectedProfileId !== profile.id}
                                onChange={() => handleAttributeToggle(k)}
                                size="small"
                              />
                              <Typography fontSize={15}><b>{k}:</b> {v}</Typography>
                            </Box>
                          ))}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" spacing={2} mt={3} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleGrant}
              disabled={!selectedProfileId || !selectedAttributes.length || granting}
              size="large"
              sx={{ minWidth: 200, fontWeight: 700 }}
            >
              {granting ? <CircularProgress size={22} color="inherit" /> : "Grant Consent"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={loadMyGrants}
              size="large"
              sx={{ minWidth: 150, fontWeight: 700 }}
            >
              View My Consents
            </Button>
          </Stack>
          {success && <Snackbar open autoHideDuration={2200} onClose={() => setSuccess('')}>
            <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>{success}</Alert>
          </Snackbar>}
        </Paper>
      </Container>
    </>
  );
};

export default ConsentDialog;
