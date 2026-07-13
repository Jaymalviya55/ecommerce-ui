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
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[13px] font-semibold text-slate-400 capitalize tracking-wide">Total Sales</p>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><MoreHorizontal size={18}/></button>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">₹{data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        {renderTrend(data.revenueGrowth)}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[13px] font-semibold text-slate-400 capitalize tracking-wide">Total Orders</p>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><MoreHorizontal size={18}/></button>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{data.totalOrders.toLocaleString()}</h3>
        {renderTrend(data.ordersGrowth)}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[13px] font-semibold text-slate-400 capitalize tracking-wide">Avg Order Value</p>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><MoreHorizontal size={18}/></button>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">₹{data.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        {renderTrend(data.aovGrowth)}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[13px] font-semibold text-slate-400 capitalize tracking-wide">Total Customers</p>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><MoreHorizontal size={18}/></button>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{data.totalCustomers.toLocaleString()}</h3>
        {renderTrend(data.customersGrowth)}
      </div>
    </div>
  );
};
