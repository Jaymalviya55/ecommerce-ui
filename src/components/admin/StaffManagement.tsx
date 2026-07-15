import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Shield, ShieldAlert, User, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../config';

interface SystemUser {
  id: string;
  email: string;
  roles: string[];
}

const AVAILABLE_ROLES = ["Admin", "Customer", "SupportAgent", "FulfillmentStaff"];

export const StaffManagement = () => {
  const { accessToken } = useAuthStore();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAssignRole = async (email: string, role: string, userId: string) => {
    setAssigningUserId(userId);
    setSuccessMsg('');
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/auth/assign-role`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, role })
      });
      
      if (!res.ok) throw new Error("Failed to assign role");
      
      setSuccessMsg(`Role ${role} successfully assigned to ${email}`);
      await fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAssigningUserId(null);
    }
  };

  if (isLoading) return <div className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Staff Management</h2>
          <p className="text-sm text-slate-500">Assign operational roles to registered users.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-2">
          <ShieldAlert size={20} /> {error}
        </div>
      )}
      
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2">
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              <th className="pb-4 pl-2">User</th>
              <th className="pb-4">Current Roles</th>
              <th className="pb-4 text-right pr-2">Assign New Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{user.email}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    {user.roles.length === 0 ? (
                      <span className="px-2 py-1 text-xs rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800">None (Customer)</span>
                    ) : (
                      user.roles.map(r => (
                        <span key={r} className="px-2 py-1 text-xs rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                          {r}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td className="py-4 pr-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select 
                      id={`role-${user.id}`}
                      className="text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none"
                    >
                      {AVAILABLE_ROLES.map(r => (
                        <option key={r} value={r} disabled={user.roles.includes(r)}>{r}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const selectEl = document.getElementById(`role-${user.id}`) as HTMLSelectElement;
                        handleAssignRole(user.email, selectEl.value, user.id);
                      }}
                      disabled={assigningUserId === user.id}
                      className="px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {assigningUserId === user.id ? 'Saving...' : 'Assign'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
