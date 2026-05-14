import React from 'react';
import { Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useGCS } from '../contexts/GCSContext';

export default function MissionTable() {
  const { mission, setMission, saveMission } = useGCS();

  const addBelow = (index: number) => {
    const prevWp = mission[index];
    const newWp = { 
      id: Date.now(), 
      command: 'WAYPOINT', 
      lat: prevWp ? prevWp.lat : 21.2787, 
      lng: prevWp ? prevWp.lng : 81.6296, 
      alt: 45, 
      frame: 'Relative', 
      delay: 0, 
      speed: 10 
    };
    const updated = [...mission];
    if (index === -1) {
      updated.push(newWp);
    } else {
      updated.splice(index + 1, 0, newWp);
    }
    setMission(updated);
  };

  const remove = (index: number) => {
    const updated = mission.filter((_, i) => i !== index);
    setMission(updated);
  };

  const updateField = (index: number, field: string, value: any) => {
    const updated = [...mission];
    updated[index][field] = value;
    setMission(updated);
  };

  return (
    <div className="gcs-panel h-full overflow-hidden flex flex-col">
      <div className="bg-zinc-800/50 px-4 py-2 border-b border-gcs-border flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Mission Commands</span>
        <div className="flex gap-2">
            <button className="gcs-btn gcs-btn-primary text-[10px] py-1" onClick={() => addBelow(-1)}>Add WP</button>
            <button className="gcs-btn gcs-btn-accent text-[10px] py-1" onClick={() => setMission([])}>Clear All</button>
            <button className="gcs-btn gcs-btn-primary text-[10px] py-1" onClick={saveMission}>Save Mission</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 bg-gcs-panel z-10">
            <tr className="text-left text-zinc-500 border-b border-gcs-border">
              <th className="p-2 w-8">#</th>
              <th className="p-2">Command</th>
              <th className="p-2">Lat</th>
              <th className="p-2">Lng</th>
              <th className="p-2">Alt(m)</th>
              <th className="p-2">Delay(s)</th>
              <th className="p-2">Speed(m/s)</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mission.map((wp, idx) => (
              <tr key={wp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-2 text-zinc-500 font-mono">{idx + 1}</td>
                <td className="p-2">
                  <select 
                    value={wp.command} 
                    onChange={(e) => updateField(idx, 'command', e.target.value)}
                    className="gcs-input w-24"
                  >
                    <option>WAYPOINT</option>
                    <option>TAKEOFF</option>
                    <option>LAND</option>
                    <option>DO_SPRAYER</option>
                    <option>DO_POD</option>
                    <option>DO_CHANGE_SPEED</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="number" step="0.0001" value={wp.lat} 
                    onChange={(e) => updateField(idx, 'lat', parseFloat(e.target.value))}
                    className="gcs-input w-20" />
                </td>
                <td className="p-2">
                  <input type="number" step="0.0001" value={wp.lng} 
                    onChange={(e) => updateField(idx, 'lng', parseFloat(e.target.value))}
                    className="gcs-input w-20" />
                </td>
                <td className="p-2">
                  <input type="number" value={wp.alt} 
                    onChange={(e) => updateField(idx, 'alt', parseInt(e.target.value))}
                    className="gcs-input w-12" />
                </td>
                <td className="p-2">
                  <input type="number" value={wp.delay} 
                    onChange={(e) => updateField(idx, 'delay', parseInt(e.target.value))}
                    className="gcs-input w-12" />
                </td>
                <td className="p-2">
                  <input type="number" value={wp.speed} 
                    onChange={(e) => updateField(idx, 'speed', parseInt(e.target.value))}
                    className="gcs-input w-12" />
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => addBelow(idx)} className="p-1 hover:bg-white/10 rounded"><Plus size={12}/></button>
                    <button onClick={() => remove(idx)} className="p-1 hover:bg-red-500/20 text-red-400 rounded"><Trash2 size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
