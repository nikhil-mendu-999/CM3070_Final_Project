import React, { useEffect, useState, useRef } from "react";
import {
  Card, CardContent, Typography, Stack, Avatar, Button, Box, Chip, Snackbar, Alert, Divider, Tooltip
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

const API_BASE_URL = "http://127.0.0.1:3000";
const PROVIDER_ICONS = {
  google: <GoogleIcon sx={{ color: "#4285F4" }} aria-label="Google" />,
  github: <GitHubIcon sx={{ color: "#24292E" }} aria-label="GitHub" />,
};

export default function LinkedAccounts({ token }) {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const errorRef = useRef(null);

  const fetchAccounts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/users/me/linked-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setAccounts(await res.json());
    } catch (e) {
      setError(e.message || "Could not fetch linked accounts");
    }
    setLoading(false);
  };

  const unlinkAccount = async (id) => {
    if (accounts.length === 1) {
      alert("You must keep at least one linked account to prevent lockout.");
      return;
    }
    if (!window.confirm("Unlink this account? You may be unable to log in if this is your last linked account.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/users/me/linked-accounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      fetchAccounts();
    } catch (e) {
      setError(e.message || "Could not unlink account");
    }
  };

  useEffect(() => { fetchAccounts(); }, [token]);
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const startLink = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  if (loading) return <Typography sx={{ mt: 3 }} aria-busy="true">Loading linked accounts...</Typography>;

  return (
    <Card sx={{ maxWidth: 430, mx: "auto", mt: 5 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} color="primary" mb={1.5} id="linked-accounts-header">
          <LinkIcon sx={{ mb: -.7, mr: 1, fontSize: 22 }} />
          Linked Social Accounts
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }} tabIndex={-1} role="alert" ref={errorRef} aria-live="assertive">{error}</Alert>}
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1.5} aria-labelledby="linked-accounts-header">
          {accounts.length === 0 ? (
            <Typography color="text.secondary">No linked accounts found.</Typography>
          ) : (
            accounts.map((acc) => (
              <Box
                key={acc.id}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ p: 1, borderRadius: 1, bgcolor: "action.hover" }}
                role="group"
                aria-label={`Linked account: ${acc.displayName || acc.provider}`}
              >
                {PROVIDER_ICONS[acc.provider] || <LinkIcon color="disabled" />}
                {acc.avatar && (
                  <Avatar src={acc.avatar} alt={acc.displayName || acc.provider} sx={{ width: 32, height: 32, mr: 1 }} />
                )}
                <Box flex={1}>
                  <Typography component="span" fontWeight={600}>
                    <a
                      href={acc.profileUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: acc.profileUrl ? "underline" : "none", color: "inherit" }}
                    >
                      {acc.displayName || acc.provider}
                    </a>
                  </Typography>
                </Box>
                <Tooltip title={accounts.length === 1 
                  ? "At least one account must remain linked." 
                  : "Unlink this account"}>
                  <span>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => unlinkAccount(acc.id)}
                      disabled={accounts.length === 1}
                      sx={{ minWidth: 78, fontWeight: 600 }}
                      aria-label={`Unlink ${acc.provider} account`}
                    >
                      Unlink
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            ))
          )}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2} aria-label="Link new accounts">
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            sx={{ bgcolor: "#4285F4", "&:hover": { bgcolor: "#295ecb" } }}
            onClick={() => startLink("google")}
            fullWidth
            aria-label="Link Google account"
          >
            Link Google
          </Button>
          <Button
          variant="contained"
          startIcon={<GitHubIcon sx={{ color: "#fff" }} />}   // Make icon white
          sx={{
            bgcolor: "#24292E",
            color: "#fff",         // Make button text white
            '&:hover': { bgcolor: "#181e24" }
          }}
          onClick={() => startLink("github")}
          fullWidth
        >
            Link GitHub
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
