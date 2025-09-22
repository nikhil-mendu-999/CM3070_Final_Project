import React, { useEffect, useState, useRef } from "react";
const API_BASE_URL = "http://127.0.0.1:3000";

type AuditLog = {
  id: number;
  createdAt: string;
  userId?: number;
  contextId?: number;
  profileId?: number;
  action: string;
  target?: string;
  message?: string;
  before?: any;
  after?: any;
};

export default function AuditLogDashboard({ token }: { token: string }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      setLogs(await res.json());
    } catch (e: any) {
      setError(e.message || "Could not fetch audit logs");
    }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, [token]);
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: 16 }}>
      <h2 id="audit-log-heading">Audit Log Dashboard</h2>
      {loading && <p aria-busy="true">Loading logs...</p>}
      {error && <div style={{ color: "red" }} ref={errorRef} role="alert" tabIndex={-1}>{error}</div>}
      <table
        style={{ width: "100%", fontSize: 14, borderSpacing: 0 }}
        aria-label="Audit logs table"
        aria-describedby="audit-log-heading"
      >
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Time</th>
            <th scope="col">User</th>
            <th scope="col">Action</th>
            <th scope="col">Target</th>
            <th scope="col">Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
              <td>{l.userId ?? ''}</td>
              <td>{l.action}</td>
              <td>{l.target || ''}</td>
              <td>{l.message?.slice(0, 80) ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
