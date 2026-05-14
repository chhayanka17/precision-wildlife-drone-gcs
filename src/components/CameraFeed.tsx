import React from 'react';
import { motion } from 'motion/react';
import { Scan, Crosshair } from 'lucide-react';
import { cn } from '../lib/utils';
import { useGCS } from '../contexts/GCSContext';

export default function CameraFeed() {
  const { detections } = useGCS();

  const isAuthorized = detections.length > 0 && 
                     detections[0].species === 'Wild Boar' && 
                     detections[0].confidence > 0.7;

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Thermal Feed */}
      <div className="relative rounded-xl overflow-hidden gcs-panel bg-zinc-950">
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="px-2 py-1 bg-black/40 backdrop-blur rounded text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/30 uppercase tracking-widest">
                THERMAL_OPTIC
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-red-600/20 rounded border border-red-600/30">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-red-500">REC</span>
            </div>
        </div>

        <div className="absolute top-4 right-4 z-20 text-[10px] font-mono font-bold text-white/70">
            00:12:45
        </div>
        
        {/* Wild Boar Video - Using local file path with a reliable fallback */}
        <video 
            autoPlay 
            muted 
            loop 
            playsInline
            onLoadStart={() => console.log('Video loading...')}
            onError={(e) => {
                console.error('Video load failed, trying fallback...');
                const video = e.currentTarget;
                if (video.currentSrc.includes('wild_boar.mp4')) {
                    video.src = "https://assets.mixkit.co/videos/preview/mixkit-wild-boar-in-the-forest-34027-large.mp4";
                    video.load();
                }
            }}
            className="absolute inset-0 w-full h-full object-cover transition-all"
            style={{ 
                filter: 'grayscale(1) invert(1) brightness(1.2) contrast(1.5) hue-rotate(180deg) saturate(1.2)' 
            }}
        >
            <source src="/wild_boar.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-wild-boar-in-the-forest-34027-large.mp4" type="video/mp4" />
        </video>

        {/* Thermal Grid/Scan Line */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]" />
        
        {/* Scanning Line Animation */}
        <motion.div 
            className="absolute left-0 right-0 h-[1px] bg-cyan-400/30 z-10 shadow-[0_0_10px_#22d3ee]"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Thermal Color Overlay */}
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none" />
        
        {/* HUD Corners */}
        <div className="absolute inset-0 pointer-events-none border-[12px] border-transparent">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20" />
        </div>

        <CanvasOverlay detections={detections} type="thermal" className="z-30" />

        <div className="absolute bottom-4 right-4 z-20 text-[9px] font-mono text-zinc-400 bg-black/40 px-2 py-1 rounded">
            SENS: 4500K | GAIN: 12dB | AGY: AUTO
        </div>
      </div>

      {/* RGB Feed */}
      <div className="relative rounded-xl overflow-hidden gcs-panel bg-zinc-950">
        <div className="absolute top-2 left-2 z-20 px-2 py-1 bg-white/10 backdrop-blur rounded text-[8px] font-mono font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
            RGB-Optic Feed
        </div>
        
        <video 
            autoPlay 
            muted 
            loop 
            playsInline
            onLoadStart={() => console.log('RGB Feed loading...')}
            onError={(e) => {
                const video = e.currentTarget;
                if (video.currentSrc.includes('wild_boar.mp4')) {
                    video.src = "https://assets.mixkit.co/videos/preview/mixkit-wild-boar-in-the-forest-34027-large.mp4";
                    video.load();
                }
            }}
            className="absolute inset-0 w-full h-full object-cover"
        >
            <source src="/wild_boar.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-wild-boar-in-the-forest-34027-large.mp4" type="video/mp4" />
        </video>

        <CanvasOverlay detections={detections} type="rgb" className="z-30" />

        {/* HUD Stats */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
            <div className="flex justify-between items-start">
                <div />
                <div className="text-right space-y-1">
                    <div className="text-[9px] font-bold text-emerald-500/70">WILD BOAR DETECTION</div>
                    <div className="text-xl font-display font-bold text-white">94% CONF</div>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div className={cn(
                    "px-4 py-2 rounded-lg border flex items-center gap-3 transition-all",
                    isAuthorized 
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-pulse" 
                        : "bg-zinc-800/50 border-zinc-700 text-zinc-500"
                )}>
                    {isAuthorized ? <Crosshair className="w-4 h-4" /> : <Scan className="w-4 h-4" />}
                    <div className="text-xs font-bold leading-none">
                        {isAuthorized ? "AUTHORIZED INTERVENTION" : "CONTINUE MONITORING"}
                    </div>
                </div>

                {/* Simulation Control */}
                {detections.length === 0 && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.2em] animate-pulse">
                            Searching for Bio-Signatures...
                        </div>
                        <button 
                            onClick={() => fetch('/api/detections/simulate', { method: 'POST' })}
                            className="pointer-events-auto px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black rounded-full transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] uppercase tracking-widest"
                        >
                            Initiate AI Scan
                        </button>
                    </div>
                )}
                
                {isAuthorized && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-[10px] font-black text-red-500 bg-red-500/10 border border-red-500/30 px-4 py-1 rounded-full uppercase tracking-widest animate-bounce">
                            Target Locked: Sus Scrofa
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

function CanvasOverlay({ detections, type, className }: { detections: any[], type: 'thermal' | 'rgb', className?: string }) {
    return (
        <div className={cn("absolute inset-0 pointer-events-none", className)}>
            {detections.map(det => (
                <motion.div
                    key={det.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        "absolute border-4 rounded-lg",
                        type === 'thermal' ? "border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.6)]" : "border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                    )}
                    style={{ left: det.x, top: det.y, width: det.w, height: det.h }}
                >
                    <div className={cn(
                        "absolute -top-10 left-0 px-3 py-1 rounded text-xs font-black flex items-center gap-2 whitespace-nowrap shadow-xl",
                        type === 'thermal' ? "bg-cyan-400 text-black" : "bg-emerald-500 text-black"
                    )}>
                        <Scan className="w-3 h-3" />
                        {det.species.toUpperCase()} | {Math.round(det.confidence * 100)}% MATCH
                    </div>
                    
                    {/* Corners for the bounding box */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-white" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-white" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-white" />
                </motion.div>
            ))}
            
            {/* Scaning Line */}
            <motion.div 
               animate={{ top: ['0%', '100%', '0%'] }}
               transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
               className={cn(
                   "absolute left-0 right-0 h-[1px] opacity-30",
                   type === 'thermal' ? "bg-cyan-400" : "bg-emerald-400"
               )}
            />
        </div>
    )
}
