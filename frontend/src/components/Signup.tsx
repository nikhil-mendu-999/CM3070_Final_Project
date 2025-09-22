import React, { useState, useRef, useEffect } from "react";
import {
  Box, Container, Paper, Typography, TextField, Button, CircularProgress, Alert, Stack, Avatar
} from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen';

const API_BASE_URL = "http://127.0.0.1:3000";
const DOCS_PATH = "/docs";

export default function Signup({ onSignupSuccess, onShowLogin, onShowDocs }) {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const errorRef = useRef(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.email || !form.password) return setError("Email and password required.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      if (!res.ok) {
        let msg = "Signup failed.";
        try {
          msg = await res.text();
        } catch {}
        throw new Error(msg);
      }
      setSuccess("Signup successful! Please log in.");
      setForm({ email: "", password: "", confirm: "" });
      // Optional: short delay before navigating
      if (onSignupSuccess) setTimeout(() => onSignupSuccess(), 1200);
    } catch (e) {
      setError(e.message);
      setSuccess("");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (error && errorRef.current) errorRef.current.focus();
  }, [error]);

  const handleLoginClick = () => {
    if (onShowLogin) {
      onShowLogin();
    } else {
      window.location.href = "/login";
    }
  };

  const handleDocsClick = () => {
    if (onShowDocs) {
      onShowDocs();
    } else {
      window.location.href = DOCS_PATH;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "primary.light",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Typography
        variant="h2"
        fontWeight={800}
        color="#fff"
        sx={{ mb: 4, letterSpacing: 1, textAlign: "center" }}
      >
        Create Your Identity
      </Typography>
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ px: 6, py: 5, borderRadius: 4 }} role="main" aria-labelledby="signup-form-header">
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLoginClick}
              disabled={loading}
              fullWidth
              sx={{ fontWeight: 700 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDocsClick}
              disabled={loading}
              fullWidth
              sx={{ fontWeight: 700 }}
            >
              Documentation
            </Button>
          </Stack>
          <Box textAlign="center" mb={2}>
            <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64, mx: "auto", mb: 2 }}>
              <LockOpenIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={800} color="primary.main" id="signup-form-header">Sign Up</Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.80 }}>
              Create a secure account to get started.
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} aria-labelledby="signup-form-header">
            <Stack spacing={3}>
              <TextField
                type="email"
                name="email"
                label="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="email"
                inputProps={{ "aria-label": "Email address" }}
              />
              <TextField
                type="password"
                name="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="new-password"
                inputProps={{ minLength: 6, "aria-label": "Password" }}
              />
              <TextField
                type="password"
                name="confirm"
                label="Confirm Password"
                value={form.confirm}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="new-password"
                inputProps={{ minLength: 6, "aria-label": "Confirm password" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ fontWeight: 700, py: 1.5 }}
                fullWidth
                disabled={loading}
                aria-label="Create account"
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : "Create Account"}
              </Button>
              {error && <Alert severity="error" ref={errorRef} tabIndex={-1} role="alert" aria-live="assertive">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
