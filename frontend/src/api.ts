const API_BASE_URL = 'http://127.0.0.1:3000';
// Auth
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return await response.json();
}
// Advanced USER profile/fields
export async function getUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return await response.json();
}
export async function patchUser(token: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return await response.json();
}
// Contexts
export async function getContexts(token: string) {
  const response = await fetch(`${API_BASE_URL}/contexts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorData;
    try { errorData = await response.json(); } catch { errorData = null; }
    throw new Error(
      errorData?.message ||
      errorData?.error ||
      `Failed to fetch contexts (status ${response.status})`
    );
  }
  return await response.json();
}
export async function getUserContexts(token: string) {
  const response = await fetch(`${API_BASE_URL}/contexts/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch user contexts');
  return await response.json();
}
export async function joinContext(token: string, contextId: number, userId: number) {
  const response = await fetch(`${API_BASE_URL}/contexts/${contextId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error('Failed to join context');
  return await response.json();
}
export async function leaveContext(token: string, contextId: number, userId: number) {
  const response = await fetch(`${API_BASE_URL}/contexts/${contextId}/members/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to leave context');
  return await response.json();
}
// Profiles API
export async function getProfiles(
  userId: number,
  token: string,
  contextId?: number | null
) {
  let url = `${API_BASE_URL}/users/${userId}/profiles`;
  if (contextId !== undefined && contextId !== null) url += `?contextId=${contextId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorData;
    try { errorData = await response.json(); } catch { errorData = null; }
    throw new Error(
      errorData?.message ||
      errorData?.error ||
      `Failed to fetch profiles (status ${response.status})`
    );
  }
  return await response.json();
}
export async function createContext(token: string, name: string) {
  const response = await fetch(`${API_BASE_URL}/contexts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    let error;
    try { error = await response.json(); } catch { error = null; }
    throw new Error(error?.message || 'Failed to create context');
  }
  return await response.json();
}
// Advanced profile creation with new fields and file upload
export async function createProfile(
  token: string,
  userId: number,
  profileData: {
    name: string,
    contextIds: number[],
    visibility: string,
    label?: string,
    displayName?: string,
    gender?: string,
    sexuality?: string,
    relationshipStatus?: string,
    profilePicture?: File,
    context?: string
  } | FormData // Accepts either direct FormData or object
) {
  let formData;
  if (profileData instanceof FormData) {
    formData = profileData;
  } else {
    formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('visibility', profileData.visibility);
    if (Array.isArray(profileData.contextIds)) {
      profileData.contextIds.forEach(id =>
        formData.append('contextIds', id.toString())
      );
    }
    if (profileData.label) formData.append('label', profileData.label);
    if (profileData.displayName) formData.append('displayName', profileData.displayName);
    if (profileData.gender) formData.append('gender', profileData.gender);
    if (profileData.sexuality) formData.append('sexuality', profileData.sexuality);
    if (profileData.relationshipStatus) formData.append('relationshipStatus', profileData.relationshipStatus);
    if (profileData.context) formData.append('context', profileData.context);
    if (profileData.profilePicture) formData.append('profilePicture', profileData.profilePicture);
  }
  // FIX: endpoint is now /users/:userId/profiles (no /create)
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profiles/create`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!response.ok) {
    let errorData;
    try { errorData = await response.json(); } catch { errorData = null; }
    throw new Error(
      errorData?.message ||
      errorData?.error ||
      `Failed to create profile (status ${response.status})`
    );
  }
  return await response.json();
}
export async function getProfile(userId: number, token: string, profileId: number) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profiles`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to load profile");
  const profiles = await response.json();
  // Ensures you get the fully populated profile
  return profiles.find((p: any) => p.id === Number(profileId));
}
// PATCH with support for advanced fields and file upload
export async function patchProfile(
  token: string,
  userId: number,
  profileId: number,
  data: any
) {
  let body, headers;
  // Use FormData only if data is FormData or contains File
  if (data instanceof FormData) {
    body = data;
    headers = { Authorization: `Bearer ${token}` };
  } else if (
    data.profilePicture &&
    (typeof File !== 'undefined' && data.profilePicture instanceof File)
  ) {
    body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'contextChanges') {
        // Always JSON.stringify! (and omit 'context' field for PATCH)
        body.append(key, JSON.stringify(value));
      } else if (key !== 'context' && value !== undefined && value !== null) {
        body.append(key, value);
      }
    });
    headers = { Authorization: `Bearer ${token}` };
  } else {
    // Remove undefined/null and 'context'
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([k, v]) => v !== undefined && v !== null && k !== 'context')
    );
    body = JSON.stringify(cleaned);
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/profiles/${profileId}`,
    {
      method: 'PATCH',
      headers,
      body,
    }
  );
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    console.error(
      'PATCH failed',
      { status: response.status, error: errorData }
    );
    throw new Error(
      (Array.isArray(errorData?.message)
        ? errorData.message.join(', ')
        : (errorData?.message || errorData?.error))
      || `Failed to update profile (status ${response.status})`
    );
  }
  return await response.json();
}
// GDPR/Data
export async function getAccountExport(token: string) {
  const response = await fetch(`${API_BASE_URL}/contexts/me/export`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorData;
    try { errorData = await response.json(); } catch { errorData = null; }
    throw new Error(
      errorData?.message ||
      errorData?.error ||
      `Failed to export account (status ${response.status})`
    );
  }
  return await response.json();
}
export async function deleteAccount(token: string) {
  const response = await fetch(`${API_BASE_URL}/contexts/me`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorData;
    try { errorData = await response.json(); } catch { errorData = null; }
    throw new Error(
      errorData?.message ||
      errorData?.error ||
      `Failed to delete account (status ${response.status})`
    );
  }
  return await response.json();
}
export async function deleteProfile(token: string, userId: number, profileId: number) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profiles/${profileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    let error;
    try { error = await response.json(); } catch { error = null; }
    throw new Error(error?.message || 'Failed to delete profile');
  }
  return await response.json();
}
// Context admin/member functions
export async function getContextMembers(token: string, contextId: number) {
  const response = await fetch(`${API_BASE_URL}/contexts/${contextId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch members');
  return await response.json();
}
export async function patchMemberRole(token: string, contextId: number, userId: number, role: string) {
  const response = await fetch(`${API_BASE_URL}/contexts/${contextId}/members/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) throw new Error('Failed to update member role');
  return await response.json();
}
// OIDC Consent/SSO functions
export async function getSharableIdentities(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/sharable-identities`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to load identities for consent');
  return await response.json();
}
export async function grantConsent(token: string, body: {
  clientId: string,
  redirectUri: string,
  profileId: number,
  attributes: string[],
  scope?: string,
  state?: string
}) {
  const response = await fetch(`${API_BASE_URL}/auth/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error('Failed to grant consent');
  return await response.json();
}
export async function getMyConsents(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/consents/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch consents");
  return await response.json();
}
export async function revokeConsent(token: string, grantId: number) {
  const response = await fetch(`${API_BASE_URL}/auth/consent/${grantId}/revoke`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to revoke");
  return await response.json();
}
