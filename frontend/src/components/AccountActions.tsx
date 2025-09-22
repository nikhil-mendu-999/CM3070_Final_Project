import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Button, Snackbar, Alert, Typography, Stack
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAccountExport, deleteAccount } from '../api';

const AccountActions = ({ token, onLogout }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const errorRef = useRef(null);

  const handleExport = async () => {
    setError('');
    setSuccess('');
    try {
      const data = await getAccountExport(token);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-account-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess("Account data exported as my-account-export.json");
    } catch (err) {
      setError("Failed to export account: " + (err?.message || err));
    }
  };

  const handleDelete = async () => {
    setError('');
    setSuccess('');
    if (!window.confirm("Are you sure you want to DELETE your account and erase all data? This cannot be undone.")) return;
    try {
      await deleteAccount(token);
      setSuccess("Account deleted. You will now be logged out.");
      setTimeout(() => {
        setSuccess('');
        onLogout();
      }, 2300);
    } catch (err) {
      setError("Failed to delete account: " + (err?.message || err));
    }
  };

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  return (
    <Card elevation={3} sx={{ mb: 4, maxWidth: 560 }}>
      <CardContent>
        <Typography variant="h6" mb={2} fontWeight={600} color="primary" id="account-actions-header">
          Account Actions
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Button
            onClick={handleExport}
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            sx={{ minWidth: 170 }}
            aria-label="Export my account data"
          >
            Export My Data (GDPR)
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ minWidth: 170 }}
            aria-label="Delete my account"
          >
            Delete My Account
          </Button>
        </Stack>
        <Snackbar open={!!error} autoHideDuration={3500} onClose={() => setError('')}>
          <Alert
            severity="error"
            onClose={() => setError('')}
            ref={errorRef}
            sx={{ width: '100%' }}
            tabIndex={-1}
            role="alert"
            aria-live="assertive"
          >{error}</Alert>
        </Snackbar>
        <Snackbar open={!!success} autoHideDuration={2400} onClose={() => setSuccess('')}>
          <Alert
            severity="success"
            onClose={() => setSuccess('')}
            sx={{ width: '100%' }}
          >{success}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default AccountActions;
