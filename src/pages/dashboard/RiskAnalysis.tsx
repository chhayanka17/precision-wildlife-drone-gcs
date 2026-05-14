import { motion } from 'motion/react';
import { AlertCircle, Wind, Brain, EyeOff, Zap, ShieldAlert, BarChart3, CloudLightning } from 'lucide-react';

export default function RiskAnalysis() {
  const risks = [
    {
      title: 'Environmental Interference',
      impact: 'Medium',
      icon: <CloudLightning />,
      color: 'blue',
      desc: 'Heavy canopy cover and tropical humidity in Central India can attenuate thermal signatures by up to 15%.',
      mitigation: 'Multi-spectral fusion (Thermal + RGB + LiDAR)'
    },
    {
      title: 'Behavioral Unpredictability',
      impact: 'High',
      icon: <Brain />,
      color: 'purple',
      desc: 'Herd scattering during approach can lead to accidental double-dosing or target loss.',
      mitigation: 'Adaptive swarm formation and pheromone anchoring'
    },
    {
      title: 'AI Misclassification',
      impact: 'Low',
      icon: <EyeOff />,
      color: 'red',
      desc: 'Juvenile boars may be misidentified as smaller species in dense undergrowth.',
      mitigation: 'Anatomical ratio validation v2.0'
    },
    {
      title: 'Dose Persistence',
      impact: 'Critical',
      icon: <Zap />,
      color: 'emerald',
      desc: 'Vaccine efficacy drops if the target is not treated twice within a 6-month window.',
      mitigation: 'GPS Tag-less tracking (Individual Biometric DB)'
    }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Operation Risk Assessment</h1>
        <p className="text-zinc-500">Managing technical and biological uncertainties in the field.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {risks.map((risk, idx) => (
          <motion.div
            key={risk.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-[2rem] glass border-white/5 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl bg-${risk.color}-500/10 text-${risk.color}-400`}>
                {risk.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Risk Level</span>
                <span className={`text-sm font-bold ${
                  risk.impact === 'Critical' ? 'text-red-500' : 
                  risk.impact === 'High' ? 'text-red-400' : 
                  risk.impact === 'Medium' ? 'text-blue-400' : 'text-emerald-400'
                }`}>
                  {risk.impact}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-display font-bold mb-4">{risk.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
              {risk.desc}
            </p>

            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="text-[10px] uppercase font-bold text-zinc-500 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-3 h-3" /> System Mitigation
              </div>
              <div className="bg-white/5 p-4 rounded-xl text-xs font-medium text-emerald-400 border border-emerald-500/10">
                {risk.mitigation}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Exposure Requirement Rule */}
      <div className="p-10 rounded-[3rem] glass bg-gradient-to-br from-red-500/5 to-transparent border-red-500/10">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h4 className="text-2xl font-display font-bold mb-6 flex items-center gap-4">
              <BarChart3 className="text-red-400" /> Multi-Exposure Protocol
            </h4>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>For sustainable population stabilization, the system enforces the <strong>Dual-Dose Lock</strong>. No target profile is cleared for final efficacy logging until a second delivery event is recorded within the <strong>180-day window</strong>.</p>
              <div className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex flex-col items-center">
                  <div className="text-xs font-bold text-emerald-400">Dose 1</div>
                  <div className="text-[10px] text-zinc-500 tracking-tighter">Initial Primer</div>
                </div>
                <div className="flex-1 h-[2px] bg-white/10 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 bg-zinc-900 border border-white/5 rounded text-[8px] font-bold uppercase tracking-widest text-zinc-600">
                    90-180 Days
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs font-bold text-zinc-500">Dose 2</div>
                  <div className="text-[10px] text-zinc-500 tracking-tighter">Efficacy Lock</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 flex flex-col justify-center">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
              <div className="text-4xl font-display font-bold mb-2">12,400</div>
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Active Biometric Profiles Registered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
