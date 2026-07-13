import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Loader2 } from 'lucide-react';
import type { AnalyticsData } from './analytics/types';

import { TopMetricsCards } from './analytics/TopMetricsCards';
import { RevenueChart } from './analytics/RevenueChart';
import { LocationSalesMap } from './analytics/LocationSalesMap';
import { CategorySalesChart } from './analytics/CategorySalesChart';
import { TopProductsTable } from './analytics/TopProductsTable';
import { MonthlyTargetCard } from './analytics/MonthlyTargetCard';
import { RecentTransactionsTable } from './analytics/RecentTransactionsTable';
import { InventoryAlertsList } from './analytics/InventoryAlertsList';

export const DashboardAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get(`/analytics/dashboard?days=${timeRange}`);
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load analytics data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl text-center border border-red-200 dark:border-red-900/50">
        {error || 'No data available'}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl -m-6">
      {/* Header & Date Filter */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        <div className="flex gap-4">
            <select 
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer shadow-sm"
            >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={365}>This Year</option>
            </select>
        </div>
      </div>

      <TopMetricsCards data={data} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <RevenueChart data={data.dailySales} />
        <LocationSalesMap data={data.locationSales} />
        <CategorySalesChart data={data.categorySales} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <TopProductsTable data={data.topProducts} />
        <MonthlyTargetCard totalRevenue={data.totalRevenue} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentTransactionsTable data={data.recentOrders} />
        <InventoryAlertsList data={data.lowStockProducts} />
      </div>
    </div>
  );
};
