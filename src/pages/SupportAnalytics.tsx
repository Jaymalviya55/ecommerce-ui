import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Ticket, CheckCircle2, Clock, AlertCircle, TrendingUp, Users
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

interface AnalyticsData {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionTimeHours: number;
  ticketsByStatus: { name: string; value: number }[];
  agentPerformance: { agent: string; resolved: number; open: number }[];
  ticketsByDay: { date: string; tickets: number }[];
}

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444'];

export const SupportAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axiosClient.get('/tickets/analytics');
      setData(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-900/50 min-h-screen overflow-y-auto w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="text-indigo-500" size={32} />
              Support Analytics
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Performance metrics and ticket volume insights.
            </p>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard 
            title="Total Tickets" 
            value={data.totalTickets} 
            icon={<Ticket size={24} className="text-indigo-500" />} 
            trend="+12% this week"
            trendPositive={true}
          />
          <KpiCard 
            title="Open & In Progress" 
            value={data.openTickets} 
            icon={<AlertCircle size={24} className="text-amber-500" />} 
            trend="-5% this week"
            trendPositive={true}
          />
          <KpiCard 
            title="Resolved Tickets" 
            value={data.resolvedTickets} 
            icon={<CheckCircle2 size={24} className="text-emerald-500" />} 
            trend="+18% this week"
            trendPositive={true}
          />
          <KpiCard 
            title="Avg Resolution Time" 
            value={`${data.avgResolutionTimeHours} hrs`} 
            icon={<Clock size={24} className="text-rose-500" />} 
            trend="-2.5 hrs vs last month"
            trendPositive={true}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Ticket Volume Trend */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-6 text-slate-800 dark:text-slate-200">Ticket Volume (Last 7 Days)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.ticketsByDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="tickets" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tickets by Status */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-6 text-slate-800 dark:text-slate-200">Tickets by Status</h3>
            <div className="h-72 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.ticketsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.ticketsByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute text-center">
                <span className="block text-3xl font-bold text-slate-900 dark:text-white">{data.totalTickets}</span>
                <span className="text-sm text-slate-500">Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Performance Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users size={20} className="text-indigo-500" />
              Agent Performance (Leaderboard)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">Agent</th>
                  <th className="px-6 py-4 font-medium text-center">Resolved Tickets</th>
                  <th className="px-6 py-4 font-medium text-center">Open Tickets</th>
                  <th className="px-6 py-4 font-medium text-center">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                {data.agentPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No agent data available yet.
                    </td>
                  </tr>
                ) : (
                  data.agentPerformance.map((agent, i) => {
                    const total = agent.resolved + agent.open;
                    const rate = total > 0 ? Math.round((agent.resolved / total) * 100) : 0;
                    return (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold">
                              {agent.agent.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-900 dark:text-slate-200">{agent.agent}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full font-medium">
                            {agent.resolved}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full font-medium">
                            {agent.open}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rate}%` }}></div>
                            </div>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, trend, trendPositive }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/50">
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${trendPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h4>
        <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}
