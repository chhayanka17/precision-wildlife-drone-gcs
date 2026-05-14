import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'wildlife-secret-2026';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  const users: any[] = [];
  const drones = [
    { id: 'DR-001', name: 'Alpha Scout', battery: 85, status: 'Active', payload: 'Spray', lat: 21.2787, lng: 81.6296 },
    { id: 'DR-002', name: 'Bravo Thermal', battery: 42, status: 'Returning', payload: 'Pheromone Pod', lat: 21.2850, lng: 81.6350 },
    { id: 'DR-003', name: 'Gama Delivery', battery: 98, status: 'Standby', payload: 'Contact Applicator', lat: 21.2700, lng: 81.6200 },
  ];

  const species = {
    'wild_boar': {
      id: 'wild_boar',
      name: 'Wild Boar (Sus scrofa)',
      location: 'Chhattisgarh / Central India',
      population: 4500,
      risk: 'High (Overpopulation)',
      herdStructure: [
        { type: 'Juveniles', count: 1200 },
        { type: 'Adult Females', count: 1800 },
        { type: 'Adult Males', count: 1500 },
      ],
      breedingCycle: 'Year-round, peaks in Feb-May',
      projection: [
        { month: 'Jan', count: 4200 },
        { month: 'Mar', count: 4500 },
        { month: 'May', count: 4800 },
        { month: 'Jul', count: 4600 },
        { month: 'Sep', count: 4450 },
        { month: 'Nov', count: 4550 },
      ]
    },
    'chital': {
      id: 'chital',
      name: 'Chital (Spotted Deer)',
      location: 'Chhattisgarh / Kanha Border',
      population: 8200,
      risk: 'Moderate',
      herdStructure: [
        { type: 'Fawns', count: 2000 },
        { type: 'Does', count: 4000 },
        { type: 'Bucks', count: 2200 },
      ],
      breedingCycle: 'Mainly monsoon season',
    }
  };

  const heatmapData = [
    { id: 1, lat: 21.2787, lng: 81.6296, intensity: 0.8, count: 45 },
    { id: 2, lat: 21.2850, lng: 81.6350, intensity: 0.9, count: 62 },
    { id: 3, lat: 21.2700, lng: 81.6200, intensity: 0.6, count: 31 },
    { id: 4, lat: 21.2900, lng: 81.6100, intensity: 0.4, count: 18 },
    { id: 5, lat: 21.2600, lng: 81.6400, intensity: 0.7, count: 52 },
  ];

  // GCS State
  let telemetry = {
    pitch: 2.5, roll: -1.2, yaw: 145.8, voltage: 14.8, batteryPct: 82,
    sats: 14, groundSpeed: 8.4, verticalSpeed: 0.2, distToWp: 142,
    mode: 'AUTO', armed: true, lat: 21.2787, lng: 81.6296, alt: 45.2
  };

  let failsafe = {
    active: false,
    reason: 'NONE',
    surface: 'STABLE',
    mode: 'NORMAL',
    recovery: 'NONE',
    verticalSpeed: 0
  };

  let mission = [
    { id: 1, command: 'TAKEOFF', lat: 21.2787, lng: 81.6296, alt: 45, frame: 'Relative', delay: 0, speed: 5 },
    { id: 2, command: 'WAYPOINT', lat: 21.2850, lng: 81.6350, alt: 45, frame: 'Relative', delay: 2, speed: 10 },
    { id: 3, command: 'WAYPOINT', lat: 21.2700, lng: 81.6200, alt: 45, frame: 'Relative', delay: 0, speed: 12 },
    { id: 4, command: 'LAND', lat: 21.2700, lng: 81.6200, alt: 0, frame: 'Relative', delay: 0, speed: 2 },
  ];

  let logs: string[] = [
    `[${new Date().toLocaleTimeString()}] GCS_INITIALIZED`,
    `[${new Date().toLocaleTimeString()}] COMMS_ESTABLISHED_115200BAUD`,
  ];

  let detections: any[] = [];

  const addLog = (msg: string) => {
    logs.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
    if (logs.length > 50) logs.pop();
  };

  // Simulations
  const updateTelemetry = () => {
    telemetry.pitch += (Math.random() - 0.5) * 0.4;
    telemetry.roll += (Math.random() - 0.5) * 0.4;
    telemetry.yaw = (telemetry.yaw + 0.1) % 360;
    telemetry.alt += (Math.random() - 0.5) * 0.1;
    telemetry.batteryPct = Math.max(0, telemetry.batteryPct - 0.005);
  };
  setInterval(updateTelemetry, 100);

  // Auto-simulate detections if in certain modes
  setInterval(() => {
    // If armed and in AUTO/DATA tab, or just random chance
    if (detections.length === 0 && Math.random() > 0.4) {
        detections = [
            { id: Date.now(), species: 'Wild Boar', confidence: 0.92 + Math.random() * 0.05, x: '25%', y: '35%', w: '45%', h: '40%' },
        ];
        addLog('AI_TARGET_ACQUIRED: Wild Boar (Sus scrofa)');
        
        if (detectionTimeout) clearTimeout(detectionTimeout);
        detectionTimeout = setTimeout(() => {
            detections = [];
            addLog('TARGET_LOST');
        }, 15000);
    }
  }, 8000);

  // Clear detections after 15 seconds if not refreshed
  let detectionTimeout: NodeJS.Timeout | null = null;

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), email, password: hashedPassword };
    users.push(user);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email } });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email } });
  });

  // Data Routes
  app.get('/api/heatmap', (req, res) => res.json(heatmapData));
  app.get('/api/drones', (req, res) => res.json(drones));
  app.get('/api/species/:id', (req, res) => {
    const s = species[req.params.id as keyof typeof species];
    if (s) res.json(s);
    else res.status(404).json({ error: 'Species not found' });
  });

  // GCS API
  app.get('/api/telemetry', (req, res) => res.json(telemetry));
  app.get('/api/failsafe', (req, res) => res.json(failsafe));
  app.get('/api/mission', (req, res) => res.json(mission));
  app.get('/api/logs', (req, res) => res.json(logs));
  
  app.post('/api/mission', (req, res) => {
    mission = req.body.mission;
    addLog(`MISSION_UPDATED: ${mission.length} Waypoints received`);
    res.json({ status: 'ok' });
  });

  app.post('/api/drone/arm', (req, res) => {
    telemetry.armed = true;
    addLog('VEHICLE_ARMED');
    res.json({ status: 'ok' });
  });

  app.post('/api/drone/disarm', (req, res) => {
    telemetry.armed = false;
    addLog('VEHICLE_DISARMED');
    res.json({ status: 'ok' });
  });

  app.post('/api/drone/mode', (req, res) => {
    const { mode } = req.body;
    telemetry.mode = mode;
    addLog(`MODE_CHANGED: ${mode}`);
    res.json({ status: 'ok' });
  });
  
  app.post('/api/failsafe/trigger', (req, res) => {
    const { reason } = req.body;
    addLog(`FAILSAFE_TRIGGERED: ${reason}`);
    failsafe = {
        active: true,
        reason: reason || 'MANUAL_ABORT',
        surface: 'FLIGHT',
        mode: 'RTL',
        recovery: 'GPS_RECOVERY_READY',
        verticalSpeed: -1.2
    };
    res.json(failsafe);
  });

  app.post('/api/failsafe/reset', (req, res) => {
    addLog('FAILSAFE_RESET');
    failsafe = {
        active: false,
        reason: 'NONE',
        surface: 'STABLE',
        mode: 'NORMAL',
        recovery: 'NONE',
        verticalSpeed: 0
    };
    res.json(failsafe);
  });

  app.get('/api/detections', (req, res) => {
    res.json(detections);
  });

  app.post('/api/detections/simulate', (req, res) => {
    detections = [
        { id: 1, species: 'Wild Boar', confidence: 0.94, x: '25%', y: '40%', w: '40%', h: '35%' },
    ];
    addLog('WILD_BOAR_DETECT_CONF_94');
    
    if (detectionTimeout) clearTimeout(detectionTimeout);
    detectionTimeout = setTimeout(() => {
        detections = [];
        addLog('TARGET_LOST');
    }, 15000);

    res.json({ status: 'ok' });
  });

  app.get('/api/population/simulation', (req, res) => {
    // Mock simulation data
    const data = Array.from({ length: 10 }, (_, i) => ({
      year: 2026 + i,
      noIntervention: Math.floor(1000 * Math.pow(1.15, i)),
      systemIntervention: Math.floor(1000 * Math.pow(1.02, i)),
    }));
    res.json(data);
  });

  app.post('/api/delivery/authorize', (req, res) => {
    const { species: sId, sex, age, last_treated, cooldown } = req.body;
    
    // IF species == "wild_boar" AND sex == "female" 
    // AND age >= maturity AND last_treated > cooldown
    // THEN authorize = true
    
    const isWildBoar = sId === 'wild_boar';
    const isFemale = sex === 'female';
    const isMature = age >= 12; // months
    const isReady = last_treated > (cooldown || 6); // months
    
    const authorized = isWildBoar && isFemale && isMature && isReady;
    
    res.json({
      authorized,
      reason: authorized ? 'Protocol criteria met.' : 'Target fails eligibility criteria.',
      targetLock: authorized,
      timestamp: new Date().toISOString()
    });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
