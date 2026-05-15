🚁 Precision Wildlife Contraceptive Delivery Drone System

Techdivathon (20–21 February) | Top 10 Finalist
A Mission Planner–inspired Ground Control Station prototype for humane wildlife population management using autonomous drone systems.

📌 Overview

This project demonstrates a simulation-based drone control workflow designed for wild boar population management.
The system combines mission planning, telemetry monitoring, wildlife detection, intervention authorization logic, and fail-safe safety protocols into a unified Ground Control Station (GCS).

Built during a 24-hour hackathon, the prototype focuses on operational workflow design and real-time system simulation.

🌳 Problem Statement

Wild boar overpopulation contributes to:

Crop destruction
Economic loss in rural areas
Ecosystem imbalance
Increasing human–wildlife conflict

Current solutions such as culling, relocation, and non-selective methods are often temporary, expensive, or ethically controversial.

🧠 Proposed Solution

The system simulates an AI-assisted drone workflow capable of:

Detecting wildlife using RGB/Thermal-style feeds
Identifying wild boars through rule-based verification
Authorizing humane intervention actions
Simulating edible contraceptive pod deployment
Triggering autonomous fail-safe landing procedures
Logging mission and safety events in real time
🚀 Key Highlights
🗺 Mission Planner–inspired dashboard
📡 Real-time telemetry simulation
🎯 Wildlife detection workflow
⚙ Automated intervention authorization logic
📦 Primary edible pod deployment concept
🛑 Fail-safe landing & recovery simulation
📊 Structured event logging system
🏆 Built in 24 hours | Techdivathon Top 10
🖥 Dashboard Modules
🗺 Mission Planning
Interactive satellite map
Waypoint/grid mission workflow
Mission visualization
📡 Telemetry Simulation
Battery monitoring
GPS satellite simulation
Flight mode & speed updates
Distance-to-waypoint tracking
🎯 Wildlife Detection
Simulated RGB/Thermal workflow
Bounding box visualization
Species classification logic
Detection confidence scoring
⚙ Intervention Logic

The system authorizes intervention when:

Species = Wild Boar
Confidence > Threshold
Battery level safe
Target inside mission zone
📦 Payload Workflow
Primary: Edible contraceptive pod deployment
Secondary: Spray deployment concept
🛑 Safety & Fail-Safe System
Low battery detection
Autonomous landing trigger
Emergency descent simulation
Safety event logging
🏗 System Workflow
Mission Planning
        ↓
Telemetry Monitoring
        ↓
Wildlife Detection
        ↓
Decision Logic
        ↓
Payload Deployment
        ↓
Logging & Safety Monitoring
📸 Screenshots
Mission Planner Dashboard

Wildlife Detection Workflow

Intervention Authorization

🎥 Demo Video

🔗 Add Demo Link Here

🛠 Tech Stack (Prototype Level)
Frontend
React
TypeScript
Tailwind CSS
Simulation & Logic
Workflow-based simulation engine
Rule-based decision system
UI/UX
Mission Planner–inspired aviation dashboard
Dark operational control interface
📂 Project Structure
/frontend
/docs
   /screenshots
README.md
⚠ Current Limitations
Detection system is simulation-based
No real MAVLink integration
Payload deployment is conceptual
No live edge-AI inference
No real drone hardware integration
🔮 Future Improvements
Real-time YOLO model integration
Multi-drone swarm coordination
Terrain-aware autonomous navigation
Real telemetry & MAVLink support
Hardware flight-controller integration
🎓 Learning Outcomes

This project strengthened our understanding of:

Real-time operational UI design
Drone mission workflow architecture
Rule-based autonomous decision systems
Safety-critical interface thinking
Rapid prototyping under hackathon constraints
👥 Team
Chhayanka Dabhadker
Aanya Dubey
Charvi Thakur
⚠ Disclaimer

This repository contains a hackathon prototype built for simulation and concept demonstration purposes.
It is not intended for real-world wildlife deployment without extensive field validation and regulatory approval.

🏆 Achievement

Secured a Top 10 position at Techdivathon (20–21 February).
