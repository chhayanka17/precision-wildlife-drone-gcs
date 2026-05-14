import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Map as MapIcon, Info, Loader2 } from 'lucide-react';

export default function HeatmapView() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/heatmap')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Population Heatmaps</h1>
          <p className="text-zinc-500">Spatial distribution of targeted wildlife clusters in Central India.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass p-3 rounded-xl flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <span className="text-xs font-bold">High Density</span>
          </div>
          <div className="glass p-3 rounded-xl flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-bold">Intervened Area</span>
          </div>
        </div>
      </header>

      <div className="flex-1 rounded-3xl overflow-hidden glass border-white/5 relative bg-zinc-900">
        <MapContainer 
          center={[21.2787, 81.6296]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          {/* Using a dark themed base layer from CartoDB */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {data.map(point => (
            <Circle
              key={point.id}
              center={[point.lat, point.lng]}
              pathOptions={{
                fillColor: point.intensity > 0.7 ? '#ef4444' : '#f59e0b',
                color: 'transparent',
                fillOpacity: point.intensity * 0.6
              }}
              radius={300 * point.intensity}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-32">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Density Unit</div>
                  <div className="text-lg font-bold text-zinc-900">{point.count} Herd Members</div>
                  <div className="text-xs text-zinc-600 mt-2 flex items-center gap-2">
                    <Info className="w-3 h-3" /> Targeted: 12 (Females)
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute top-6 left-6 z-[1000] p-4 glass rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MapIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">Region: Raipur-Durg Buffer</span>
          </div>
          <div className="w-full h-[1px] bg-white/10 my-1" />
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-400">Layer: Suspended Micro-Particulates</span>
          </div>
        </div>
      </div>
    </div>
  );
}
