import React, { createContext, useContext, useState, useEffect } from 'react';

interface Telemetry {
  pitch: number;
  roll: number;
  yaw: number;
  voltage: number;
  batteryPct: number;
  sats: number;
  groundSpeed: number;
  verticalSpeed: number;
  distToWp: number;
  mode: string;
  armed: boolean;
  lat: number;
  lng: number;
  alt: number;
}

interface Failsafe {
  active: boolean;
  reason: string;
  surface: string;
  mode: string;
  recovery: string;
  verticalSpeed: number;
}

interface GCSContextType {
  telemetry: Telemetry;
  failsafe: Failsafe;
  mission: any[];
  logs: string[];
  detections: any[];
  setMission: (m: any[] | ((prev: any[]) => any[])) => void;
  triggerFailsafe: (reason: string) => void;
  resetFailsafe: () => void;
  armDrone: () => void;
  disarmDrone: () => void;
  setMode: (mode: string) => void;
  saveMission: () => Promise<void>;
}

const GCSContext = createContext<GCSContextType | null>(null);

export function GCSProvider({ children }: { children: React.ReactNode }) {
  const [telemetry, setTelemetry] = useState<Telemetry>({
    pitch: 0, roll: 0, yaw: 0, voltage: 12, batteryPct: 100,
    sats: 10, groundSpeed: 0, verticalSpeed: 0, distToWp: 0,
    mode: 'STABILIZE', armed: false, lat: 0, lng: 0, alt: 0
  });

  const [failsafe, setFailsafe] = useState<Failsafe>({
    active: false, reason: 'NONE', surface: 'UNKNOWN', mode: 'NORMAL', recovery: 'NONE', verticalSpeed: 0
  });

  const [mission, setMission] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [detections, setDetections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/telemetry')
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setTelemetry(data))
        .catch(() => {});
      fetch('/api/failsafe')
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setFailsafe(data))
        .catch(() => {});
      fetch('/api/logs')
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setLogs(data))
        .catch(() => {});
      fetch('/api/detections')
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setDetections(data))
        .catch(() => {});
    };

    const fetchMission = () => {
      fetch('/api/mission')
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setMission(data))
        .catch(() => {});
    };

    fetchMission();
    const interval = setInterval(fetchData, 100); // 10Hz
    return () => clearInterval(interval);
  }, []);

  const triggerFailsafe = async (reason: string) => {
    try {
      const res = await fetch('/api/failsafe/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        setFailsafe(await res.json());
      }
    } catch (e) {
      console.error("Failsafe trigger failed", e);
    }
  };

  const resetFailsafe = async () => {
    try {
      const res = await fetch('/api/failsafe/reset', { method: 'POST' });
      if (res.ok) {
        setFailsafe(await res.json());
      }
    } catch (e) {
      console.error("Failsafe reset failed", e);
    }
  };

  const armDrone = async () => {
    fetch('/api/drone/arm', { method: 'POST' }).catch(() => {});
  };

  const disarmDrone = async () => {
    fetch('/api/drone/disarm', { method: 'POST' }).catch(() => {});
  };

  const setMode = async (mode: string) => {
    fetch('/api/drone/mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    }).catch(() => {});
  };

  const saveMission = async () => {
    try {
      const res = await fetch('/api/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission })
      });
      if (res.ok) {
        alert("Mission saved successfully");
      }
    } catch (e) {
      console.error("Save mission failed", e);
    }
  };

  return (
    <GCSContext.Provider value={{ 
        telemetry, failsafe, mission, logs, detections, setMission, 
        triggerFailsafe, resetFailsafe, armDrone, disarmDrone, setMode, saveMission 
    }}>
      {children}
    </GCSContext.Provider>
  );
}

export const useGCS = () => {
  const context = useContext(GCSContext);
  if (!context) throw new Error('useGCS must be used within GCSProvider');
  return context;
};
