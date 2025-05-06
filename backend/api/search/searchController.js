//backend/api/search/searchController.js
import prisma from '../../prisma/client.js';

// Récupérer des suggestions de titres
export const getSuggestions = async (req, res) => {
  const { query } = req.query;
  
  if (typeof query !== 'string') {
    res.status(400).json({ error: 'Missing or invalid query parameter' });
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
    res.status(500).json({ error: 'Server error' });
  }
};

// Recherche détaillée
export const getDetailedSearch = async (req, res) => {
  const { query } = req.query;
  
  if (typeof query !== 'string') {
    res.status(400).json({ error: 'Missing or invalid query parameter' });
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
            parts: true,
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
    res.status(500).json({ error: 'Server error' });
  }
};