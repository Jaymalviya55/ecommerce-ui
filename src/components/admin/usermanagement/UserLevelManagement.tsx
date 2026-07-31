import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { Plus, Trash2, Search, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserType {
  userTypeId: number;
  name: string;
}

interface UserLevel {
  userLevelId: number;
  userTypeId: number;
  userTypeName: string;
  name: string;
  code: string;
  isActive: boolean;
}

export const UserLevelManagement = ({ onBack }: { onBack?: () => void }) => {
  const [levels, setLevels] = useState<UserLevel[]>([]);
  const [types, setTypes] = useState<UserType[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ userTypeId: 0, name: '', code: '', isActive: true });

  const fetchData = async () => {
    try {
      const [levelRes, typeRes] = await Promise.all([
        axiosClient.get('/UserLevel'),
        axiosClient.get('/UserType')
      ]);
      setLevels(levelRes.data);
      setTypes(typeRes.data);
      if (typeRes.data.length > 0) {
        setFormData(f => ({ ...f, userTypeId: typeRes.data[0].userTypeId }));
      }
    } catch {
      toast.error('Failed to load User Levels');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post('/UserLevel', formData);
      toast.success('User Level created successfully');
      setIsModalOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to save User Level');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this User Level?')) return;
    try {
      await axiosClient.delete(`/UserLevel/${id}`);
      toast.success('User Level removed');
      fetchData();
    } catch {
      toast.error('Failed to remove User Level');
    }
  };

  const filtered = levels.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.userTypeName.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">User Level Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage and assign hierarchy levels to user types.</p>
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
                <th className="p-3.5 font-bold">User Type ↑↓</th>
                <th className="p-3.5 font-bold">Name ↑↓</th>
                <th className="p-3.5 font-bold">Code ↑↓</th>
                <th className="p-3.5 font-bold">Status ↑↓</th>
                <th className="p-3.5 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((l, idx) => (
                <tr key={l.userLevelId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-medium text-slate-500">{idx + 1}</td>
                  <td className="p-3.5 font-semibold text-indigo-600 dark:text-indigo-400">{l.userTypeName || 'N/A'}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{l.name}</td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">{l.code}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${l.isActive ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                      {l.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleDelete(l.userLevelId)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add User Level</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">User Type *</label>
                <select
                  value={formData.userTypeId}
                  onChange={(e) => setFormData({ ...formData, userTypeId: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {types.map(t => (
                    <option key={t.userTypeId} value={t.userTypeId}>{t.name}</option>
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Head Office Level-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. UL03"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
