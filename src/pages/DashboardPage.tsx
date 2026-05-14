import { useState } from 'react';
import { GCSProvider, useGCS } from '../contexts/GCSContext';
import { TelemetryPanel, ControlPanel } from '../components/GCSPanels';
import MissionTable from '../components/MissionTable';
import CameraFeed from '../components/CameraFeed';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Activity, 
  Settings, 
} from 'lucide-react';
import { cn } from '../lib/utils';

// Fix Marker icon issues in React by overriding with DivIcons
L.Marker.prototype.options.icon = L.divIcon({
    className: 'default-icon',
    html: `<div class="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

type Tab = 'DATA' | 'PLAN' | 'SETUP' | 'CONFIG' | 'SIMULATION' | 'HELP';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('DATA');
  const { detections } = useGCS();

  return (
    <div className="flex flex-col h-screen bg-gcs-bg overflow-hidden">
        {/* Top Navigation */}
        <header className="h-14 bg-zinc-900 border-b border-gcs-border flex items-center justify-between px-6 z-50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gcs-accent rounded flex items-center justify-center">
                <Activity className="text-black w-4 h-4" />
              </div>
              <span className="font-display font-black text-sm tracking-widest text-zinc-100">GCS_PRECISION_V1.2</span>
            </div>
            
            <nav className="flex gap-2">
              {(['DATA', 'PLAN', 'SETUP', 'CONFIG', 'SIMULATION', 'HELP'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-black tracking-tighter transition-all rounded",
                    activeTab === tab 
                      ? "bg-zinc-800 text-gcs-accent border border-gcs-accent/30" 
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
              {detections.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/30 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-[10px] font-mono font-bold text-cyan-400">AI_TRACKING_ACTIVE</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-gcs-accent animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-zinc-500">COMMS: OK</span>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500"><Settings size={16}/></button>
          </div>
        </header>

        {/* Main Interface Grid */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Telemetry */}
          <TelemetryPanel />

          {/* Center Stage */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Upper Stage: Map or Video */}
            <div className="flex-1 relative overflow-hidden">
              {activeTab === 'DATA' ? (
                <CameraFeed />
              ) : activeTab === 'PLAN' ? (
                <MapView />
              ) : (
                <TabContent tab={activeTab} />
              )}
            </div>

            {/* Lower Stage: Mission Commands */}
            <div className="h-64 border-t border-gcs-border">
              <MissionTable />
            </div>
          </div>

          {/* Right Control */}
          <ControlPanel />
        </div>

        {/* Bottom Status Bar */}
        <footer className="h-6 bg-zinc-900 border-t border-gcs-border px-4 flex items-center justify-between text-[9px] font-mono text-zinc-500">
           <div className="flex gap-6">
              <span>LAT: 21.278782</span>
              <span>LNG: 81.629612</span>
              <span>ALT: 45.22m</span>
           </div>
           <div className="flex gap-6">
              <span>HDOP: 0.8</span>
              <span>VDOP: 1.2</span>
              <span>SATS: 12 (3D FIX)</span>
           </div>
           <div className="flex gap-2 items-center">
              <span className="text-zinc-600">SYSTIME: {new Date().toLocaleTimeString()}</span>
              <div className="w-2 h-2 rounded-full bg-gcs-accent" />
           </div>
        </footer>
      </div>
  );
}

function MapView() {
  const { mission, setMission, telemetry } = useGCS();
  
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const newWp = {
          id: Date.now(),
          command: 'WAYPOINT',
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          alt: 45,
          frame: 'Relative',
          delay: 0,
          speed: 10
        };
        setMission(prev => [...prev, newWp]);
      },
    });
    return null;
  };

  const wpIcon = (num: number) => L.divIcon({
    className: 'custom-wp-icon',
    html: `<div class="bg-gcs-accent text-black font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 border-black outline outline-1 outline-gcs-accent shadow-lg">${num}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const droneIcon = L.divIcon({
    className: 'drone-icon',
    html: `<div class="relative w-8 h-8 flex items-center justify-center transition-transform duration-500" style="transform: rotate(${telemetry.yaw}deg)">
             <div class="absolute w-full h-[2px] bg-red-500" />
             <div class="absolute w-[2px] h-full bg-red-500" />
             <div class="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  return (
    <div className="w-full h-full bg-zinc-900 overflow-hidden relative">
      {/* HUD Overlays on Map */}
      <div className="absolute top-4 right-4 z-[1000] p-3 gcs-panel rounded-xl opacity-80 pointer-events-none">
          <div className="text-[10px] font-bold text-zinc-500 mb-1">CURSOR_COORDS</div>
          <div className="text-xs font-mono text-gcs-accent">21.278° N | 81.629° E</div>
      </div>

      <MapContainer 
        center={[21.2787, 81.6296]} 
        zoom={15} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapEvents />
        
        {mission.length > 0 && (
          <>
            <Polyline 
              positions={mission.map(m => [m.lat, m.lng])} 
              color="#00ff41" 
              weight={1} 
              dashArray="8, 8"
              opacity={0.5}
            />
            {mission.map((wp, idx) => (
               <Marker 
                key={wp.id} 
                position={[wp.lat, wp.lng]} 
                icon={wpIcon(idx + 1)}
               >
                 <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <div className="bg-zinc-950 text-zinc-300 p-2 rounded text-[10px] font-bold font-mono">
                        WP #{idx+1}: {wp.command}<br/>
                        ALT: {wp.alt}m | SPD: {wp.speed}m/s
                    </div>
                 </Tooltip>
               </Marker>
            ))}
          </>
        )}

        <Marker position={[telemetry.lat, telemetry.lng]} icon={droneIcon} />
      </MapContainer>
    </div>
  )
}

function TabContent({ tab }: { tab: Tab }) {
  if (tab === 'SETUP' || tab === 'CONFIG') {
    return (
      <div className="p-8 grid grid-cols-2 gap-8 h-full overflow-y-auto">
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase text-zinc-500 tracking-widest border-b border-white/5 pb-2">Vehicle Parameters</h2>
          <div className="space-y-4">
            <ParamInput label="Flight Mode" value="AUTO" />
            <ParamInput label="Max Altitude" value="120m" />
            <ParamInput label="Loiter Radius" value="25m" />
            <ParamInput label="RTL Altitude" value="45m" />
            <ParamInput label="Speed Limit" value="15 m/s" />
          </div>
        </section>
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase text-zinc-500 tracking-widest border-b border-white/5 pb-2">Fail-Safe Config</h2>
          <div className="space-y-4">
            <ParamInput label="Soft Battery FS" value="30%" />
            <ParamInput label="Crit Battery FS" value="15%" />
            <ParamInput label="Max Fall Rate" value="-8.5 m/s" />
            <ParamInput label="Parachute Alt" value="20m" />
            <div className="flex justify-between items-center bg-zinc-900 px-4 py-2 rounded border border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Airbag Deployment</span>
                <input type="checkbox" defaultChecked className="accent-gcs-accent" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (tab === 'SIMULATION') {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-8 h-full">
         <div className="w-24 h-24 rounded-full border-4 border-gcs-accent/30 border-t-gcs-accent animate-spin" />
         <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-2">SITL Simulator Ready</h2>
            <p className="text-zinc-500 text-sm max-w-md">Firmware: ArduCopter v4.2.1-precision. Simulation speed locked at 1.0x Real-time.</p>
         </div>
         <div className="flex gap-4">
            <button className="gcs-btn gcs-btn-accent">Restart Simulation</button>
            <button className="gcs-btn gcs-btn-primary">Toggle Swarm Mode</button>
         </div>
      </div>
    )
  }

  if (tab === 'HELP') {
    return (
      <div className="p-12 prose prose-invert max-w-none prose-sm">
        <h1 className="text-gcs-accent font-display">Precision Wildlife GCS Help</h1>
        <p className="text-zinc-400">This Ground Control Station manages autonomous wildlife contraceptive delivery. Use the <strong>PLAN</strong> tab to define waypoints and <strong>DATA</strong> to monitor live telemetry.</p>
        <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="gcs-panel p-6 rounded-2xl">
                <h4 className="text-white mt-0">Authorized Intervention</h4>
                <p>Delivery is only authorized when species is Wild Boar AND confidence &gt; 0.7. Battery must be &gt; 30%.</p>
            </div>
            <div className="gcs-panel p-6 rounded-2xl">
                <h4 className="text-white mt-0">Emergency Failsafe</h4>
                <p>System automatically triggers RLT (Return to Launch) or AUTO_LAND depending on battery criticality.</p>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-12 text-zinc-600 font-display italic">
      {tab} Module Interface - Aerodynamic Simulation Data Injected
    </div>
  )
}

function ParamInput({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center bg-zinc-900 border border-white/5 rounded px-4 py-2 hover:border-gcs-accent/30 transition-colors">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">{label}</span>
            <span className="font-mono text-xs text-white">{value}</span>
        </div>
    )
}


