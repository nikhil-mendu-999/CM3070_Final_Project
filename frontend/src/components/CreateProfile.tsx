import React, { useState, useRef, useEffect } from 'react';
import { createProfile } from '../api';
const visibilityOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "context-members", label: "Context Members Only" },
  { value: "not-sharable", label: "Not Sharable" }
];
interface CreateProfileProps {
  token: string;
  userId: number;
  contexts?: { id: number; name: string }[];
  onCreated?: () => void;
}
const CreateProfile: React.FC<CreateProfileProps> = ({
  token, userId, contexts = [], onCreated
}) => {
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [selectedContextIds, setSelectedContextIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const handlePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Max file size is 5 MB");
      setTimeout(() => setError(''), 4000);
      return;
    }
    setProfilePicture(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('label', label);
      formData.append('displayName', displayName);
      formData.append('visibility', visibility);
      selectedContextIds.forEach(id => formData.append('contextIds', id.toString()));
      if (profilePicture) formData.append('profilePicture', profilePicture);
      await createProfile(token, userId, formData);
      setSuccess('Profile created!');
      setName('');
      setLabel('');
      setDisplayName('');
      setSelectedContextIds([]);
      setVisibility('private');
      setProfilePicture(null);
      if (typeof onCreated === "function") onCreated();
    } catch (err: any) {
      setError(err?.message || 'Failed to create profile');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  return (
    <form onSubmit={handleSubmit} style={styles.formCard} aria-label="Create new profile form">
      <h3 style={styles.header}>Create New Profile</h3>
      <div style={styles.inlineForm}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Unique Profile Name"
          required
          style={styles.input}
          aria-label="Unique Profile Name"
        />
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Descriptive Label"
          required
          style={styles.input}
          aria-label="Descriptive Label"
        />
        <input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Profile Display Name"
          required
          style={styles.input}
          aria-label="Profile Display Name"
        />
        <select
          multiple
          value={selectedContextIds.map(String)}
          onChange={e => {
            const opts = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
            setSelectedContextIds(opts);
          }}
          style={styles.select}
          aria-label="Select contexts"
        >
          {contexts.map(ctx => (
            <option key={ctx.id} value={ctx.id}>{ctx.name}</option>
          ))}
        </select>
        <select
          value={visibility}
          onChange={e => setVisibility(e.target.value)}
          style={styles.select}
          aria-label="Select profile visibility"
        >
          {visibilityOptions.map(v => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handlePicture}
          style={styles.input}
          aria-label="Profile picture"
        />
        <button
          type="submit"
          disabled={loading || !name || !label || !displayName}
          style={styles.primaryBtn}
          aria-label="Create profile"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
      {error &&
        <div ref={errorRef} style={styles.error} tabIndex={-1} role="alert" aria-live="assertive">
          {error}
        </div>
      }
      {success && <div style={styles.success}>{success}</div>}
      {selectedContextIds.length === 0 && (
        <div style={styles.contextWarning}>
          No context selected. This profile will be created, but not attached to a context.
        </div>
      )}
    </form>
  );
};

const styles = {
  formCard: {
    background: "#fbfbfb",
    padding: 18,
    borderRadius: 13,
    marginBottom: 24,
    border: "1px solid #e6e6e6",
    boxShadow: "0 2px 16px 0 rgba(0,0,0,.06)"
  },
  inlineForm: {
    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'
  },
  header: { marginTop: 0, fontWeight: 700, fontSize: 20, marginBottom: 8, color: "#447AC9" },
  input: {
    flex: 1, padding: '9px 11px', borderRadius: 7, border: "1px solid #bdbdbd", fontSize: 15, minWidth: 180
  },
  select: {
    padding: '9px', borderRadius: 7, border: "1px solid #bdbdbd", fontSize: 15, minWidth: 180
  },
  primaryBtn: {
    background: "#447AC9", color: "white", border: "none",
    padding: "9px 14px", borderRadius: 8, fontWeight: "bold", fontSize: 15, cursor: "pointer"
  },
  error: {
    color: "white", background: "#C94444", borderRadius: 7, fontWeight: "bold",
    fontSize: 14, padding: '8px 10px', marginTop: "8px", textAlign: "center"
  },
  success: {
    color: "#208720", background: "#e6ffe6", borderRadius: 7, fontWeight: "bold",
    fontSize: 14, padding: '8px 10px', marginTop: "8px", textAlign: "center"
  },
  contextWarning: {
    color: "#666", fontSize: 13, marginTop: 10, background: "#f3f6fa", borderRadius: 7, padding: "7px"
  }
};

export default CreateProfile;
