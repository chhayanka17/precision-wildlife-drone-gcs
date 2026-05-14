import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Target, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden selection:bg-emerald-500/30">
      {/* Abstract Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Activity className="text-zinc-950 w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">PRECISION WILDLIFE</span>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full glass hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
              AI-Powered Population Control
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent leading-tight">
              Precision Wildlife <br /> Contraceptive Delivery
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed">
              Non-invasive, autonomous population management tailored for sensitive ecosystems. Using thermal AI pipelines to deliver fertility vaccines with unmatched accuracy.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl flex items-center gap-3 mx-auto transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              Launch Dashboard <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Target className="w-6 h-6 text-emerald-400" />,
              title: "Autonomous Target Lock",
              desc: "AI species verification and sex identification ensures zero-error vaccine delivery."
            },
            {
              icon: <Zap className="w-6 h-6 text-blue-400" />,
              title: "Non-Invasive Delivery",
              desc: "Micro-spray and pheromone pods eliminate the need for stressful tagging or darts."
            },
            {
              icon: <Shield className="w-6 h-6 text-purple-400" />,
              title: "Ecosystem Stability",
              desc: "Maintain genetic diversity through controlled population growth simulations."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="p-8 rounded-3xl glass hover:border-white/20 transition-all group"
            >
              <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-medium mb-4">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center px-6">
        <p className="text-zinc-500 text-sm">
          © 2026 Precision Wildlife Management Systems. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
