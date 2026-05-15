var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var JWT_SECRET = process.env.JWT_SECRET || "wildlife-secret-2026";
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  const users = [];
  const drones = [
    { id: "DR-001", name: "Alpha Scout", battery: 85, status: "Active", payload: "Spray", lat: 21.2787, lng: 81.6296 },
    { id: "DR-002", name: "Bravo Thermal", battery: 42, status: "Returning", payload: "Pheromone Pod", lat: 21.285, lng: 81.635 },
    { id: "DR-003", name: "Gama Delivery", battery: 98, status: "Standby", payload: "Contact Applicator", lat: 21.27, lng: 81.62 }
  ];
  const species = {
    "wild_boar": {
      id: "wild_boar",
      name: "Wild Boar (Sus scrofa)",
      location: "Chhattisgarh / Central India",
      population: 4500,
      risk: "High (Overpopulation)",
      herdStructure: [
        { type: "Juveniles", count: 1200 },
        { type: "Adult Females", count: 1800 },
        { type: "Adult Males", count: 1500 }
      ],
      breedingCycle: "Year-round, peaks in Feb-May",
      projection: [
        { month: "Jan", count: 4200 },
        { month: "Mar", count: 4500 },
        { month: "May", count: 4800 },
        { month: "Jul", count: 4600 },
        { month: "Sep", count: 4450 },
        { month: "Nov", count: 4550 }
      ]
    },
    "chital": {
      id: "chital",
      name: "Chital (Spotted Deer)",
      location: "Chhattisgarh / Kanha Border",
      population: 8200,
      risk: "Moderate",
      herdStructure: [
        { type: "Fawns", count: 2e3 },
        { type: "Does", count: 4e3 },
        { type: "Bucks", count: 2200 }
      ],
      breedingCycle: "Mainly monsoon season"
    }
  };
  const heatmapData = [
    { id: 1, lat: 21.2787, lng: 81.6296, intensity: 0.8, count: 45 },
    { id: 2, lat: 21.285, lng: 81.635, intensity: 0.9, count: 62 },
    { id: 3, lat: 21.27, lng: 81.62, intensity: 0.6, count: 31 },
    { id: 4, lat: 21.29, lng: 81.61, intensity: 0.4, count: 18 },
    { id: 5, lat: 21.26, lng: 81.64, intensity: 0.7, count: 52 }
  ];
  let telemetry = {
    pitch: 2.5,
    roll: -1.2,
    yaw: 145.8,
    voltage: 14.8,
    batteryPct: 82,
    sats: 14,
    groundSpeed: 8.4,
    verticalSpeed: 0.2,
    distToWp: 142,
    mode: "AUTO",
    armed: true,
    lat: 21.2787,
    lng: 81.6296,
    alt: 45.2
  };
  let failsafe = {
    active: false,
    reason: "NONE",
    surface: "STABLE",
    mode: "NORMAL",
    recovery: "NONE",
    verticalSpeed: 0
  };
  let mission = [
    { id: 1, command: "TAKEOFF", lat: 21.2787, lng: 81.6296, alt: 45, frame: "Relative", delay: 0, speed: 5 },
    { id: 2, command: "WAYPOINT", lat: 21.285, lng: 81.635, alt: 45, frame: "Relative", delay: 2, speed: 10 },
    { id: 3, command: "WAYPOINT", lat: 21.27, lng: 81.62, alt: 45, frame: "Relative", delay: 0, speed: 12 },
    { id: 4, command: "LAND", lat: 21.27, lng: 81.62, alt: 0, frame: "Relative", delay: 0, speed: 2 }
  ];
  let logs = [
    `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] GCS_INITIALIZED`,
    `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] COMMS_ESTABLISHED_115200BAUD`
  ];
  let detections = [];
  const addLog = (msg) => {
    logs.unshift(`[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${msg}`);
    if (logs.length > 50) logs.pop();
  };
  const updateTelemetry = () => {
    telemetry.pitch += (Math.random() - 0.5) * 0.4;
    telemetry.roll += (Math.random() - 0.5) * 0.4;
    telemetry.yaw = (telemetry.yaw + 0.1) % 360;
    telemetry.alt += (Math.random() - 0.5) * 0.1;
    telemetry.batteryPct = Math.max(0, telemetry.batteryPct - 5e-3);
  };
  setInterval(updateTelemetry, 100);
  setInterval(() => {
    if (detections.length === 0 && Math.random() > 0.4) {
      detections = [
        { id: Date.now(), species: "Wild Boar", confidence: 0.92 + Math.random() * 0.05, x: "25%", y: "35%", w: "45%", h: "40%" }
      ];
      addLog("AI_TARGET_ACQUIRED: Wild Boar (Sus scrofa)");
      if (detectionTimeout) clearTimeout(detectionTimeout);
      detectionTimeout = setTimeout(() => {
        detections = [];
        addLog("TARGET_LOST");
      }, 15e3);
    }
  }, 8e3);
  let detectionTimeout = null;
  app.post("/api/auth/register", async (req, res) => {
    const { email, password } = req.body;
    if (users.find((u) => u.email === email)) return res.status(400).json({ error: "User exists" });
    const hashedPassword = await import_bcryptjs.default.hash(password, 10);
    const user = { id: Date.now().toString(), email, password: hashedPassword };
    users.push(user);
    const token = import_jsonwebtoken.default.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email } });
  });
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user || !await import_bcryptjs.default.compare(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = import_jsonwebtoken.default.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email } });
  });
  app.get("/api/heatmap", (req, res) => res.json(heatmapData));
  app.get("/api/drones", (req, res) => res.json(drones));
  app.get("/api/species/:id", (req, res) => {
    const s = species[req.params.id];
    if (s) res.json(s);
    else res.status(404).json({ error: "Species not found" });
  });
  app.get("/api/telemetry", (req, res) => res.json(telemetry));
  app.get("/api/failsafe", (req, res) => res.json(failsafe));
  app.get("/api/mission", (req, res) => res.json(mission));
  app.get("/api/logs", (req, res) => res.json(logs));
  app.post("/api/mission", (req, res) => {
    mission = req.body.mission;
    addLog(`MISSION_UPDATED: ${mission.length} Waypoints received`);
    res.json({ status: "ok" });
  });
  app.post("/api/drone/arm", (req, res) => {
    telemetry.armed = true;
    addLog("VEHICLE_ARMED");
    res.json({ status: "ok" });
  });
  app.post("/api/drone/disarm", (req, res) => {
    telemetry.armed = false;
    addLog("VEHICLE_DISARMED");
    res.json({ status: "ok" });
  });
  app.post("/api/drone/mode", (req, res) => {
    const { mode } = req.body;
    telemetry.mode = mode;
    addLog(`MODE_CHANGED: ${mode}`);
    res.json({ status: "ok" });
  });
  app.post("/api/failsafe/trigger", (req, res) => {
    const { reason } = req.body;
    addLog(`FAILSAFE_TRIGGERED: ${reason}`);
    failsafe = {
      active: true,
      reason: reason || "MANUAL_ABORT",
      surface: "FLIGHT",
      mode: "RTL",
      recovery: "GPS_RECOVERY_READY",
      verticalSpeed: -1.2
    };
    res.json(failsafe);
  });
  app.post("/api/failsafe/reset", (req, res) => {
    addLog("FAILSAFE_RESET");
    failsafe = {
      active: false,
      reason: "NONE",
      surface: "STABLE",
      mode: "NORMAL",
      recovery: "NONE",
      verticalSpeed: 0
    };
    res.json(failsafe);
  });
  app.get("/api/detections", (req, res) => {
    res.json(detections);
  });
  app.post("/api/detections/simulate", (req, res) => {
    detections = [
      { id: 1, species: "Wild Boar", confidence: 0.94, x: "25%", y: "40%", w: "40%", h: "35%" }
    ];
    addLog("WILD_BOAR_DETECT_CONF_94");
    if (detectionTimeout) clearTimeout(detectionTimeout);
    detectionTimeout = setTimeout(() => {
      detections = [];
      addLog("TARGET_LOST");
    }, 15e3);
    res.json({ status: "ok" });
  });
  app.get("/api/population/simulation", (req, res) => {
    const data = Array.from({ length: 10 }, (_, i) => ({
      year: 2026 + i,
      noIntervention: Math.floor(1e3 * Math.pow(1.15, i)),
      systemIntervention: Math.floor(1e3 * Math.pow(1.02, i))
    }));
    res.json(data);
  });
  app.post("/api/delivery/authorize", (req, res) => {
    const { species: sId, sex, age, last_treated, cooldown } = req.body;
    const isWildBoar = sId === "wild_boar";
    const isFemale = sex === "female";
    const isMature = age >= 12;
    const isReady = last_treated > (cooldown || 6);
    const authorized = isWildBoar && isFemale && isMature && isReady;
    res.json({
      authorized,
      reason: authorized ? "Protocol criteria met." : "Target fails eligibility criteria.",
      targetLock: authorized,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
