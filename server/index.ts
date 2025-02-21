// server/index.ts
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { resolve } from 'path';
import type { ViteDevServer } from 'vite';

async function createServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  let vite: ViteDevServer | null = null;

  // Configure Vite in development mode
  if (!isProduction) {
    vite = await createServer({
      server: { 
        middlewareMode: true,
        hmr: { 
          server: app.listen(port, () => {
            console.log(`Dev server running on http://localhost:${port}`);
          })
        },
        allowedHosts: 'all' // Correct configuration
      },
      appType: 'spa'
    });

    // Use Vite's middleware
    app.use(vite.middlewares);
  } else {
    // Production: Serve static assets
    app.use(express.static(resolve(__dirname, '../dist/public'), {
      index: false // Let Express handle index.html through routes
    }));

    // Serve static files from client build
    app.use('/assets', express.static(resolve(__dirname, '../dist/public/assets')));
  }

  // API Routes
  app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from Express!' });
  });

  // Handle SPA client routing
  app.get('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      
      // Development: Use Vite's HTML transformation
      if (vite) {
        const template = await vite.transformIndexHtml(url, 
          `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Vite + Express</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/main.tsx"></script>
            </body>
          </html>`
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } else {
        // Production: Serve built index.html
        res.sendFile(resolve(__dirname, '../dist/public/index.html'));
      }
    } catch (e) {
      if (e instanceof Error) {
        vite?.ssrFixStacktrace(e);
        console.error(e.stack);
        res.status(500).end(e.stack);
      }
    }
  });

  // Start production server
  if (isProduction) {
    app.listen(port, () => {
      console.log(`Production server running on port ${port}`);
    });
  }
}

createServer();
