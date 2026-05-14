import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, BarChart3, Wallet, Users, Target, ShieldCheck, Loader2 } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';

export default function CostImpact() {
  const [simData, setSimData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/population/simulation')
      .then(res => res.json())
      .then(d => {
        setSimData(d);
        setLoading(false);
      });
  }, []);

  const costData = [
    { type: 'Traditional Darting', logistic: 500, labor: 1200, equipment: 300, total: 2000 },
    { type: 'AI Drone System', logistic: 150, labor: 200, equipment: 800, total: 1150 },
  ];

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Cost & Impact Analysis</h1>
        <p className="text-zinc-500">Economic efficiency and biological stabilization forecasting.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Comparison */}
        <div className="p-8 rounded-[2.5rem] glass">
          <h3 className="font-display font-bold text-xl mb-8 flex items-center gap-3">
            <Wallet className="text-emerald-400 w-6 h-6" /> Logistics Cost Comparison
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="type" stroke="#ffffff80" fontSize={12} width={120} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="labor" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Human Resources" />
                <Bar dataKey="logistic" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="Field Logistics" />
                <Bar dataKey="equipment" stackId="a" fill="#ffffff10" radius={[0, 4, 4, 0]} name="Tech Initial CapEx" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-zinc-500 mt-6 italic">
            *Values represent Cost Per 100 Successful Treatments (USD).
          </p>
        </div>

        {/* Efficiency KPIs */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Efficacy Gain', val: '+42%', desc: 'vs Manual Field Operations', icon: <TrendingUp className="text-emerald-400" /> },
            { label: 'Stress Index', val: '-92%', desc: 'Cortisol levels in treated herds', icon: <ShieldCheck className="text-blue-400" /> },
            { label: 'ROI (3-Year)', val: '310%', desc: 'Projected ecosystem savings', icon: <BarChart3 className="text-purple-400" /> },
            { label: 'Labor Reduced', val: '5.2x', desc: 'Ranger hours saved per patrol', icon: <Users className="text-zinc-400" /> },
          ].map(kpi => (
            <div key={kpi.label} className="p-6 rounded-3xl glass-darker border-white/5">
              <div className="p-2 w-fit rounded-lg bg-white/5 mb-4">{kpi.icon}</div>
              <div className="text-3xl font-display font-bold mb-1">{kpi.val}</div>
              <div className="text-sm font-medium text-zinc-300 mb-1">{kpi.label}</div>
              <div className="text-[10px] text-zinc-500">{kpi.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Population Stabilization Simulation */}
      <div className="p-10 rounded-[3rem] glass">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="font-display font-bold text-2xl mb-2 flex items-center gap-3">
              <Target className="text-emerald-400 w-8 h-8" /> Population Stabilization Forecast
            </h3>
            <p className="text-zinc-500 text-sm">Comparison of Sus scrofa population trajectories over 10 years.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/50" />
              <span className="text-xs text-zinc-400">Natural Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-400">AI Managed Protocol</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simData}>
              <defs>
                <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="year" stroke="#ffffff40" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="#ffffff40" fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="noIntervention" 
                stroke="#ef4444" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                fill="url(#colorNo)" 
                name="Natural Growth (No Intervention)"
              />
              <Area 
                type="monotone" 
                dataKey="systemIntervention" 
                stroke="#10b981" 
                strokeWidth={4} 
                fill="url(#colorSys)" 
                name="Precision AI Protocol"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
