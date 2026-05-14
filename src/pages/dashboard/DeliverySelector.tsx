import { motion } from 'motion/react';
import { Crosshair, Wind, Zap, MousePointer2, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function DeliverySelector() {
  const methods = [
    {
      id: 'spray',
      name: 'Micro-Spray Delivery',
      subtitle: 'Dermal Absorption System',
      icon: <Wind className="w-8 h-8" />,
      pros: ['Fast deployment', 'Zero physical contact', 'Wide coverage'],
      cons: ['Wind sensitivity', 'Lower dose precision'],
      efficiency: 84,
      cost: 'Low',
      color: 'emerald'
    },
    {
      id: 'pheromone',
      name: 'Pheromone Bait Pods',
      subtitle: 'Precision Attraction System',
      icon: <Zap className="w-8 h-8" />,
      pros: ['Highly selective', 'High dose reliability', 'Minimal waste'],
      cons: ['Slower uptake', 'Lurking required'],
      efficiency: 96,
      cost: 'Medium',
      color: 'blue'
    },
    {
      id: 'contact',
      name: 'Topical Applicator',
      subtitle: 'Contact Brush Matrix',
      icon: <MousePointer2 className="w-8 h-8" />,
      pros: ['Guaranteed dose', 'Low environmental drift'],
      cons: ['Complex flight path', 'Requires 0.5m proximity'],
      efficiency: 99,
      cost: 'High',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Delivery Method Selector</h1>
        <p className="text-zinc-500">Configure drone payload for specific terrain and species behavior.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {methods.map((method, idx) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative flex flex-col p-8 rounded-[2.5rem] glass overflow-hidden hover:border-white/20 transition-all"
          >
            {/* Background Glow */}
            <div className={cn(
              "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-opacity group-hover:opacity-40",
              method.color === 'emerald' ? 'bg-emerald-500' : 
              method.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
            )} />

            <div className="relative z-10 flex-1">
              <div className={cn(
                "mb-8 w-16 h-16 rounded-3xl flex items-center justify-center p-4",
                method.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 
                method.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
              )}>
                {method.icon}
              </div>

              <h3 className="text-2xl font-display font-bold mb-1">{method.name}</h3>
              <p className="text-sm text-zinc-500 mb-8">{method.subtitle}</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-3">Advantages</h4>
                  <div className="space-y-2">
                    {method.pros.map(pro => (
                      <div key={pro} className="flex items-center gap-2 text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500/50" /> {pro}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-3">Limitations</h4>
                  <div className="space-y-2">
                    {method.cons.map(con => (
                      <div key={con} className="flex items-center gap-2 text-sm text-zinc-500">
                        <AlertCircle className="w-4 h-4 text-red-500/30" /> {con}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10 pt-8 border-t border-white/5">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Dose Efficiency</div>
                  <div className="text-2xl font-display font-bold font-mono">{method.efficiency}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1 text-right">Cost Logic</div>
                  <div className="text-sm font-bold text-zinc-300">{method.cost} Per Target</div>
                </div>
              </div>
              <button className={cn(
                "w-full mt-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all",
                "bg-zinc-100 text-zinc-900 hover:bg-white"
              )}>
                <Crosshair className="w-5 h-5" /> SELECT PAYLOAD
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Safety Policy */}
      <div className="p-8 rounded-3xl glass border-emerald-500/10 flex items-center gap-6">
        <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500">
          <Shield className="w-10 h-10" />
        </div>
        <div>
          <h4 className="font-display font-bold text-lg mb-1">Human-in-the-Loop Override</h4>
          <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">
            All delivery authorizations require a 2.5-second hold for remote pilot confirmation unless "Autonomous Protocol" is explicitly toggled by an Level-4 Administrator. Final target lock is logged with GPS, Thermal ID, and Pheromone Signature.
          </p>
        </div>
      </div>
    </div>
  );
}
