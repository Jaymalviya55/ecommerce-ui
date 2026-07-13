import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AnalyticsData } from './types';

interface RevenueChartProps {
  data: AnalyticsData['dailySales'];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Revenue</h3>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span>Current Period</div>
        </div>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
              formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
