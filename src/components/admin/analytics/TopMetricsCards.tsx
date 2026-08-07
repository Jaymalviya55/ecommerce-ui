import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import type { AnalyticsData } from './types';

interface TopMetricsCardsProps {
  data: AnalyticsData;
}

const renderTrend = (value: number) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPositive ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-500 bg-rose-50 dark:bg-rose-500/10';
  return (
    <div className="flex items-center gap-2 mt-4">
      <div className={`flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded ${colorClass}`}>
        <Icon size={14} />
        <span>{Math.abs(value)}%</span>
      </div>
      <span className="text-slate-400 font-medium text-xs">in the last period</span>
    </div>
  );
};

export const TopMetricsCards = ({ data }: TopMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl dark:shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 hover:-translate-y-1 hover:shadow-indigo-500/15 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Sales</p>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-lg"><MoreHorizontal size={18}/></button>
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">₹{data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        {renderTrend(data.revenueGrowth)}
      </div>

      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl dark:shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 hover:-translate-y-1 hover:shadow-indigo-500/15 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Orders</p>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-lg"><MoreHorizontal size={18}/></button>
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{data.totalOrders.toLocaleString()}</h3>
        {renderTrend(data.ordersGrowth)}
      </div>

      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl dark:shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 hover:-translate-y-1 hover:shadow-indigo-500/15 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Avg Order Value</p>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-lg"><MoreHorizontal size={18}/></button>
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">₹{data.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        {renderTrend(data.aovGrowth)}
      </div>

      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl dark:shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 hover:-translate-y-1 hover:shadow-indigo-500/15 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Customers</p>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-lg"><MoreHorizontal size={18}/></button>
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{data.totalCustomers.toLocaleString()}</h3>
        {renderTrend(data.customersGrowth)}
      </div>
    </div>
  );
};
