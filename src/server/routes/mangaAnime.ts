// Path: /Users/matisse/Documents/Dev/MangAnimeDB/src/server/routes/mangaAnime.ts
import express from 'express';
import type { Router, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Définir le gestionnaire avec le bon type de retour
const getMangaAnime: RequestHandler = async (req, res) => {
  const { title } = req.query;
  
  if (typeof title !== 'string') {
    res.status(400).send('Missing or invalid title');
    return; // Retourne void comme attendu
  }
  
  try {
    const results = await prisma.manga_anime.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
      include: {
        animeAdaptations: true,
      },
    });
    
    res.send(results);
    // Ne pas retourner res.send()
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
    // Ne pas retourner res.status().send()
  }
};

router.get('/', getMangaAnime);

export default router;