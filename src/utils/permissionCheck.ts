export function hasPermission(
  permissions: Record<string, string[]> | undefined | null,
  feature?: string,
  action: string = 'read'
): boolean {
  if (!feature) return true;
  if (!permissions) return false;

  // SuperAdmin global permission check
  const adminPerms = permissions['@admin/all'] || permissions['*'];
  if (adminPerms?.includes('write') || adminPerms?.includes('read') || adminPerms?.includes('*')) {
    return true;
  }

  // Strict exact match against the backend Features constant string
  const userPerms = permissions[feature];
  return userPerms ? (userPerms.includes(action) || userPerms.includes('*')) : false;
}
