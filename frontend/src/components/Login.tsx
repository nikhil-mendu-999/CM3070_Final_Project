import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import LockIcon from "@mui/icons-material/Lock";

const APIBASEURL = "http://127.0.0.1:3000";

const Login = ({ onLoginSuccess, onShowSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetch(`${APIBASEURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then((res) => res.json());
      const token = data.accesstoken || data.access_token;
      if (!token) {
        setError("No token returned from the server. Please contact support.");
      } else {
        onLoginSuccess(token);
      }
    } catch (err) {
      setError(err?.message || "Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${APIBASEURL}/auth/${provider}`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      <Typography
        variant="h2"
        fontWeight={800}
        color="primary"
        sx={{ mb: 4, letterSpacing: 1, textAlign: "center" }}
      >
        Identity App Login
      </Typography>
      <Paper
        sx={{
          width: 400,
          maxWidth: "96vw",
          p: 5,
          borderRadius: 4,
          boxShadow: 6,
        }}
        role="main"
        id="main-content"
      >
        <Stack gap={3} alignItems="stretch">
          <Stack
            direction="row"
            gap={1.7}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <LockIcon fontSize="large" color="primary" aria-label="Sign in" />
            <Typography variant="h5" fontWeight={700} color="primary.main">
              Sign in to your account
            </Typography>
          </Stack>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 1 }}
              tabIndex={-1}
              ref={errorRef}
              role="alert"
              aria-live="assertive"
            >
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit} aria-labelledby="login-form-label">
            <Typography
              variant="h6"
              id="login-form-label"
              sx={{ mb: 1, fontWeight: 700 }}
            >
              Login form
            </Typography>
            <Stack gap={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                inputProps={{ "aria-label": "Email address", name: "login-email" }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                inputProps={{ "aria-label": "Password", name: "login-password" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                size="large"
                sx={{
                  boxShadow: 2,
                  fontWeight: 700,
                  mt: 1,
                }}
                aria-label="Log in"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Stack>
          </form>
          <Button
            fullWidth
            variant="text"
            color="primary"
            size="large"
            sx={{ fontWeight: 700, mt: 0.5 }}
            onClick={onShowSignup}
            disabled={loading}
            aria-label="Create account"
          >
            Create an account
          </Button>
          <Divider />
          <Typography variant="body2" color="text.secondary" align="center">
            Or continue with
          </Typography>
          <Divider />
          <Stack direction="row" gap={2}>
            <Button
              variant="contained"
              onClick={() => handleSocialLogin("google")}
              startIcon={<GoogleIcon />}
              sx={{
                bgcolor: "#DD4B39",
                ":hover": { bgcolor: "#c9412f" },
                flex: 1,
                fontWeight: 700,
              }}
              disabled={loading}
              size="large"
              aria-label="Sign in with Google"
            >
              Google
            </Button>
            <Button
  variant="contained"
  onClick={() => handleSocialLogin("github")}
  startIcon={<GitHubIcon sx={{ color: "#fff" }} />} // Icon color white
  sx={{
    bgcolor: "#24292E",
    ":hover": { bgcolor: "#181e24" },
    color: "#fff",         // Button text color white
    flex: 1,
    fontWeight: 700,
  }}
  disabled={loading}
  size="large"
  aria-label="Sign in with GitHub"
>
              GitHub
            </Button>
          </Stack>
        </Stack>
      </Paper>
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

export default Login;
