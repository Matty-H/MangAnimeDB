// frontend/src/services/suggestions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const query = req.query.query as string;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters' });
    }

    // Just fetch the basic data needed for suggestions
    const licenses = await prisma.license.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' }
      },
      select: {
        id: true,
        title: true
      },
      take: 10 // Limit results for performance
    });

    // Also search anime titles
    const animeWorks = await prisma.animeWork.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' }
      },
      select: {
        id: true,
        title: true
      },
      take: 10 // Limit results for performance
    });

    // Combine and deduplicate results
    const combinedResults = [
      ...licenses.map(license => ({ id: license.id, title: license.title })),
      ...animeWorks.map(anime => ({ id: anime.id, title: anime.title }))
    ];

    // Basic deduplication by title
    const uniqueResults = combinedResults.filter((item, index, self) =>
      index === self.findIndex(t => t.title === item.title)
    );

    return res.status(200).json(uniqueResults.slice(0, 10)); // Return at most 10 suggestions
  } catch (error) {
    console.error('Search suggestions error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}