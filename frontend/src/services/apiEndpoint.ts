// pages/api/search/detailed.ts (or equivalent in your API structure)
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

    // Search for manga_anime items that match the query
    const results = await prisma.manga_anime.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { 
            animeAdaptations: {
              some: {
                title: { contains: query, mode: 'insensitive' }
              }
            }
          }
        ],
      },
      include: {
        manga: {
          include: {
            authors: true,
          },
        },
        animeAdaptations: {
          include: {
            coverages: true,
            divergencePoints: true,
          },
        },
      },
    });

    // Transform the data to match the expected MangaAnimeItem structure
    const formattedResults = results.map(item => ({
      id: item.id,
      title: item.title,
      manga: item.manga ? {
        id: item.manga.id,
        volumes: item.manga.volumes,
        status: item.manga.status,
        startDate: item.manga.startDate,
        endDate: item.manga.endDate,
        publisher: item.manga.publisher,
        authors: item.manga.authors.map(author => ({
          id: author.id,
          name: author.name,
        })),
      } : null,
      anime_adaptations: item.animeAdaptations.map(adaptation => ({
        id: adaptation.id,
        title: adaptation.title,
        studio: adaptation.studio,
        episodes: adaptation.episodes,
        startDate: adaptation.startDate,
        endDate: adaptation.endDate,
        status: adaptation.status || '',
        fidelity: adaptation.fidelity || '',
        notes: adaptation.notes || '',
        relationType: adaptation.relationType || '',
        relatedTo: adaptation.relatedTo,
        coverages: adaptation.coverages.map(coverage => ({
          id: coverage.id,
          volumeStart: coverage.volumeStart,
          volumeEnd: coverage.volumeEnd,
        })),
        divergencePoints: adaptation.divergencePoints.map(point => ({
          id: point.id,
          mangaVolume: point.mangaVolume,
          description: point.description,
        })),
      })),
    }));

    return res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}