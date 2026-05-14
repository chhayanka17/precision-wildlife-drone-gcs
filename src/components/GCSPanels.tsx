import React from 'react';
import { useGCS } from '../contexts/GCSContext';
import AttitudeIndicator from './AttitudeIndicator';
import { Battery, Wifi, Navigation2, Activity, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export function TelemetryPanel() {
  const { telemetry, failsafe } = useGCS();

  return (
    <div className="w-64 h-full bg-gcs-panel border-r border-gcs-border flex flex-col p-4 gap-6 overflow-y-auto">
      <section className="flex flex-col items-center gap-4 py-4">
        <AttitudeIndicator pitch={telemetry.pitch} roll={telemetry.roll} />
        <div className="flex w-full justify-between px-2">
            <div className="text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Pitch</div>
                <div className="text-lg font-mono font-bold">{telemetry.pitch}°</div>
            </div>
            <div className="text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Roll</div>
                <div className="text-lg font-mono font-bold">{telemetry.roll}°</div>
            </div>
            <div className="text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Yaw</div>
                <div className="text-lg font-mono font-bold">{Math.round(telemetry.yaw)}°</div>
            </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="bg-zinc-900 shadow-inner rounded-xl p-3 border border-white/5">
             <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-zinc-500">
                    <Battery size={14} className={telemetry.batteryPct < 30 ? "text-red-500" : "text-emerald-500"} />
                    <span className="text-[10px] font-bold uppercase">Battery</span>
                </div>
                <span className="text-xs font-bold font-mono">{telemetry.batteryPct}%</span>
             </div>
             <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full transition-all duration-500", telemetry.batteryPct < 30 ? "bg-red-500" : "bg-emerald-500")}
                    style={{ width: `${telemetry.batteryPct}%` }}
                />
             </div>
             <div className="text-right text-[10px] text-zinc-600 mt-1">{telemetry.voltage}V DC</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <DataBox label="Sats" value={telemetry.sats} icon={<Wifi size={12}/>}/>
            <DataBox label="Speed" value={`${telemetry.groundSpeed} m/s`} icon={<Navigation2 size={12}/>}/>
            <DataBox label="V-Speed" value={`${telemetry.verticalSpeed} m/s`} icon={<Activity size={12}/>}/>
            <DataBox label="WP-Dist" value={`${telemetry.distToWp} m`} icon={<Navigation2 size={12}/>}/>
        </div>
      </section>

      <section className="mt-auto pt-6 border-t border-white/5">
        <div className={cn(
            "p-3 rounded-xl border flex flex-col gap-1 transition-all",
            telemetry.armed ? "bg-red-500/10 border-red-500/30" : "bg-zinc-800 border-zinc-700"
        )}>
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">System Status</span>
                <div className={cn("w-2 h-2 rounded-full", telemetry.armed ? "bg-red-500 animate-pulse" : "bg-zinc-600")} />
            </div>
            <div className="text-lg font-display font-bold">
                {telemetry.armed ? "ARMED" : "DISARMED"}
            </div>
            <div className="text-[10px] font-bold text-zinc-600">MODE: {telemetry.mode}</div>
        </div>
      </section>
    </div>
  );
}

function DataBox({ label, value, icon }: { label: string, value: any, icon: any }) {
    return (
        <div className="bg-zinc-900 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-zinc-600 mb-1">
                {icon}
                <span className="text-[10px] font-bold uppercase">{label}</span>
            </div>
            <div className="text-sm font-bold font-mono">{value}</div>
        </div>
    )
}

export function ControlPanel() {
    const { telemetry, failsafe, logs, triggerFailsafe, resetFailsafe, armDrone, disarmDrone, setMode } = useGCS();

    return (
        <div className="w-80 h-full bg-gcs-panel border-l border-gcs-border flex flex-col p-6 gap-8 text-zinc-300">
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Fail-Safe Status</h3>
                    <div className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold",
                        failsafe.active ? "bg-red-500 text-white animate-pulse" : "bg-emerald-500/20 text-emerald-500"
                    )}>
                        {failsafe.active ? "ACTIVE" : "STANDBY"}
                    </div>
                </div>

                <div className="space-y-4">
                    <FailsafeRow label="Trigger" value={failsafe.reason} />
                    <FailsafeRow label="Surface" value={failsafe.surface} />
                    <FailsafeRow label="Mode" value={failsafe.mode} />
                    <FailsafeRow label="Recovery" value={failsafe.recovery} />
                </div>

                <div className="mt-8 flex gap-2">
                    {failsafe.active ? (
                        <button 
                            onClick={resetFailsafe}
                            className="flex-1 gcs-btn bg-emerald-500 hover:bg-emerald-400 text-black font-black"
                        >
                            Reset Failsafe
                        </button>
                    ) : (
                        <button 
                            onClick={() => triggerFailsafe('MANUAL_OPERATOR_ABORT')}
                            className="flex-1 gcs-btn bg-red-500 hover:bg-red-400 text-white font-black"
                        >
                            Trigger Failsafe
                        </button>
                    )}
                </div>
            </section>

            <section className="border-t border-white/5 pt-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Flight Controls</h3>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        {!telemetry.armed ? (
                            <button 
                                onClick={armDrone}
                                className="flex-1 gcs-btn bg-red-600/20 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white font-black"
                            >
                                Arm Drone
                            </button>
                        ) : (
                            <button 
                                onClick={disarmDrone}
                                className="flex-1 gcs-btn bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 font-black"
                            >
                                Disarm
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        {['STABILIZE', 'AUTO', 'RTL', 'LOITER'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => setMode(mode)}
                                className={cn(
                                    "px-3 py-2 rounded text-[10px] font-black tracking-widest border transition-all",
                                    telemetry.mode === mode 
                                        ? "bg-gcs-accent text-black border-gcs-accent" 
                                        : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-zinc-700"
                                )}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="flex-1 border-t border-white/5 pt-8 overflow-hidden flex flex-col">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Payload Control</h3>
                <div className="grid grid-cols-2 gap-4">
                    <PayloadBtn label="Spray" cmd="DO_SPRAYER" />
                    <PayloadBtn label="Pods" cmd="DO_POD" />
                    <PayloadBtn label="Gripper" cmd="DO_GRIPPER" />
                    <PayloadBtn label="Land" cmd="LAND" />
                </div>
            </section>

            <section className="bg-black/30 rounded-2xl p-4 border border-white/5 mt-auto">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase">Event Logging</h4>
                    <button 
                        onClick={() => fetch('/api/detections/simulate', { method: 'POST' })}
                        className="text-[9px] px-2 py-0.5 bg-gcs-accent/10 border border-gcs-accent/30 text-gcs-accent rounded hover:bg-gcs-accent/20"
                    >
                        SIM_DETECT
                    </button>
                </div>
                <div className="h-32 overflow-y-auto space-y-2 font-mono text-[9px] text-zinc-500 scrollbar-hide">
                    {logs.map((log, i) => (
                        <div key={i} className={cn(
                            log.includes('DETECT') || log.includes('AUTH') ? "text-emerald-400" : 
                            log.includes('FAILSAFE') ? "text-red-400" : ""
                        )}>
                            {log}
                        </div>
                    ))}
                    {logs.length === 0 && <div>[SYSTEM] INITIALIZING_COMMS...</div>}
                </div>
            </section>
        </div>
    )
}

function FailsafeRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">{label}</span>
            <span className="font-mono font-bold">{value}</span>
        </div>
    )
}

function PayloadBtn({ label, cmd }: { label: string, cmd: string }) {
    return (
        <button className="gcs-btn gcs-btn-primary py-4 hover:border-gcs-accent hover:text-gcs-accent transition-all group">
            <span className="block mb-1 opacity-50 group-hover:opacity-100">{cmd}</span>
            <span className="text-lg font-display">{label}</span>
        </button>
    )
}
