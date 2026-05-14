import React from 'react';

interface Props {
  pitch: number;
  roll: number;
}

export default function AttitudeIndicator({ pitch, roll }: Props) {
  return (
    <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-zinc-700 bg-zinc-900 shadow-inner">
      {/* Sky/Ground */}
      <div 
        className="absolute inset-0 transition-transform duration-100 ease-linear"
        style={{ transform: `rotate(${-roll}deg) translateY(${pitch * 2}px)` }}
      >
        <div className="h-1/2 w-[200%] -left-1/2 bg-sky-500" />
        <div className="h-1/2 w-[200%] -left-1/2 bg-amber-900" />
        {/* Horizon Line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-white opacity-50" />
      </div>

      {/* Pitch Ladder (Static reference) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center space-y-4 opacity-30">
        {[20, 10, 0, -10, -20].map(val => (
          <div key={val} className="flex items-center gap-2">
            <div className="w-8 h-[1px] bg-white" />
            <span className="text-[8px] font-mono">{val}</span>
            <div className="w-8 h-[1px] bg-white" />
          </div>
        ))}
      </div>

      {/* Crosshair (Fixed) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-12 h-1 bg-yellow-400" />
        <div className="absolute top-1/2 right-0 w-12 h-1 bg-yellow-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-yellow-400 rounded-full" />
      </div>

      {/* Degree Scale */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white bg-black/40 px-2 rounded">
        {roll.toFixed(1)}°
      </div>
    </div>
  );
}
