// MangAnimeDB/src/server/index.ts
import express from 'express';
import type { Express } from 'express';
import mangaAnimeRoutes from './routes/mangaAnime.ts';

const app: Express = express();
const PORT = 3001;

app.use('/api/mangaanime', mangaAnimeRoutes);

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT} ✅`);
});