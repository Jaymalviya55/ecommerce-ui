import { useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { hasPermission } from '../utils/permissionCheck';

export interface MenuItem {
  label: string;
  icon?: string;
  path?: string;
  feature?: string;
  action?: string;
  children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    label: 'Home',
    icon: 'Home',
    path: '/',
  },
  {
    label: 'My Account',
    icon: 'User',
    path: '/profile/account',
    children: [
      {
        label: 'Account Details',
        icon: 'User',
        path: '/profile/account',
      },
      {
        label: 'Manage Addresses',
        icon: 'MapPin',
        path: '/profile/addresses',
      },
      {
        label: 'My Orders',
        icon: 'Package',
        path: '/profile/orders',
      },
      {
        label: 'My Coupons',
        icon: 'Ticket',
        path: '/profile/coupons',
      },
      {
        label: 'My Reviews',
        icon: 'Star',
        path: '/profile/reviews',
      },
      {
        label: 'Help & Support',
        icon: 'MessageSquare',
        path: '/profile/support',
      },
    ],
  },
  {
    label: 'Support Desk',
    icon: 'Headphones',
    path: '/support',
    feature: '@support/desk',
    action: 'read',
    children: [
      {
        label: 'Tickets',
        icon: 'MessageSquare',
        path: '/support',
        feature: '@support/desk',
        action: 'read',
      },
      {
        label: 'Analytics',
        icon: 'BarChart2',
        path: '/support/analytics',
        feature: '@analytics/view',
        action: 'read',
      },
    ],
  },
  {
    label: 'Fulfillment Portal',
    icon: 'Truck',
    path: '/fulfillment',
    feature: '@fulfillment/orders',
    action: 'read',
  },
  {
    label: 'Admin Control Center',
    icon: 'Shield',
    path: '/admin/overview',
    feature: '@admin/dashboard',
    action: 'read',
    children: [
      {
        label: 'Dashboard Overview',
        icon: 'LayoutDashboard',
        path: '/admin/overview',
        feature: '@admin/dashboard',
        action: 'read',
      },
      {
        label: 'User Management',
        icon: 'Users',
        feature: '@admin/user-management',
        action: 'read',
        children: [
          {
            label: 'User Types',
            path: '/admin/user-management/user-type',
            feature: '@admin/user-management',
            action: 'read',
          },
          {
            label: 'User Levels',
            path: '/admin/user-management/user-level',
            feature: '@admin/user-management',
            action: 'read',
          },
          {
            label: 'User Roles',
            path: '/admin/user-management/user-role',
            feature: '@admin/user-management',
            action: 'read',
          },
          {
            label: 'Level to Role Mapping',
            path: '/admin/user-management/level-to-role',
            feature: '@admin/user-management',
            action: 'read',
          },
          {
            label: 'Role to Feature Mapping',
            path: '/admin/user-management/role-to-feature',
            feature: '@admin/user-management',
            action: 'read',
          },
        ],
      },
      {
        label: 'Product Catalog',
        icon: 'Package',
        path: '/admin/products',
        feature: '@admin/products',
        action: 'read',
      },
      {
        label: 'Order Management',
        icon: 'ShoppingCart',
        path: '/admin/orders',
        feature: '@admin/orders',
        action: 'read',
      },
      {
        label: 'Promotional Coupons',
        icon: 'Tag',
        path: '/admin/coupons',
        feature: '@admin/coupons',
        action: 'read',
      },
    ],
  },
];

function filterMenu(items: MenuItem[], permissions: Record<string, string[]>): MenuItem[] {
  return items
    .map((item) => {
      let children: MenuItem[] | undefined = undefined;

      if (item.children?.length) {
        children = filterMenu(item.children, permissions);
      }

      // If item has children and at least one child passed filtering, keep parent!
      if (children && children.length > 0) {
        return { ...item, children };
      }

      // Otherwise check item's direct feature permission
      if (item.feature) {
        const allowed = hasPermission(permissions, item.feature, item.action || 'read');
        if (!allowed) return null;
      } else if (item.children?.length) {
        // If it had children but none passed filtering, hide parent
        return null;
      }

      return item;
    })
    .filter(Boolean) as MenuItem[];
}

export function useAuthorizedMenu() {
  const { isAuthenticated, permissions } = useAuthStore();

  return useMemo(() => {
    if (!isAuthenticated) {
      return menuConfig.filter((item) => !item.feature);
    }

    return filterMenu(menuConfig, permissions);
  }, [isAuthenticated, permissions]);
}
