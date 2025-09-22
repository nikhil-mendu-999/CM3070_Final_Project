import React, { useEffect, useState, useRef } from "react";
import { getContextMembers, patchMemberRole } from "../api";

interface ContextAdminPanelProps {
  token: string;
  contextId: number;
}

export default function ContextAdminPanel({ token, contextId }: ContextAdminPanelProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setMembers(await getContextMembers(token, contextId));
      } catch (e: any) {
        setError(e.message || "Could not fetch members");
      }
      setLoading(false);
    })();
  }, [contextId, token, success]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      await patchMemberRole(token, contextId, userId, role);
      setSuccess(`Updated user ${userId} to ${role}`);
      setTimeout(() => setSuccess(''), 1600);
    } catch (e: any) {
      setError(e.message || "Failed to update role");
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div
      style={{ maxWidth: 520, margin: '18px auto', padding: 10, border: '1px solid #eee', borderRadius: 10 }}
      aria-labelledby="context-admin-panel-header"
    >
      <h4 id="context-admin-panel-header">Admin Panel: Context Members</h4>
      {loading && <div aria-busy="true">Loading...</div>}
      {error && <div style={{ color: "red" }} ref={errorRef} role="alert" tabIndex={-1}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <ul style={{ paddingLeft: 0 }}>
        {members.map(mem => (
          <li key={mem.userId} style={{ listStyle: 'none', marginBottom: 7 }}>
            <b>{mem.user?.email ?? `User ${mem.userId}`}</b> ({mem.role})
            <button
              style={{
                marginLeft: 12,
                opacity: mem.role === "admin" ? 0.8 : 1,
                cursor: mem.role === "admin" ? "not-allowed" : "pointer",
              }}
              disabled={mem.role === "admin"}
              onClick={() => handleRoleChange(mem.userId, mem.role === "admin" ? "member" : "admin")}
              aria-label={mem.role === "admin"
                ? `Demote admin ${mem.user?.email ?? mem.userId}`
                : `Promote member ${mem.user?.email ?? mem.userId}`
              }
            >
              {mem.role === "admin" ? "Demote" : "Promote"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
