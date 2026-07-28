import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Plus, Loader, CheckCircle2, XCircle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import axios from 'axios';

interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expirationDate: string;
  minimumSpend: number;
  createdAt: string;
}

export const CouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number | ''>(10);
  const [minimumSpend, setMinimumSpend] = useState<number | ''>(0);
  const [expirationDate, setExpirationDate] = useState<string>('');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axiosClient.get('/coupons');
        setCoupons(response.data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !expirationDate) return;

    try {
      await axiosClient.post('/coupons', {
        code: code.toUpperCase(),
        discountPercentage: Number(discountPercentage) || 0,
        isActive: true,
        expirationDate: new Date(expirationDate).toISOString(),
        minimumSpend: Number(minimumSpend) || 0
      });

      setIsCreating(false);
      setCode('');
      setDiscountPercentage(10);
      setMinimumSpend(0);
      setExpirationDate('');
      
      // Re-fetch manually
      try {
        const res = await axiosClient.get('/coupons');
        setCoupons(res.data);
      } catch (e) {
        console.error(e);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data || error.message);
      } else {
        alert(error instanceof Error ? error.message : String(error));
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Ticket className="text-primary" size={24} />
            <span>Discount Coupons</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create and manage promotional codes</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
        >
          {isCreating ? <XCircle size={18} /> : <Plus size={18} />}
          <span>{isCreating ? 'Cancel' : 'New Coupon'}</span>
        </button>
      </div>

      {isCreating && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50"
          onSubmit={handleCreate}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER20"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Discount %</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Min Spend (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={minimumSpend}
                onChange={(e) => setMinimumSpend(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Expiration Date</label>
              <input
                type="date"
                required
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors">
              Save Coupon
            </button>
          </div>
        </motion.form>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader className="animate-spin text-primary" size={32} />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Ticket size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No coupons created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Code</th>
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Discount</th>
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Min Spend</th>
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Expiration</th>
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {coupons.map((coupon) => {
                  const isExpired = new Date(coupon.expirationDate) < new Date();
                  return (
                    <tr key={coupon.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-bold text-primary">{coupon.code}</td>
                      <td className="p-4 text-slate-900 dark:text-white">{coupon.discountPercentage}%</td>
                      <td className="p-4 text-slate-900 dark:text-white">₹{coupon.minimumSpend}</td>
                      <td className="p-4 text-slate-900 dark:text-white">{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        {coupon.isActive && !isExpired ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 size={12} />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
                            <XCircle size={12} />
                            <span>Expired/Inactive</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};
