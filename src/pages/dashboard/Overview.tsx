import { motion } from 'motion/react';
import { AlertTriangle, Activity, Target, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', treatment: 45 },
  { name: 'Tue', treatment: 52 },
  { name: 'Wed', treatment: 89 },
  { name: 'Thu', treatment: 65 },
  { name: 'Fri', treatment: 78 },
  { name: 'Sat', treatment: 120 },
  { name: 'Sun', treatment: 95 },
];

export default function Overview() {
  const kpis = [
    { title: 'Overpopulation Risk', value: '84%', icon: <AlertTriangle className="text-red-400" />, trend: '+12% from last month' },
    { title: 'Active Drones', value: '4', icon: <Activity className="text-emerald-400" />, trend: 'All systems green' },
    { title: 'Treated Coverage', value: '62.4%', icon: <ShieldCheck className="text-blue-400" />, trend: 'Target: 75%' },
    { title: 'Deployments', value: '1,240', icon: <Target className="text-purple-400" />, trend: '+240 this week' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Systems Overview</h1>
        <p className="text-zinc-500">Real-time monitoring of wildlife management operations in Central India.</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl glass hover:border-white/20 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-white/5">{kpi.icon}</div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Live</span>
            </div>
            <div className="text-2xl font-display font-bold mb-1">{kpi.value}</div>
            <div className="text-sm text-zinc-400 mb-1">{kpi.title}</div>
            <div className="text-[10px] text-zinc-500">{kpi.trend}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Treatment Activity Chart */}
        <div className="lg:col-span-2 p-8 rounded-3xl glass">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display font-bold text-lg">Daily Treatment Volume</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTreatment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="treatment" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTreatment)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="p-8 rounded-3xl glass flex flex-col">
          <h3 className="font-display font-bold text-lg mb-6">AI Pipeline Integrity</h3>
          <div className="flex-1 space-y-6">
            {[
              { label: 'Thermal Accuracy', val: 98.4 },
              { label: 'Species ID Confidence', val: 94.2 },
              { label: 'Target Tracking', val: 89.1 },
            ].map(sys => (
              <div key={sys.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">{sys.label}</span>
                  <span className="font-bold">{sys.val}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${sys.val}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-400 w-5 h-5" />
              <div className="text-xs">
                <div className="font-bold text-emerald-400">All Nodes Secure</div>
                <div className="text-zinc-500">Last verification 2m ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
