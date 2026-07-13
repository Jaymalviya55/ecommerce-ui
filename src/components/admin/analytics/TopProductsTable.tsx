import { Filter, MoreHorizontal, PackageX } from 'lucide-react';
import type { AnalyticsData } from './types';

interface TopProductsTableProps {
  data: AnalyticsData['topProducts'];
}

export const TopProductsTable = ({ data }: TopProductsTableProps) => {
  return (
    <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Top Selling Products</h3>
        <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Filter size={14} /> Filter
            </button>
            <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                See All
            </button>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Product Name</th>
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Price</th>
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Category</th>
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">Quantity</th>
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
              <th className="pb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {data.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="py-3 flex items-center gap-3">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <PackageX size={14} />  
                    </div>
                  )}
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{product.name}</span>
                </td>
                <td className="py-3 text-sm font-medium text-slate-500 dark:text-slate-400">₹{product.price.toFixed(2)}</td>
                <td className="py-3 text-sm font-medium text-slate-500 dark:text-slate-400">{product.category}</td>
                <td className="py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">{product.sales}</td>
                <td className="py-3 text-sm font-bold text-slate-800 dark:text-slate-200 text-right">₹{product.totalRevenue.toFixed(2)}</td>
                <td className="py-3 text-right text-slate-400">
                     <button className="hover:text-slate-600 dark:hover:text-slate-200"><MoreHorizontal size={18} className="ml-auto" /></button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400 text-sm">No products sold yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
