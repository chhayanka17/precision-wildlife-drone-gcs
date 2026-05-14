import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Dna, MapPin, Activity, Calendar, History, TrendingDown, Users, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

export default function SpeciesIntel() {
  const [selectedId, setSelectedId] = useState('wild_boar');
  const [species, setSpecies] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/species/${selectedId}`)
      .then(res => res.json())
      .then(d => setSpecies(d));
  }, [selectedId]);

  if (!species) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Species Intelligence</h1>
        <p className="text-zinc-500">Biological data and population projections for target species.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation / Selection Column */}
        <div className="lg:col-span-4 space-y-4">
          {['wild_boar', 'chital'].map((id) => (
            <button
              key={id}
              onClick={() => setSelectedId(id)}
              className={`w-full text-left p-6 rounded-3xl transition-all border ${
                selectedId === id 
                  ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg" 
                  : "glass border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <Dna className={selectedId === id ? "text-emerald-400" : "text-zinc-500"} />
                {selectedId === id && <motion.div layoutId="active" className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </div>
              <h3 className="font-display font-bold text-lg">{id === 'wild_boar' ? 'Wild Boar' : 'Chital (Spotted Deer)'}</h3>
              <p className="text-xs text-zinc-500 mt-1">Sus scrofa • Chhattisgarh / Central India</p>
            </button>
          ))}

          <div className="p-6 rounded-3xl glass bg-blue-500/5 border-blue-500/20">
            <h4 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Breeding Cycles
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Peak Window</span>
                <span className="text-zinc-200">Feb — May</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[60%] ml-[20%]" />
              </div>
              <p className="text-[10px] text-zinc-500">Maximum intervention efficiency during this period.</p>
            </div>
          </div>
        </div>

        {/* Intelligence Detail Area */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            key={species.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-3xl glass"
          >
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-4xl font-display font-bold">{species.name}</h2>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center gap-2 text-xs text-zinc-500"><MapPin className="w-3 h-3" /> {species.location}</span>
                  <span className="flex items-center gap-2 text-xs text-zinc-500"><Users className="w-3 h-3" /> Pop: {species.population}</span>
                </div>
              </div>
              <div className="px-4 py-1 rounded-full bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-bold uppercase tracking-widest">
                {species.risk}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Herd Structure */}
              <div>
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-8">Herd Structure Analysis</h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={species.herdStructure}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="type" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {species.herdStructure?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index === 1 ? '#10b981' : '#ffffff20'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-zinc-500 mt-4 italic">
                  Focus: Adult Females (Intervention-ready: 1,800)
                </p>
              </div>

              {/* Breeding Timeline / Projections */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Breeding Cycle Timeline</h4>
                <div className="space-y-4">
                  {[
                    { month: 'Jan-Feb', status: 'Preparation', color: 'bg-zinc-500' },
                    { month: 'Mar-May', status: 'High Activity', color: 'bg-red-500' },
                    { month: 'Jun-Aug', status: 'Gestation', color: 'bg-emerald-500' },
                    { month: 'Sep-Dec', status: 'Birth/Rearing', color: 'bg-blue-500' },
                  ].map(p => (
                    <div key={p.month} className="flex items-center gap-6 p-4 rounded-2xl glass-darker">
                      <div className={`w-3 h-3 rounded-full ${p.color}`} />
                      <div className="flex-1">
                        <div className="text-xs font-bold">{p.month}</div>
                        <div className="text-[10px] text-zinc-500">{p.status}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Population Projection Card */}
          <div className="p-8 rounded-3xl glass border-emerald-500/20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-display font-bold text-xl flex items-center gap-3">
                <TrendingDown className="text-emerald-400 w-6 h-6" /> Population Projection Simulation
              </h3>
              <div className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">MODE: STABILIZATION</div>
            </div>
            <div className="h-[200px] w-full bg-white/5 rounded-3xl flex items-center justify-center border border-dashed border-white/10">
              <span className="text-zinc-600 text-sm italic font-display">Interactive chart rendering simulated stabilization trajectories...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
