import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Grid, Button, Chip, Avatar, TextField, MenuItem,
  Select, FormControl, InputLabel, Snackbar, Alert, Stack, IconButton, Pagination, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getProfiles, getContexts, createProfile, deleteProfile } from '../api';

const ITEMS_PER_PAGE = 4;
const visibilityLabels = {
  public: "Public", private: "Private", "context-members": "Context Members", "not-sharable": "Not Sharable"
};
const visibilityColors = {
  public: "success", private: "default", "context-members": "primary", "not-sharable": "error"
};

const ProfileCard = ({ profile, onEdit, onDelete }) => {
  const hasIdentityInfo = profile.gender || profile.sexuality || profile.relationshipStatus;
  return (
    <Card elevation={3} sx={{ position: 'relative', borderRadius: 3, overflow: 'visible', mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" mb={2}>
          <Avatar
            src={profile.profilePicture || undefined}
            sx={{ width: 64, height: 64, bgcolor: '#447AC9', mr: 2, fontSize: '1.5rem' }}
            aria-label="Profile picture"
          >
            {profile.displayName?.charAt(0) || profile.label?.charAt(0) || "?"}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight={700} mb={0.5}>
              {profile.displayName || profile.label || 'Unnamed Profile'}
            </Typography>
            {profile.label && profile.displayName && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                Label: {profile.label}
              </Typography>
            )}
            <Chip
              icon={<VisibilityIcon />}
              label={visibilityLabels[profile.visibility] || 'Private'}
              color={visibilityColors[profile.visibility] || 'default'}
              size="small"
              aria-label={`Visibility: ${visibilityLabels[profile.visibility] || 'Private'}`}
            />
          </Box>
          <Stack direction="row" gap={1}>
            <IconButton color="primary" onClick={() => onEdit(profile.id)} size="small" aria-label="Edit profile">
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(profile.id)} size="small" aria-label="Delete profile">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }} />
        {hasIdentityInfo && (
          <Box mb={2}>
            <Typography variant="subtitle2" color="primary" mb={1} fontWeight={600}>
              <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              Identity Details
            </Typography>
            <Grid columns={12} columnSpacing={2}>
              {profile.gender && (
                <Box gridColumn="span 12 md:span 4">
                  <Typography variant="body2">
                    <strong>Gender:</strong> {profile.gender}
                  </Typography>
                </Box>
              )}
              {profile.sexuality && (
                <Box gridColumn="span 12 md:span 4">
                  <Typography variant="body2">
                    <strong>Sexuality:</strong> {profile.sexuality}
                  </Typography>
                </Box>
              )}
              {profile.relationshipStatus && (
                <Box gridColumn="span 12 md:span 4">
                  <Typography variant="body2">
                    <FavoriteIcon sx={{ fontSize: 14, mr: 0.5, color: 'error.main' }} />
                    {profile.relationshipStatus}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Box>
        )}
        {profile.context && (
          <Box mb={2}>
            <Typography variant="subtitle2" color="primary" mb={1} fontWeight={600}>
              <BusinessIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              Context
            </Typography>
            <Chip label={profile.context} variant="outlined" size="small" />
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="caption" color="text.secondary">
            Profile ID: #{profile.id}
          </Typography>
          {profile.createdAt && (
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(profile.createdAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const Profiles = ({
  token, userId, contextId, onEditProfile,
  showOnlyForm = false, showOnlyList = false
}) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newProfile, setNewProfile] = useState({ name: '', label: '', displayName: '', profilePicture: null });
  const [profileVisibility, setProfileVisibility] = useState('private');
  const [contexts, setContexts] = useState([]);
  const [selectedContextIds, setSelectedContextIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!token || !userId) return;
    (async () => {
      try {
        setContexts(await getContexts(token));
      } catch { setError('Failed to load contexts.'); }
    })();
  }, [token, userId]);

  const fetchProfiles = async () => {
    if (!token || !userId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getProfiles(userId, token, contextId ?? undefined);
      setProfiles(data);
      setPage(1);
    } catch (e) {
      setError(e.message || 'Failed to load profiles.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token && userId) fetchProfiles();
  }, [token, userId, contextId]);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!newProfile.label.trim() || !newProfile.displayName.trim()) return;
    try {
      const formData = new FormData();
      formData.append('name', newProfile.name.trim());
      formData.append('label', newProfile.label.trim());
      formData.append('displayName', newProfile.displayName.trim());
      formData.append('visibility', profileVisibility);
      selectedContextIds.forEach(id => formData.append('contextIds', id));
      if (newProfile.profilePicture) formData.append('profilePicture', newProfile.profilePicture);
      await createProfile(token, userId, formData);
      setNewProfile({ name: '', label: '', displayName: '', profilePicture: null });
      setSelectedContextIds([]);
      setProfileVisibility('private');
      setSuccess('Profile created.');
      fetchProfiles();
    } catch (err) {
      setError(err.message || 'Failed to create profile.');
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm("Are you sure you want to delete this profile? This cannot be undone.")) return;
    try {
      await deleteProfile(token, userId, profileId);
      fetchProfiles();
      setSuccess("Profile deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete profile.");
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    (profile.displayName || profile.label || profile.name || '')
      .toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE));
  const profilesToShow = filteredProfiles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (!token || !userId) {
    return <Typography>Please log in to view profiles.</Typography>;
  }

  return (
    <Box>
      {!showOnlyList && (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" fontWeight={600} mb={2}>
              <AddCircleIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Create New Profile
            </Typography>
            <form onSubmit={handleCreateProfile} aria-label="Create new profile form">
              <Stack spacing={2}>
                <Grid columns={12} columnSpacing={2}>
                  <Box gridColumn="span 12 md:span 4">
                    <TextField
                      label="Profile Name"
                      value={newProfile.name}
                      onChange={e => setNewProfile({ ...newProfile, name: e.target.value })}
                      size="small"
                      fullWidth
                      required
                      inputProps={{ name: "profileName" }}
                    />
                  </Box>
                  <Box gridColumn="span 12 md:span 4">
                    <TextField
                      label="Label"
                      value={newProfile.label}
                      onChange={e => setNewProfile({ ...newProfile, label: e.target.value })}
                      size="small"
                      fullWidth
                      required
                      inputProps={{ name: "label" }}
                    />
                  </Box>
                  <Box gridColumn="span 12 md:span 4">
                    <TextField
                      label="Display Name"
                      value={newProfile.displayName}
                      onChange={e => setNewProfile({ ...newProfile, displayName: e.target.value })}
                      size="small"
                      fullWidth
                      required
                      inputProps={{ name: "displayName" }}
                    />
                  </Box>
                </Grid>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Contexts</InputLabel>
                    <Select
                      label="Contexts"
                      multiple
                      value={selectedContextIds.map(String)}
                      onChange={e => setSelectedContextIds(Array.from(e.target.value, Number))}
                      renderValue={selected => selected.length > 0 ? `${selected.length} selected` : 'None'}
                    >
                      {contexts.map(ctx => (
                        <MenuItem key={ctx.id} value={String(ctx.id)}>{ctx.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Visibility</InputLabel>
                    <Select
                      label="Visibility"
                      value={profileVisibility}
                      onChange={e => setProfileVisibility(e.target.value)}
                    >
                      {Object.entries(visibilityLabels).map(([v, label]) => (
                        <MenuItem key={v} value={v}>{label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" component="label" size="small">
                    Photo
                    <input hidden type="file"
                      accept="image/*"
                      onChange={e => setNewProfile({
                        ...newProfile,
                        profilePicture: e.target.files ? e.target.files[0] : null
                      })}
                    />
                  </Button>
                  <Button type="submit" variant="contained" color="primary" size="medium" aria-label="Create profile">
                    Create
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
      )}
      {!showOnlyForm && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>
              Your Profiles ({filteredProfiles.length})
            </Typography>
            <TextField
              label="Search Profiles"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              size="small"
              sx={{ maxWidth: 280 }}
              inputProps={{ "aria-label": "Search profiles" }}
            />
          </Box>
          {loading ? (
            <Typography aria-busy="true">Loading profiles...</Typography>
          ) : error ? (
            <Alert severity="error" tabIndex={-1} role="alert" aria-live="assertive">{error}</Alert>
          ) : !filteredProfiles.length ? (
            <Typography color="text.secondary">No profiles found.</Typography>
          ) : (
            <>
              <Stack spacing={2} aria-label="Profile list">
                {profilesToShow.map(profile => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onEdit={onEditProfile}
                    onDelete={handleDeleteProfile}
                  />
                ))}
              </Stack>
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                    color="primary"
                    size="large"
                    aria-label="Profile list pages"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
      <Snackbar open={!!success} autoHideDuration={2400} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error && !!error.length} autoHideDuration={4200} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')} tabIndex={-1} role="alert" aria-live="assertive">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Profiles;
