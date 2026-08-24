import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Backend API plugin to provide shared database for all phones and devices
function sharedBackendPlugin(): Plugin {
  const dataDir = path.resolve(__dirname, './data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const volFile = path.join(dataDir, 'volunteers.json');
  const mealFile = path.join(dataDir, 'meals.json');

  if (!fs.existsSync(volFile)) fs.writeFileSync(volFile, '[]');
  if (!fs.existsSync(mealFile)) fs.writeFileSync(mealFile, '[]');

  return {
    name: 'shared-backend-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // GET /api/volunteers
        if (req.url === '/api/volunteers' && req.method === 'GET') {
          try {
            const data = fs.readFileSync(volFile, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // POST /api/volunteers
        if (req.url === '/api/volunteers' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const newVol = JSON.parse(body);
              const current = JSON.parse(fs.readFileSync(volFile, 'utf-8') || '[]');
              current.unshift(newVol);
              fs.writeFileSync(volFile, JSON.stringify(current, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, count: current.length, volunteer: newVol }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        // GET /api/meals
        if (req.url === '/api/meals' && req.method === 'GET') {
          try {
            const data = fs.readFileSync(mealFile, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        // POST /api/meals
        if (req.url === '/api/meals' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const newDays = JSON.parse(body);
              fs.writeFileSync(mealFile, JSON.stringify(newDays, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, days: newDays }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), sharedBackendPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    watch: {
      ignored: ['**/*.exe', '**/data/**', '**/.git/**'],
    },
  },
});
