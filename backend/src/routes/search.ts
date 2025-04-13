// backend/src/routes/search.ts
import express from 'express';
import type { Router, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma = new PrismaClient();

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
        take: 9,
      });
  
      res.json(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).send('Server error');
    }
  };

router.get('/suggestions', getSuggestions);

export default router;