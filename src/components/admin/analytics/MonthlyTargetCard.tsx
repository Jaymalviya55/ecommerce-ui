import { MoreHorizontal } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MonthlyTargetCardProps {
  totalRevenue: number;
}

const MONTHLY_GOAL = 50000;

export const MonthlyTargetCard = ({ totalRevenue }: MonthlyTargetCardProps) => {
  const targetPercentage = Math.min((totalRevenue / MONTHLY_GOAL) * 100, 100);
  const targetData = [
    { name: 'Achieved', value: targetPercentage },
    { name: 'Remaining', value: 100 - targetPercentage }
  ];

  return (
    <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col items-center justify-center text-center">
        <div className="w-full flex justify-between items-center mb-6">
             <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Monthly Target</h3>
             <button className="text-slate-400"><MoreHorizontal size={18}/></button>
        </div>
        <p className="text-xs text-slate-500 mb-6 self-start text-left">Target you've set for each month</p>
        <div className="h-[140px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={targetData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={75}
                outerRadius={95}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                cornerRadius={5}
                >
                <Cell fill="#8b5cf6" />
                <Cell fill="#f1f5f9" className="dark:fill-slate-800" />
                </Pie>
            </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{targetPercentage.toFixed(2)}%</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded mt-1">+12%</span>
            </div>
        </div>
        <p className="text-xs text-slate-500 mt-6 leading-relaxed px-4">
            You earn <span className="font-bold text-slate-700 dark:text-slate-300">₹{(totalRevenue/30).toFixed(0)}</span> today, its higher than last month keep up your good trends!
        </p>
        
        <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
             <div>
                 <p className="text-[10px] font-semibold text-slate-400 uppercase">Target</p>
                 <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">₹{MONTHLY_GOAL/1000}k <span className="text-rose-500 text-[10px]">↓</span></p>
             </div>
             <div>
                 <p className="text-[10px] font-semibold text-slate-400 uppercase">Revenue</p>
                 <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">₹{(totalRevenue/1000).toFixed(1)}k <span className="text-emerald-500 text-[10px]">↑</span></p>
             </div>
             <div>
                 <p className="text-[10px] font-semibold text-slate-400 uppercase">Today</p>
                 <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">₹{((totalRevenue/30)/1000).toFixed(1)}k <span className="text-emerald-500 text-[10px]">↑</span></p>
             </div>
        </div>
    </div>
  );
};
