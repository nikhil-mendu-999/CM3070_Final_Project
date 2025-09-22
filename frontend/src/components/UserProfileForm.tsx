import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Grid, TextField, Select, MenuItem, FormControl, InputLabel,
  Button, Snackbar, Alert, Box
} from '@mui/material';
import { getUser, patchUser } from '../api';

const ALL_FIELDS = [
  { key: "legalName", label: "Legal Name" },
  { key: "preferredName", label: "Preferred Name" },
  { key: "username", label: "Username" },
  { key: "nickname", label: "Nickname" },
  { key: "stageName", label: "Stage Name" },
  { key: "religiousName", label: "Religious Name" },
  { key: "gender", label: "Gender" },
  { key: "genderVariants", label: "Gender (Variants, JSON as needed)" },
  { key: "pronouns", label: "Pronouns" },
  { key: "pronounsVariants", label: "Pronouns (Variants, JSON as needed)" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "locale", label: "Locale" },
  { key: "profilePhoto", label: "Profile Photo URL" },
];
const PRIVACY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "context-members", label: "Context Members" },
  { value: "private", label: "Private" },
];

const UserProfileForm = ({ token, onSaved }) => {
  const [fields, setFields] = useState({});
  const [vis, setVis] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const errorRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const profile = await getUser(token);
        setFields(profile || {});
        setVis(profile.fieldVisibilities || {});
      } catch (e) { setError("Failed to load profile."); }
      setLoading(false);
    })();
  }, [token]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await patchUser(token, { ...fields, fieldVisibilities: vis });
      setSuccess('Changes saved!');
      if (onSaved) onSaved();
    } catch (e) {
      setError('Update failed.');
    }
    setLoading(false);
  };

  if (loading) return <Typography sx={{ mt: 4 }} aria-busy="true">Loading...</Typography>;

  return (
    <Card sx={{ maxWidth: 700, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} color="primary" mb={2} id="profile-form-header">
          Edit Personal/Profile Fields
        </Typography>
        <form onSubmit={handleSubmit} noValidate aria-labelledby="profile-form-header">
          <Grid container spacing={2}>
            {ALL_FIELDS.map(f => (
              <Grid item xs={12} md={6} key={f.key}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  {f.key.endsWith('Variants') ? (
                    <TextField
                      label={f.label}
                      value={fields[f.key] ?? ""}
                      onChange={e => setFields({ ...fields, [f.key]: e.target.value })}
                      placeholder={f.label}
                      rows={2}
                      multiline
                      maxRows={3}
                      fullWidth
                      size="small"
                      inputProps={{ maxLength: 300, "aria-label": f.label }}
                    />
                  ) : (
                    <TextField
                      label={f.label}
                      value={fields[f.key] ?? ""}
                      onChange={e => setFields({ ...fields, [f.key]: e.target.value })}
                      type={f.key === "dateOfBirth" ? "date" : "text"}
                      InputLabelProps={f.key === "dateOfBirth" ? { shrink: true } : undefined}
                      maxRows={2}
                      fullWidth
                      size="small"
                      inputProps={{ maxLength: 60, "aria-label": f.label }}
                    />
                  )}
                  <FormControl sx={{ minWidth: 100 }} size="small">
                    <InputLabel>Visibility</InputLabel>
                    <Select
                      value={vis[f.key] ?? "private"}
                      label="Visibility"
                      onChange={e => setVis({ ...vis, [f.key]: e.target.value })}
                      inputProps={{ "aria-label": `Visibility for ${f.label}` }}
                    >
                      {PRIVACY_OPTIONS.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box mt={3}>
            <Button type="submit" color="primary" variant="contained" size="large" disabled={loading} aria-label="Save profile changes">
              Save Changes
            </Button>
          </Box>
        </form>
        <Snackbar open={!!success} autoHideDuration={2500} onClose={() => setSuccess('')}>
          <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
        <Snackbar open={!!error && !!error.length} autoHideDuration={3200} onClose={() => setError('')}>
          <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }} ref={errorRef} tabIndex={-1} role="alert" aria-live="assertive">
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
