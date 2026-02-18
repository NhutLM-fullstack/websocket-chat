# Chat Application Monorepo

A full-stack chat application with NestJS WebSocket backend and React frontend.

## Project Structure

```
.
├── packages/
│   ├── backend/          # NestJS WebSocket server
│   └── frontend/         # React client application
├── package.json          # Root monorepo configuration
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Install dependencies for all packages
npm install
```

### Development

```bash
# Run backend and frontend in development mode
npm run dev

# Or run individually:
npm run backend:dev    # Start NestJS backend on port 3000
npm run frontend:dev   # Start React frontend on port 5173
```

### Building

```bash
# Build all packages
npm run build

# Or build individually:
npm run backend:build
npm run frontend:build
```

### Production

```bash
# Start backend in production
npm run backend:start

# Or build and serve frontend
npm run frontend:build
```

## Available Scripts

### Root Level (Monorepo)
- `npm run dev` - Run all packages in development mode
- `npm run build` - Build all packages
- `npm run start` - Start all packages
- `npm run lint` - Lint all packages
- `npm run test` - Run tests in all packages

### Backend Specific
- `npm run backend:dev` - Development mode with hot reload
- `npm run backend:build` - Build for production
- `npm run backend:start` - Run production build

### Frontend Specific
- `npm run frontend:dev` - Development server on port 5173
- `npm run frontend:build` - Build for production

## Architecture

### Backend (NestJS)
- WebSocket server running on port 3000
- Real-time chat messaging
- Socket.io for WebSocket communication

### Frontend (React + Vite)
- Modern React GUI with hooks
- Socket.io client for WebSocket connection
- Real-time message updates

## Connecting Frontend to Backend

The frontend is configured to proxy API requests to `http://localhost:3000` in development mode.

## License

UNLICENSED
