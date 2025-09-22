// isAdminUser.ts
// Usage: isAdminUser(token, userContexts)
export function isAdminUser(token: string, userContexts?: { role: string }[]): boolean {
  // 1. Parse JWT for possible admin claim (if present)
  try {
    if (token) {
      const [, payload] = token.split(".");
      const data = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      if (data.isAdmin === true) return true;
      // 2. If roles or contexts present in token payload
      if (Array.isArray(data.contexts) && data.contexts.some((ctx: any) => ctx.role === "admin")) {
        return true;
      }
    }
  } catch { /* fall back below */ }

  // 3. If userContexts prop provided, check if any are admin
  if (userContexts && Array.isArray(userContexts)) {
    return userContexts.some(ctx => ctx.role === "admin");
  }

  // Not admin
  return false;
}
