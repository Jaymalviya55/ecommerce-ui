export function hasPermission(
  permissions: Record<string, string[]> | undefined | null,
  feature?: string,
  action: string = 'read'
): boolean {
  if (!feature) return true;
  if (!permissions) return false;

  if (permissions['@admin/all']?.includes('write') || permissions['@admin/all']?.includes('read')) {
    return true;
  }

  const featurePermissions = permissions[feature];
  return featurePermissions ? featurePermissions.includes(action) : false;
}
