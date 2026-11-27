# Weather-Aware Truck Routing Frontend

React app for planning truck routes with weather risk: compare routes on a map, inspect checkpoint weather, and see which route is recommended and why.

- Live app: https://weather-aware-t-routing.vercel.app
- Backend: https://github.com/kiani007/weather-aware-t-routing-backend
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)

## Features

- Origin and destination search, departure time, truck load, and sampling interval (10, 25 or 50 miles).
- Up to 3 routes on the map. Click a line or a tab to select one.
- Recommended route with the reason it was chosen.
- Route comparison table and per-checkpoint weather table.
- Weather heatmap for risk, wind, rain and snow, with a 48-hour playback slider.
- Missing weather shown as Unknown, never Low.
- Recent trips saved in the browser.
- Works on desktop and mobile.

Stack: React 19, TypeScript, Vite, TanStack Query, Leaflet, Tailwind CSS, Vitest.

## Setup

Requires Node.js 20.19+ and the backend running on port 8000.

```bash
git clone https://github.com/kiani007/weather-aware-t-routing-frontend.git
cd weather-aware-t-routing-frontend
npm install
npm run dev
```

Open http://localhost:5173. Requests to `/api` are forwarded to the backend at `http://127.0.0.1:8000`, so no `.env` is needed.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint |

## Deployment

Deployed on Vercel. `vercel.json` forwards `/api/*` to the backend, so no environment variables are needed.
