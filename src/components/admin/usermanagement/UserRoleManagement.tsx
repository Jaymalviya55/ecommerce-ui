import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { Plus, X, Search, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserLevel {
  userLevelId: number;
  name: string;
}

interface UserRole {
  userRoleId: number;
  userLevelId: number;
  userLevelName: string;
  name: string;
  sequence: number;
  applicableToAllSelectedLevelUser: boolean;
  isActive: boolean;
}

export const UserRoleManagement = ({ onBack }: { onBack?: () => void }) => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [levels, setLevels] = useState<UserLevel[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userLevelId: 0,
    name: '',
    sequence: 5,
    applicableToAllSelectedLevelUser: true,
    isActive: true
  });

  const fetchData = async () => {
    try {
      const [roleRes, levelRes] = await Promise.all([
        axiosClient.get('/UserRole'),
        axiosClient.get('/UserLevel')
      ]);
      setRoles(roleRes.data);
      setLevels(levelRes.data);
      if (levelRes.data.length > 0) {
        setFormData(f => ({ ...f, userLevelId: levelRes.data[0].userLevelId }));
      }
    } catch {
      toast.error('Failed to load User Roles');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post('/UserRole', formData);
      toast.success('User Role created successfully');
      setIsModalOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to save User Role');
    }
  };

  const filtered = roles.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.userLevelName.toLowerCase().includes(search.toLowerCase())
  );

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
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">User Role Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage operational roles assigned to user levels.</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus size={18} />
          <span>+ Add</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-72">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="text-sm text-slate-500">{filtered.length} Records</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white dark:bg-slate-800 border-b border-slate-800">
                <th className="p-3.5 font-bold">#</th>
                <th className="p-3.5 font-bold">User Level</th>
                <th className="p-3.5 font-bold">Role Name</th>
                <th className="p-3.5 font-bold">Sequence</th>
                <th className="p-3.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((r, idx) => (
                <tr key={r.userRoleId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-medium text-slate-500">{idx + 1}</td>
                  <td className="p-3.5 font-semibold text-indigo-600 dark:text-indigo-400">{r.userLevelName || 'N/A'}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{r.name}</td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">{r.sequence}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.isActive ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal matching Image 3 UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-xl shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Add User Role</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">User Level *</label>
                  <select
                    value={formData.userLevelId}
                    onChange={(e) => setFormData({ ...formData, userLevelId: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    {levels.map(l => (
                      <option key={l.userLevelId} value={l.userLevelId}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Sequence</label>
                  <input
                    type="number"
                    value={formData.sequence}
                    onChange={(e) => setFormData({ ...formData, sequence: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="allLevel"
                    checked={formData.applicableToAllSelectedLevelUser}
                    onChange={(e) => setFormData({ ...formData, applicableToAllSelectedLevelUser: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="allLevel" className="text-xs font-bold text-slate-700 dark:text-slate-300">Applicable to all selected level users</label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border rounded-xl hover:bg-slate-50">Clear</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
