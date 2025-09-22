import React, { useEffect, useState, useRef } from 'react';
import {
  Card, CardContent, Box, Typography, TextField, Button, Chip, Select, MenuItem, Snackbar, Alert,
  Stack, IconButton, List, ListItem, Divider, FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DoneIcon from '@mui/icons-material/Done';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import {
  getContexts, getUserContexts, joinContext, leaveContext, getContextMembers, patchMemberRole
} from '../api';

const API_BASE_URL = "http://127.0.0.1:3000";

const ContextSelector = ({
  token, userId, activeContextId, onChange,
}) => {
  const [allContexts, setAllContexts] = useState([]);
  const [myContextIds, setMyContextIds] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const editInputRef = useRef(null);
  const [contextMembers, setContextMembers] = useState([]);
  const [memberError, setMemberError] = useState('');
  const [memberSuccess, setMemberSuccess] = useState('');
  const [membersLoading, setMembersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const [all, mine] = await Promise.all([
          getContexts(token), getUserContexts(token)
        ]);
        if (!cancelled) {
          setAllContexts(all);
          setMyContextIds(mine.map(ctx => ctx.id));
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load contexts.');
      }
    }
    fetchAll(); return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const isMember = (id) => myContextIds.includes(id);

  const doJoin = async (id) => {
    try {
      await joinContext(token, id, userId);
      setMyContextIds(prev => prev.concat(id));
      setSuccess("Joined context!");
    } catch (e) { setError(e.message || 'Failed joining context'); }
  };

  const doLeave = async (id) => {
    try {
      await leaveContext(token, id, userId);
      setMyContextIds(prev => prev.filter(cid => cid !== id));
      if (activeContextId === id) onChange(null);
      setSuccess("Left context.");
    } catch (e) { setError(e.message || 'Failed leaving context'); }
  };

  const startEdit = (ctx) => {
    setEditingId(ctx.id);
    setEditName(ctx.name);
    setError(""); setSuccess("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || editingId === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/contexts/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName.trim() })
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Context updated.");
      setEditingId(null); setEditName("");
      setAllContexts(await getContexts(token));
    } catch (err) { setError(err?.message || "Edit failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this context? All associated memberships and profile contexts will be removed!")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/contexts/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Context deleted.");
      setAllContexts(prev => prev.filter(ctx => ctx.id !== id));
      setMyContextIds(prev => prev.filter(cid => cid !== id));
      if (activeContextId === id) onChange(null);
      setError("");
    } catch (err) { setError(err?.message || "Delete failed"); }
  };

  const filteredContexts = allContexts.filter(ctx =>
    ctx.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    async function fetchMembers() {
      if (!activeContextId) {
        setContextMembers([]);
        return;
      }
      setMembersLoading(true);
      setMemberError('');
      try {
        const members = await getContextMembers(token, activeContextId);
        setContextMembers(members);
      } catch (e) {
        setMemberError(e.message || 'Failed loading members');
      } finally {
        setMembersLoading(false);
      }
    }
    fetchMembers();
  }, [token, activeContextId, success, memberSuccess]);

  const currentUserRole = (() => {
    const m = contextMembers.find((m) => m.userId === userId);
    return m?.role ?? null;
  })();

  async function handleRolePatch(userIdToEdit, newRole) {
    try {
      await patchMemberRole(token, activeContextId, userIdToEdit, newRole);
      setMemberSuccess('Role updated');
    } catch (e) {
      setMemberError('Failed to update role');
    }
  }

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Box mb={2}>
          <TextField
            label="Search contexts"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            size="small"
            sx={{ maxWidth: 250, mr: 2 }}
            inputProps={{ "aria-label": "Search contexts" }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={activeContextId ?? ''}
              onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
              displayEmpty
              inputProps={{ "aria-label": "Context selector" }}
            >
              <MenuItem value="">-- All --</MenuItem>
              {filteredContexts.map(ctx => (
                <MenuItem key={ctx.id} value={ctx.id}>{ctx.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        <List>
          {filteredContexts.map(ctx => (
            <ListItem key={ctx.id} disableGutters sx={{ mb: .5, borderRadius: 2, bgcolor: activeContextId === ctx.id ? "action.selected" : "background.paper" }}>
              <Box flex={1} sx={{ display: "flex", alignItems: "center" }}>
                {editingId === ctx.id ? (
                  <form onSubmit={handleEditSubmit} style={{ display: "inline-flex", alignItems: "center" }}>
                    <TextField
                      inputRef={editInputRef}
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      size="small"
                      sx={{ mr: 2 }}
                      required minLength={2} maxLength={50}
                      label="Edit context name"
                      inputProps={{ "aria-label": "Edit context name" }}
                    />
                    <Button type="submit" size="small" variant="contained" sx={{ mr: 1 }} startIcon={<DoneIcon />} aria-label="Save context name">Save</Button>
                    <Button type="button" onClick={() => setEditingId(null)} size="small" aria-label="Cancel editing">Cancel</Button>
                  </form>
                ) : (
                  <>
                    <Chip
                      label={ctx.name}
                      onClick={() => onChange(ctx.id)}
                      color={activeContextId === ctx.id ? "primary" : "default"}
                      sx={{ fontWeight: 600, mr: 2, cursor: "pointer" }}
                      variant={activeContextId === ctx.id ? "filled" : "outlined"}
                      aria-label={`Context: ${ctx.name}`}
                    />
                    <IconButton onClick={() => startEdit(ctx)} size="small" color="primary" aria-label="Edit context"><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(ctx.id)} size="small" color="error" aria-label="Delete context"><DeleteIcon /></IconButton>
                    {isMember(ctx.id)
                      ? (
                        <Button
                          onClick={() => doLeave(ctx.id)}
                          size="small"
                          color="secondary"
                          startIcon={<ExitToAppIcon />}
                          sx={{ mx: 1 }}
                          aria-label="Leave context"
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button
                          onClick={() => doJoin(ctx.id)}
                          size="small"
                          color="primary"
                          startIcon={<GroupAddIcon />}
                          sx={{ mx: 1 }}
                          aria-label="Join context"
                        >
                          Join
                        </Button>
                      )
                    }
                    {isMember(ctx.id) && (
                      <Chip color="success" label="My context" size="small" sx={{ ml: 1 }} icon={<PersonIcon />} aria-label="This is my context" />
                    )}
                  </>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
        {!!error && (
          <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
            <Alert
              severity="error"
              onClose={() => setError('')}
              sx={{ width: '100%' }}
              tabIndex={-1}
              role="alert"
              aria-live="assertive"
            >{error}</Alert>
          </Snackbar>
        )}
        {!!success && (
          <Snackbar open={!!success} autoHideDuration={2000} onClose={() => setSuccess('')}>
            <Alert
              severity="success"
              onClose={() => setSuccess('')}
              sx={{ width: '100%' }}
            >{success}</Alert>
          </Snackbar>
        )}
        {activeContextId && (
          <Box mt={3} p={2} border={1} borderColor="grey.200" borderRadius={2}>
            <Typography variant="subtitle1" mb={1} fontWeight={600}>Members of this Context:</Typography>
            {membersLoading ? <Typography aria-busy="true">Loading members...</Typography> : null}
            {memberError && <Alert severity="error" role="alert" aria-live="assertive">{memberError}</Alert>}
            {memberSuccess && <Alert severity="success">{memberSuccess}</Alert>}
            {!contextMembers.length && <Typography fontSize={14}>No members!</Typography>}
            {contextMembers.map((member) => (
              <Stack direction="row" gap={2} alignItems="center" key={member.userId} sx={{ mb: 1 }}>
                <Typography>{member.user?.email || `User ${member.userId}`}</Typography>
                <Chip
                  label={member.role === "admin" ? "Admin" : "Member"}
                  color={member.role === "admin" ? "primary" : "default"}
                  icon={member.role === "admin" ? <AdminPanelSettingsIcon /> : undefined}
                  size="small"
                  sx={{ bgcolor: member.role === "admin" ? "primary.main" : "grey.200", color: "#fff" }}
                  aria-label={member.role === "admin" ? "Admin" : "Member"}
                />
                {currentUserRole === "admin" && member.userId !== userId && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleRolePatch(member.userId, member.role === "admin" ? "member" : "admin")}
                    aria-label={member.role === "admin" ? "Demote user" : "Promote to admin"}
                  >
                    {member.role === "admin" ? "Demote" : "Promote to Admin"}
                  </Button>
                )}
              </Stack>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ContextSelector;
