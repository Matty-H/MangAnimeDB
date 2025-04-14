// backend/src/routes/search.ts
import express from 'express';
import type { Router, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Existing suggestions endpoint
const getSuggestions: RequestHandler = async (req, res): Promise<void> => {
  const { query } = req.query;
  
  if (typeof query !== 'string') {
    res.status(400).send('Missing or invalid query parameter');
    return;
  }
  
  try {
    const suggestions = await prisma.license.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
      },
      take: 10,
    });
    
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).send('Server error');
  }
};


const getDetailedSearch: RequestHandler = async (req, res): Promise<void> => {
  const { query } = req.query;
  
  if (typeof query !== 'string') {
    res.status(400).send('Missing or invalid query parameter');
    return;
  }
  
  try {
    const results = await prisma.license.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        mangas: {
          include: {
            adaptations: {
              include: {
                anime_name: true,
              },
            },
          },
        },
        animeAdaptations: {
          include: {
            seasons: true,
            sourcedFrom: {
              include: {
                manga_name: true,
              },
            },
          },
        },
      },
    });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching detailed search results:', error);
    res.status(500).send('Server error');
  }
};

// Register routes
router.get('/suggestions', getSuggestions);
router.get('/detailed', getDetailedSearch);

export default router;