import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  Map as MapIcon, 
  Dna, 
  Crosshair, 
  AlertTriangle, 
  TrendingUp, 
  Settings,
  LogOut,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
    { name: 'Live Drone Feed', icon: <Video />, path: '/dashboard/feed' },
    { name: 'Heatmaps', icon: <MapIcon />, path: '/dashboard/heatmap' },
    { name: 'Species Intel', icon: <Dna />, path: '/dashboard/species' },
    { name: 'Delivery Selector', icon: <Crosshair />, path: '/dashboard/delivery' },
    { name: 'Risk Analysis', icon: <AlertTriangle />, path: '/dashboard/risk' },
    { name: 'Cost & Impact', icon: <TrendingUp />, path: '/dashboard/impact' },
    { name: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-white/5 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <Activity className="text-black w-5 h-5" />
        </div>
        <span className="font-display font-bold tracking-tight text-lg">PRECISION AI</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/dashboard'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              isActive 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
            )}
          >
            <span className="w-5 h-5">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
