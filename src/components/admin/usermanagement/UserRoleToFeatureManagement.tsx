import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { Plus, Trash2, X, ArrowLeft, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface RoleOption {
  userRoleId: number;
  name: string;
}

interface PolicyRule {
  userRoleName: string;
  tenantId: string;
  featureKey: string;
  action: string;
}

const AVAILABLE_FEATURES = [
  { key: '@admin/dashboard', name: 'Dashboard Analytics' },
  { key: '@admin/analytics', name: 'Analytics Reports' },
  { key: '@admin/coupons', name: 'Coupons & Promotions' },
  { key: '@admin/orders', name: 'Orders Management' },
  { key: '@admin/products', name: 'Products Management' },
  { key: '@admin/categories', name: 'Categories Management' },
  { key: '@admin/user-management', name: 'User Management Suite' }
];

export const UserRoleToFeatureManagement = ({ onBack }: { onBack?: () => void }) => {
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userRoleName: '',
    featureKey: '@admin/analytics',
    action: 'read'
  });

  const fetchData = async () => {
    try {
      const [polRes, roleRes] = await Promise.all([
        axiosClient.get('/UserRoleToFeature'),
        axiosClient.get('/UserRole')
      ]);
      setPolicies(polRes.data);
      setRoles(roleRes.data);
      if (roleRes.data.length > 0) {
        setFormData(f => ({ ...f, userRoleName: roleRes.data[0].name }));
      }
    } catch {
      toast.error('Failed to load Casbin Role to Feature policies');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post('/UserRoleToFeature', formData);
      toast.success(`Granted '${formData.action}' on ${formData.featureKey} to ${formData.userRoleName}`);
      setIsModalOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to save feature policy');
    }
  };

  const handleRemove = async (p: PolicyRule) => {
    if (!confirm(`Remove '${p.action}' access on ${p.featureKey} for ${p.userRoleName}?`)) return;
    try {
      await axiosClient.delete('/UserRoleToFeature', { data: { userRoleName: p.userRoleName, featureKey: p.featureKey, action: p.action } });
      toast.success('Policy removed');
      fetchData();
    } catch {
      toast.error('Failed to remove policy');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">User Role To Feature</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Map User Roles to Application Features and Rights (Casbin Policy Rules).</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus size={18} />
          <span>+ Add Rights</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white dark:bg-slate-800 border-b border-slate-800">
                <th className="p-3.5 font-bold">#</th>
                <th className="p-3.5 font-bold">User Role</th>
                <th className="p-3.5 font-bold">Feature Key</th>
                <th className="p-3.5 font-bold">Rights (Action)</th>
                <th className="p-3.5 font-bold">Tenant ID</th>
                <th className="p-3.5 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {policies.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-medium text-slate-500">{idx + 1}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{p.userRoleName}</td>
                  <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{p.featureKey}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.action === '*' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      p.action === 'write' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {p.action === '*' ? 'Full Control (*)' : p.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">{p.tenantId}</td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleRemove(p)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal matching Image 5 UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-xl shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center space-x-2">
                <Shield size={22} className="text-indigo-600" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">User Role To Feature</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">User Role *</label>
                <select
                  value={formData.userRoleName}
                  onChange={(e) => setFormData({ ...formData, userRoleName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {roles.map(r => (
                    <option key={r.userRoleId} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Feature *</label>
                  <select
                    value={formData.featureKey}
                    onChange={(e) => setFormData({ ...formData, featureKey: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    {AVAILABLE_FEATURES.map(f => (
                      <option key={f.key} value={f.key}>{f.name} ({f.key})</option>
                    ))}
                    <option value="*">All Features (*)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Rights (Action) *</label>
                  <select
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="delete">Delete</option>
                    <option value="*">All Rights (*)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border rounded-xl hover:bg-slate-50">Clear</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-md">Save Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
