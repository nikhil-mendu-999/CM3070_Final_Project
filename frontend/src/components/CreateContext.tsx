import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, TextField, Button, Snackbar, Alert, Box, Stack, Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { createContext } from '../api';

const CreateContext = ({ token, onCreated }) => {
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const errorRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);
    try {
      await createContext(token, name.trim());
      setName('');
      setSuccess('Context created!');
      if (onCreated) onCreated();
    } catch (e) {
      setError(e?.message || 'Failed to create context');
    }
    setCreating(false);
  };

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  return (
    <Card sx={{ mb: 3, mt: 1, maxWidth: 500 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} color="primary" mb={2} id="create-context-header">
          <AddCircleOutlineIcon sx={{ mb: -.6, mr: 1, fontSize: 22 }} /> Create New Context
        </Typography>
        <form onSubmit={handleSubmit} aria-labelledby="create-context-header">
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <TextField
              label="New context name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              size="small"
              fullWidth
              inputProps={{ "aria-label": "Context name", name: "contextName" }}
              autoFocus
            />
            <Button
              type="submit"
              disabled={creating || !name.trim()}
              variant="contained"
              color="primary"
              size="medium"
              aria-label="Create new context"
            >
              {creating ? 'Creating...' : 'Create Context'}
            </Button>
          </Stack>
        </form>
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
        <Snackbar open={!!success} autoHideDuration={2000} onClose={() => setSuccess('')}>
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

export default CreateContext;
