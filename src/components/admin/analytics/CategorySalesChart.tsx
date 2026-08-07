import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { AnalyticsData } from './types';

interface CategorySalesChartProps {
  data: AnalyticsData['categorySales'];
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

export const CategorySalesChart = ({ data }: CategorySalesChartProps) => {
  return (
    <div className="xl:col-span-1 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl dark:shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 flex flex-col">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Total Sales (Categories)</h3>
      <div className="flex-1 min-h-[160px] relative">
          {data.length > 0 ? (
              <>
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                      <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                      >
                          {data.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                      </Pie>
                      <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }}
                          itemStyle={{ fontWeight: 'bold' }}
                          formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Sales']}
                      />
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-2">
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.length}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Categories</span>
                  </div>
              </>
          ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No sales data</div>
          )}
      </div>
      <div className="mt-4 flex flex-col gap-2">
          {data.slice(0, 4).map((entry, index) => (
              <div key={index} className="flex justify-between items-center text-xs font-semibold">
                  <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-slate-500 dark:text-slate-400">{entry.name}</span>
                  </div>
                  <span className="text-slate-800 dark:text-slate-200">₹{entry.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
          ))}
      </div>
    </div>
  );
};
