import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { Plus, Edit2, Search, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../../ui/Modal';

interface UserType {
  userTypeId: number;
  name: string;
  code: string;
  isActive: boolean;
}

export const UserTypeManagement = ({ onBack }: { onBack?: () => void }) => {
  const [types, setTypes] = useState<UserType[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', isActive: true });

  const fetchTypes = async () => {
    try {
      const res = await axiosClient.get('/UserType');
      setTypes(res.data);
    } catch {
      toast.error('Failed to load User Types');
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/UserType/${editingItem.userTypeId}`, formData);
        toast.success('User Type updated successfully');
      } else {
        await axiosClient.post('/UserType', formData);
        toast.success('User Type created successfully');
      }
      setIsModalOpen(false);
      fetchTypes();
    } catch {
      toast.error('Failed to save User Type');
    }
  };

  const filtered = types.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.code.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">User Type Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage and create user types through this page.</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingItem(null); setFormData({ name: '', code: '', isActive: true }); setIsModalOpen(true); }}
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
                <th className="p-3.5 font-bold">Name ↑↓</th>
                <th className="p-3.5 font-bold">Code ↑↓</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((t, idx) => (
                <tr key={t.userTypeId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-medium text-slate-500">{idx + 1}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{t.name}</td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">{t.code}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.isActive ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => { setEditingItem(t); setFormData({ name: t.name, code: t.code, isActive: t.isActive }); setIsModalOpen(true); }}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Edit User Type' : 'Add User Type'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder="e.g. Head Office"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Code *</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder="e.g. UT03"
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Is Active</label>
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all active:scale-95">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
