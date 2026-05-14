import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Battery, Zap, Crosshair, Search, Shield, ChevronRight, Loader2, Activity, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function DroneFeed() {
  const [selectedDrone, setSelectedDrone] = useState('DR-001');
  const [aiStep, setAiStep] = useState(0);
  const [targetAuthorized, setTargetAuthorized] = useState<boolean | null>(null);

  const steps = [
    { id: 'detect', label: 'Thermal Feed', desc: 'Detecting heat signatures...' },
    { id: 'species', label: 'Species Verif', desc: 'Analyzing morphological features...' },
    { id: 'sex', label: 'Sex Identification', desc: 'Identifying breeding population...' },
    { id: 'authorize', label: 'Auth Check', desc: 'Verifying with mission protocol...' },
    { id: 'lock', label: 'Target Lock', desc: 'Securing coordinates...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAiStep(prev => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const drones = [
    { id: 'DR-001', name: 'Alpha Scout', battery: 85, signal: 94, payload: 'Micro-Spray' },
    { id: 'DR-002', name: 'Bravo Thermal', battery: 42, signal: 62, payload: 'Pheromone Pod' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Live Drone Operations</h1>
          <p className="text-zinc-500">Autonomous patrol and target identification units.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {drones.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDrone(d.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                selectedDrone === d.id ? "bg-emerald-500 text-black shadow-lg" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {d.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Feed and AI Bounding Boxes */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden glass border-white/5 shadow-2xl group">
            {/* Mock Thermal Feed */}
            <div className="absolute inset-0 bg-[#0f0f12]">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              
              {/* Dynamic Bounding Boxes */}
              <AnimatePresence>
                <motion.div
                  key={aiStep}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="absolute top-1/4 left-1/3 w-48 h-32 border-2 border-emerald-500 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] flex flex-col justify-between"
                >
                  <div className="p-2 flex justify-between items-start">
                    <div className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Target ID: WB-449</div>
                    <div className="bg-black/50 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">99.4% CONF</div>
                  </div>
                  <div className="p-2 flex gap-1 justify-end">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* HUD Elements */}
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <Wifi className="w-3 h-3" /> LAT: 21.2787
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <Wifi className="w-3 h-3" /> LNG: 81.6296
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-zinc-500">Alt</div>
                      <div className="font-mono text-sm">42.5m</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-zinc-500">Speed</div>
                      <div className="font-mono text-sm">8.4 m/s</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="p-4 glass rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <Battery className="w-5 h-5 text-emerald-400" />
                        <span className="text-[10px] font-bold mt-1">85%</span>
                      </div>
                      <div className="w-[1px] h-8 bg-white/10" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-zinc-500">Payload</div>
                        <div className="text-xs font-bold text-emerald-400">Micro-Spray (Full)</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-600 bg-black/50 px-3 py-1 rounded">
                    ENCRYPTION: AES-256 | SIG: STRONG
                  </div>
                </div>
              </div>

              {/* Scanning Line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[2px] bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-20 pointer-events-none"
              />
            </div>
          </div>

          {/* AI Decision Pipeline */}
          <div className="p-8 rounded-3xl glass">
            <h3 className="font-display font-bold text-lg mb-8 flex items-center gap-3">
              <Zap className="text-emerald-400 w-5 h-5" /> AI Decision Pipeline
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-4">
                  <motion.div 
                    animate={aiStep === idx ? { scale: 1.05, borderColor: '#10b981' } : {}}
                    className={cn(
                      "p-4 rounded-2xl border transition-all w-48",
                      aiStep === idx 
                        ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                        : idx < aiStep 
                          ? "bg-emerald-500/5 border-emerald-500/20 opacity-60" 
                          : "bg-white/5 border-white/5 opacity-40"
                    )}
                  >
                    <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">{step.label}</div>
                    <div className="text-xs text-zinc-300 font-medium">{step.desc}</div>
                    {aiStep === idx && (
                      <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 3, ease: 'linear' }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    )}
                  </motion.div>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-zinc-700" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Target Diagnostics</h4>
            <div className="space-y-4">
              {[
                { label: 'Species', val: 'Wild Boar', icon: <Search className="w-4 h-4" /> },
                { label: 'Sex', val: 'Female', icon: <Shield className="w-4 h-4" /> },
                { label: 'Estimated Age', val: '18 mo', icon: <Activity className="w-4 h-4" /> },
                { label: 'Vulnerability', val: 'High', icon: <AlertTriangle className="w-4 h-4" /> },
              ].map(item => (
                <div key={item.label} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-white/5 text-zinc-400">{item.icon}</div>
                    <span className="text-sm text-zinc-400">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl glass border-emerald-500/20 bg-emerald-500/[0.02]">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Mission Control</h4>
            <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl flex items-center justify-center gap-3 transition-all mb-4">
              <Crosshair className="w-5 h-5" /> AUTHORIZE DELIVERY
            </button>
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all">
              ABORT MISSION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
