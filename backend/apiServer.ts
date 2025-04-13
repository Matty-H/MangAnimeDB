// MangAnimeDB/src/server/index.ts
import express from 'express';
import type { Express } from 'express';
import searchRoutes from './api/endPoint.ts';

const app: Express = express();
const PORT = 3000;

app.use('/api/search', searchRoutes);

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT} ✅`);
});