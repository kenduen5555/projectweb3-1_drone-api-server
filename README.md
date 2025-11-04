# projectweb3-1_drone-api-server
# Drone API Server

This is an API server built with **Node.js** and **Express.js**.  
It connects to:
- Drone Config Server
- Drone Log Server (PocketBase API)

## Endpoints

| Method | Path | Description |
|--------|------|--------------|
| GET | /configs/:droneId | Get drone config |
| GET | /status/:droneId | Get drone status |
| GET | /logs/:droneId | Get latest 12 logs |
| POST | /logs | Create new drone log |

How to Run

Install dependencies:

npm install


Start server:

npm start


Visit:

http://localhost:3002
