import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CircularProgress, Alert } from "@mui/material";

export default function MyAuditLogs({ token }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    setLoading(true); setError('');
    fetch("http://127.0.0.1:3000/audit-logs/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => resp.ok ? resp.json() : Promise.reject("Failed to load logs"))
      .then(data => setLogs(data))
      .catch(e => setError(e.toString()))
      .finally(() => setLoading(false));
  }, [token]);
  return (
    <Box mt={5} maxWidth={700} mx="auto">
      <Typography variant="h4" mb={2} fontWeight={700}>My Activity Log</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && logs.length === 0 && (
        <Card><CardContent><Typography>No activity found.</Typography></CardContent></Card>
      )}
      {!loading && logs.length > 0 && (
        <Box>
          {logs.map(l => (
            <Card key={l.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography><b>When:</b> {new Date(l.createdAt).toLocaleString()}</Typography>
                <Typography><b>Action:</b> {l.action}</Typography>
                <Typography><b>Target:</b> {l.target || "(N/A)"}</Typography>
                <Typography variant="body2" color="text.secondary">{l.message?.slice(0, 100)}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
