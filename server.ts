import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();

const JWT_SECRET =
  process.env.JWT_SECRET || "wildlife-secret-2026";

app.use(express.json());

// Mock Database
const users: any[] = [];

const drones = [
  {
    id: "DR-001",
    name: "Alpha Scout",
    battery: 85,
    status: "Active",
    payload: "Spray",
    lat: 21.2787,
    lng: 81.6296,
  },
  {
    id: "DR-002",
    name: "Bravo Thermal",
    battery: 42,
    status: "Returning",
    payload: "Pheromone Pod",
    lat: 21.285,
    lng: 81.635,
  },
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
  alt: 45.2,
};

// AUTH ROUTES

app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({
      error: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
  };

  users.push(user);

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET
  );

  return res.json({
    token,
    user: {
      id: user.id,
      email,
    },
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (
    !user ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET
  );

  return res.json({
    token,
    user: {
      id: user.id,
      email,
    },
  });
});

// API ROUTES

app.get("/api/telemetry", (req, res) => {
  return res.json(telemetry);
});

app.get("/api/drones", (req, res) => {
  return res.json(drones);
});

app.get("/", (req, res) => {
  return res.json({
    status: "API Running Successfully",
  });
});

export default app;