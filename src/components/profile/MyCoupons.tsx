import { useState, useEffect } from 'react';
import { Ticket, Tag, Clock, Package } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expirationDate: string;
  minimumSpend: number;
  isUsed: boolean;
}

export const MyCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        const response = await axiosClient.get('/coupons/active');
        // Sort so active coupons are first, used/inactive ones are last
        const sorted = (response.data as Coupon[]).sort((a, b) => 
          (a.isUsed === b.isUsed) ? 0 : a.isUsed ? 1 : -1
        );
        setCoupons(sorted);
      } catch (err: any) {
        setError(err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActiveCoupons();
  }, []);

  return (
    <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Ticket size={24} className="text-primary" />
          My Coupons
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Use these codes during checkout to get exclusive discounts!</p>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-400/10 p-4 rounded-xl border border-red-200 dark:border-red-400/20">{error}</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <Tag size={48} className="mx-auto mb-4 opacity-50 text-slate-400 dark:text-slate-500" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No active coupons available right now.</p>
            <p className="text-sm mt-1">Check back later for exciting offers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform hover:-translate-y-1 ${
                  coupon.isUsed 
                    ? 'bg-slate-400 dark:bg-slate-700 opacity-70 grayscale' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}
              >
                {/* Decorative circles */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-3xl font-black drop-shadow-sm">{coupon.discountPercentage}% OFF</h4>
                      <p className="text-white/80 text-sm font-medium mt-1">
                        {coupon.isUsed ? 'Already Used' : 'Special Discount'}
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30 flex flex-col items-center">
                      <code className={`font-mono text-lg font-bold tracking-wider ${coupon.isUsed ? 'line-through opacity-70' : ''}`}>
                        {coupon.code}
                      </code>
                      {coupon.isUsed && (
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-white/90">Used</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <Package size={14} />
                      <span>Min. spend: <span className="font-bold">₹{coupon.minimumSpend}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <Clock size={14} />
                      <span>Valid until: <span className="font-bold">{new Date(coupon.expirationDate).toLocaleDateString()}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
