import React, { useState, useEffect, useRef } from 'react';
import {
  Typography, Box, TextField, Button, Select, MenuItem, InputLabel,
  FormControl, Snackbar, Alert, Avatar, Grid, Chip, Card, CardContent
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getProfile, getContexts, patchProfile } from '../api';

const CONTEXT_OPTIONS = [
  'Professional', 'Job Seeking', 'Social', 'Personal', 'Gaming', 'Other'
];
const GENDER_OPTIONS = [
  'Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Custom'
];
const SEXUALITY_OPTIONS = [
  'Straight', 'Gay', 'Lesbian', 'Bisexual', 'Prefer not to say', 'Custom'
];
const RELATIONSHIP_OPTIONS = [
  'Single', 'In a relationship', 'Married', 'Divorced', 'Widowed',
  "It's complicated", 'Prefer not to say', 'Custom'
];
const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'context-members', label: 'Context Members' },
  { value: 'not-sharable', label: 'Not sharable' }
];

function safeVisibility(value) {
  return ['public', 'private', 'context-members', 'not-sharable'].includes(value) ? value : 'private';
}
function nonNull(value) {
  return value !== undefined && value !== null ? value : '';
}

export default function EditProfile({ token, userId, profileId, onSaved }) {
  const [fields, setFields] = useState({
    name: '', label: '', context: '', displayName: '',
    gender: '', customGender: '', sexuality: '', customSexuality: '',
    relationshipStatus: '', customRelationship: '', visibility: 'private'
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [contexts, setContexts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [contextFields, setContextFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const nameInput = useRef(null);

  async function fetchAndPopulate() {
    setLoading(true);
    try {
      const prof = await getProfile(userId, token, profileId);
      setFields({
        name: nonNull(prof.name),
        label: nonNull(prof.label),
        context: nonNull(prof.context),
        displayName: nonNull(prof.displayName),
        gender: nonNull(prof.gender),
        customGender: nonNull(prof.genderCustom),
        sexuality: nonNull(prof.sexuality),
        customSexuality: nonNull(prof.sexualityCustom),
        relationshipStatus: nonNull(prof.relationshipStatus),
        customRelationship: nonNull(prof.relationshipStatusCustom),
        visibility: safeVisibility(prof.visibility)
      });
      setProfilePicturePreview(prof.profilePicture || '');
      setProfilePicture(null);
      const profileContexts = Array.isArray(prof.contexts) ? prof.contexts : [];
      setSelected(profileContexts.map(c => c.contextId));
      setContextFields(Object.fromEntries(
        profileContexts.map(c => [
          c.contextId,
          {
            displayName: nonNull(c.displayName),
            visibility: safeVisibility(c.visibility)
          }
        ])
      ));
    } catch (e) {
      setError('Could not load profile details.');
    }
    try {
      setContexts(await getContexts(token));
    } catch (e) {
      setError('Could not load context list.');
    }
    setLoading(false);
    if (nameInput.current) nameInput.current.focus();
  }
  useEffect(() => { fetchAndPopulate(); }, [userId, profileId, token]);
  function handlePicture(e) {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Max file size is 5 MB");
      return;
    }
    setProfilePicture(file);
    setProfilePicturePreview(file ? URL.createObjectURL(file) : '');
  }
  const handleField = key => e =>
    setFields(f => ({ ...f, [key]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const contextChanges = selected.map(contextId => ({
      contextId,
      displayName: nonNull(contextFields[contextId]?.displayName),
      visibility: safeVisibility(contextFields[contextId]?.visibility)
    }));
    const finalGender =
      fields.gender !== 'Custom' ? fields.gender : fields.customGender;
    const finalSexuality =
      fields.sexuality !== 'Custom' ? fields.sexuality : fields.customSexuality;
    const finalRelationship =
      fields.relationshipStatus !== 'Custom'
        ? fields.relationshipStatus
        : fields.customRelationship;
    try {
      if (profilePicture) {
        const formData = new FormData();
        formData.append('name', fields.name);
        formData.append('label', fields.label);
        formData.append('displayName', fields.displayName);
        formData.append('gender', finalGender);
        formData.append('genderCustom', fields.gender === 'Custom' ? fields.customGender : '');
        formData.append('sexuality', finalSexuality);
        formData.append('sexualityCustom', fields.sexuality === 'Custom' ? fields.customSexuality : '');
        formData.append('relationshipStatus', finalRelationship);
        formData.append('relationshipStatusCustom', fields.relationshipStatus === 'Custom' ? fields.customRelationship : '');
        formData.append('visibility', safeVisibility(fields.visibility));
        formData.append('contextChanges', JSON.stringify(contextChanges));
        formData.append('profilePicture', profilePicture);
        await patchProfile(token, userId, profileId, formData);
      } else {
        const jsonData = {
          name: fields.name,
          label: fields.label,
          displayName: fields.displayName,
          gender: finalGender,
          genderCustom: fields.gender === 'Custom' ? fields.customGender : '',
          sexuality: finalSexuality,
          sexualityCustom: fields.sexuality === 'Custom' ? fields.customSexuality : '',
          relationshipStatus: finalRelationship,
          relationshipStatusCustom: fields.relationshipStatus === 'Custom' ? fields.customRelationship : '',
          visibility: safeVisibility(fields.visibility),
          contextChanges
        };
        await patchProfile(token, userId, profileId, jsonData);
      }
      setSuccess('Profile updated!');
      fetchAndPopulate();
      if (onSaved) onSaved();
    } catch (e) {
      setError('Failed to save changes. ' + (e?.message || ''));
    }
  };
  useEffect(() => {
    if ((error || success) && nameInput.current) {
      nameInput.current.focus();
    }
  }, [error, success]);
  if (loading) return <Typography align="center" mt={6} aria-busy="true">Loading...</Typography>;
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafe" }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Card elevation={5} sx={{ width: "100%", maxWidth: 900, mx: 'auto', p: 3 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate aria-labelledby="edit-profile-header">
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h5" fontWeight={700} mb={3} color="primary" id="edit-profile-header">Edit Profile</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Descriptive Label"
                    value={fields.label}
                    onChange={handleField('label')}
                    required
                    inputRef={nameInput}
                    fullWidth
                    sx={{ minWidth: 260 }}
                    inputProps={{ maxLength: 60, "aria-label": "Descriptive label" }}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ minWidth: 260 }}>
                    <InputLabel>Context</InputLabel>
                    <Select
                      value={fields.context}
                      label="Context"
                      onChange={handleField('context')}
                      required
                      inputProps={{ "aria-label": "Profile context" }}
                    >
                      <MenuItem value=""><em>Select context</em></MenuItem>
                      {CONTEXT_OPTIONS.map(c => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar src={profilePicturePreview || undefined} sx={{ width: 60, height: 60 }} />
                  <Button variant="contained" component="label" color="primary" startIcon={<PhotoCamera />}>
                    Photo
                    <input hidden type="file" accept="image/*" onChange={handlePicture} aria-label="Profile picture upload"/>
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Profile Display Name"
                    value={fields.displayName}
                    onChange={handleField('displayName')}
                    required
                    fullWidth
                    sx={{ minWidth: 260 }}
                    inputProps={{ maxLength: 50, "aria-label": "Profile display name" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ minWidth: 260 }}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={fields.gender}
                      label="Gender"
                      onChange={handleField('gender')}
                      required
                      inputProps={{ "aria-label": "Gender" }}
                    >
                      <MenuItem value=""><em>Select Gender</em></MenuItem>
                      {GENDER_OPTIONS.map(g => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {fields.gender === 'Custom' && (
                  <Grid item xs={12}>
                    <TextField
                      label="Custom Gender"
                      value={fields.customGender}
                      onChange={handleField('customGender')}
                      required
                      inputProps={{ maxLength: 30, "aria-label": "Custom gender" }}
                      fullWidth
                      sx={{ minWidth: 260 }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ minWidth: 260 }}>
                    <InputLabel>Sexuality</InputLabel>
                    <Select
                      value={fields.sexuality}
                      label="Sexuality"
                      onChange={handleField('sexuality')}
                      required
                      inputProps={{ "aria-label": "Sexuality" }}
                    >
                      <MenuItem value=""><em>Select Sexuality</em></MenuItem>
                      {SEXUALITY_OPTIONS.map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {fields.sexuality === 'Custom' && (
                  <Grid item xs={12}>
                    <TextField
                      label="Custom Sexuality"
                      value={fields.customSexuality}
                      onChange={handleField('customSexuality')}
                      required
                      inputProps={{ maxLength: 30, "aria-label": "Custom sexuality" }}
                      fullWidth
                      sx={{ minWidth: 260 }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ minWidth: 260 }}>
                    <InputLabel>Relationship Status</InputLabel>
                    <Select
                      value={fields.relationshipStatus}
                      label="Relationship Status"
                      onChange={handleField('relationshipStatus')}
                      required
                      inputProps={{ "aria-label": "Relationship status" }}
                    >
                      <MenuItem value=""><em>Select status</em></MenuItem>
                      {RELATIONSHIP_OPTIONS.map(r => (
                        <MenuItem key={r} value={r}>{r}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {fields.relationshipStatus === 'Custom' && (
                  <Grid item xs={12}>
                    <TextField
                      label="Custom Relationship"
                      value={fields.customRelationship}
                      onChange={handleField('customRelationship')}
                      required
                      inputProps={{ maxLength: 30, "aria-label": "Custom relationship" }}
                      fullWidth
                      sx={{ minWidth: 260 }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ minWidth: 260 }}>
                    <InputLabel>Visibility</InputLabel>
                    <Select
                      value={fields.visibility}
                      label="Visibility"
                      onChange={handleField('visibility')}
                      required
                      inputProps={{ "aria-label": "Profile visibility" }}
                    >
                      {VISIBILITY_OPTIONS.map(o => (
                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography mb={1.2}>Contexts:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                    {contexts.map(ctx => (
                      <Chip
                        key={ctx.id}
                        label={ctx.name}
                        color={selected.includes(ctx.id) ? "primary" : "default"}
                        onClick={() => setSelected(
                          selected.includes(ctx.id)
                            ? selected.filter(id => id !== ctx.id)
                            : [...selected, ctx.id]
                        )}
                        variant={selected.includes(ctx.id) ? "filled" : "outlined"}
                        clickable
                        aria-label={`Context: ${ctx.name}`}
                      />
                    ))}
                  </Box>
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      {selected.map(ctxId => (
                        <React.Fragment key={ctxId}>
                          <Grid item xs={12} md={7}>
                            <TextField
                              label={`Display Name for ${contexts.find(c => c.id === ctxId)?.name || ''}`}
                              value={contextFields[ctxId]?.displayName || ''}
                              onChange={e => setContextFields(fields => ({
                                ...fields,
                                [ctxId]: { ...fields[ctxId], displayName: e.target.value }
                              }))}
                              fullWidth
                              sx={{ minWidth: 220 }}
                              size="small"
                              inputProps={{ "aria-label": `Display name (${contexts.find(c => c.id === ctxId)?.name || ''})` }}
                            />
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
                              <InputLabel>Visibility</InputLabel>
                              <Select
                                value={contextFields[ctxId]?.visibility || 'private'}
                                label="Visibility"
                                onChange={e => setContextFields(fields => ({
                                  ...fields,
                                  [ctxId]: { ...fields[ctxId], visibility: safeVisibility(e.target.value) }
                                }))}
                                inputProps={{ "aria-label": `Visibility (${contexts.find(c => c.id === ctxId)?.name || ''})` }}
                              >
                                <MenuItem value="private">Private</MenuItem>
                                <MenuItem value="context-members">Context Members</MenuItem>
                                <MenuItem value="public">Public</MenuItem>
                                <MenuItem value="not-sharable">Not sharable</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Button type="submit" variant="contained" fullWidth size="large" color="primary" aria-label="Save profile changes">
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Snackbar open={!!success} autoHideDuration={2500} onClose={() => setSuccess('')}>
              <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>
                {success}
              </Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={3500} onClose={() => setError('')}>
              <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }} tabIndex={-1} role="alert" aria-live="assertive">
                {error}
              </Alert>
            </Snackbar>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
