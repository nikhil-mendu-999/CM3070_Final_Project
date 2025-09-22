import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Grid, Chip, Button, Snackbar, Alert, CircularProgress, Box, Stack, Tooltip, Divider
} from '@mui/material';
import { getMyConsents, revokeConsent } from '../api';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const GrantedConsents = ({ token }) => {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const errorRef = useRef(null);

  const fetchConsents = async () => {
    setLoading(true);
    try {
      const result = await getMyConsents(token);
      setConsents(result);
    } catch {
      setError('Failed to load consents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConsents(); }, [token]);
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const handleRevoke = async (grantId) => {
    try {
      await revokeConsent(token, grantId);
      setSuccess('Consent revoked.');
      fetchConsents();
    } catch (e) {
      setError('Failed to revoke consent.');
    }
  };

  return (
    <Box maxWidth="md" mx="auto" mt={5} width="100%">
      <Typography variant="h3" fontWeight={700} color="primary" sx={{ textAlign: 'center', mb: 3, letterSpacing: 0.12 }} id="granted-consents-heading">
        My Granted Third-Party Consents
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#555', textAlign: 'center', mb: 5 }} aria-describedby="granted-consents-heading">
        Each card below represents an app or service you've granted access to your information. Revoke any at any time.
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="38vh" aria-busy="true">
          <CircularProgress />
        </Box>
      ) : consents.length === 0 ? (
        <Card sx={{ maxWidth: 500, mx: "auto" }} aria-label="No active consents">
          <CardContent>
            <Typography sx={{ textAlign: "center", fontSize: 18 }}>
              No active consents.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {consents.map((c) => (
            <Card
              key={c.id}
              elevation={4}
              sx={{
                borderRadius: 4,
                p: 1,
                minHeight: 220,
                width: "100%",
                mb: 0,
                display: "flex",
                flexDirection: "column",
              }}
              role="region"
              aria-label={`Consent for client ${c.clientId}`}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FingerprintIcon fontSize="small" color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    App: {c.clientId}
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography fontSize={15} mb={1.2}>
                  <b>Profile:</b> {c.profile?.name || "#" + c.profileId}
                </Typography>
                <Typography fontSize={15}>
                  <b>Attributes:</b>{" "}
                  {Array.isArray(c.grantedAttrs) && c.grantedAttrs.length
                    ? c.grantedAttrs.join(", ")
                    : (typeof c.grantedAttrs === "string" && c.grantedAttrs) ? c.grantedAttrs : "N/A"}
                </Typography>
                <Typography fontSize={15}>
                  <b>Scope:</b> {c.scope && c.scope.length > 0 ? c.scope : "N/A"}
                </Typography>
                <Typography fontSize={15}>
                  <b>Issued:</b> {c.issuedAt ? new Date(c.issuedAt).toLocaleString() : "Unknown"}
                </Typography>
                <Typography fontSize={15}>
                  <b>Expires:</b> {c.expiresAt ? new Date(c.expiresAt).toLocaleString() : "N/A"}
                </Typography>
                <Box display="flex" mt={2} alignItems="center" gap={2}>
                  <Chip
                    size="small"
                    label={c.revoked ? "Revoked" : "Active"}
                    color={c.revoked ? "default" : "success"}
                    sx={{ fontWeight: 700, fontSize: 15 }}
                    icon={c.revoked ? <HighlightOffIcon /> : <CheckCircleIcon />}
                    aria-label={c.revoked ? "Revoked consent" : "Active consent"}
                  />
                  <Tooltip title={c.revoked ? "Already revoked" : "Revoke this consent"}>
                    <span>
                      <Button
                        color="error"
                        variant={c.revoked ? "outlined" : "contained"}
                        size="small"
                        disabled={c.revoked}
                        sx={{ ml: 1, minWidth: 88, fontWeight: 700 }}
                        onClick={() => handleRevoke(c.id)}
                        aria-label="Revoke consent"
                      >
                        Revoke
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      <Snackbar open={!!success} autoHideDuration={1700} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3500} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }} ref={errorRef} tabIndex={-1} role="alert" aria-live="polite">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GrantedConsents;
