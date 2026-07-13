import { MoreHorizontal } from 'lucide-react';
import type { AnalyticsData } from './types';

interface RecentTransactionsTableProps {
  data: AnalyticsData['recentOrders'];
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
    case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
    case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    case 'Delivered': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400';
  }
};

export const RecentTransactionsTable = ({ data }: RecentTransactionsTableProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Recent Transactions</h3>
         <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><MoreHorizontal size={18}/></button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {data.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="py-4 text-xs font-medium text-slate-500">{order.date}</td>
                <td className="py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{order.customerEmail}</td>
                <td className="py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </td>
                <td className="py-4 text-sm font-bold text-slate-800 dark:text-slate-200 text-right">₹{order.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
            {data.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-slate-400 text-sm">No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
