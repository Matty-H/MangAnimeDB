// backend/api/endPoint.ts
import express from 'express';
import type { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import mangaRoutes from './mangaRoutes.ts'
import animeRoutes from './animeRoutes.ts'

const router: Router = express.Router();
const prisma = new PrismaClient();

// Middleware pour parser le JSON
router.use(express.json());

// Utiliser les routes de manga
router.use('/', mangaRoutes);
router.use('/', animeRoutes);

// AJOUT DE LA ROUTE MANQUANTE - Mettre à jour un manga via la licence
router.put('/license/:licenseId/manga/:mangaId', async (req: Request, res: Response) => {
  const { mangaId } = req.params;
  const { 
    licenseId, 
    title, 
    authors, 
    volumes, 
    status, 
    startDate, 
    endDate, 
    publisher 
  } = req.body;

  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  const parsedEndDate = endDate ? new Date(endDate) : undefined;

  try {
    // Vérifier si le manga existe
    const mangaExists = await prisma.mangaWork.findUnique({
      where: { id: mangaId }
    });

    if (!mangaExists) {
      return res.status(404).json({ error: 'Manga non trouvé' });
    }

    // Mise à jour du manga
    const updatedManga = await prisma.mangaWork.update({
      where: { id: mangaId },
      data: {
        licenseId,
        title,
        authors,
        volumes,
        status,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        publisher
      },
      include: {
        parts: true
      }
    });

    res.json(updatedManga);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du manga:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
  }
});

// GET - Récupérer des suggestions de titres
router.get('/suggestions', async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter' });
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
});

// GET - Recherche détaillée
router.get('/detailed', async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter' });
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
});

// GET - Récupérer toutes les licences
router.get('/getAllLicenses', async (req: Request, res: Response) => {
  try {
    const licenses = await prisma.license.findMany({
      select: {
        id: true,
        title: true
      },
      orderBy: {
        title: 'asc'
      }
    });
    
    res.json(licenses);
  } catch (error) {
    console.error('Error fetching licenses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST - Ajouter une nouvelle licence
router.post('/license', async (req: Request, res: Response) => {
  const { title, externalId } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const newLicense = await prisma.license.create({
      data: {
        title,
        externalId,
      },
    });

    res.status(201).json(newLicense);
  } catch (error) {
    console.error('Error adding license:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Ajouter un nouveau manga
router.post('/manga', async (req: Request, res: Response) => {
  const { 
    licenseId, 
    title, 
    authors, 
    volumes, 
    status, 
    startDate, 
    endDate, 
    publisher, 
    externalId 
  } = req.body;

  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  const parsedEndDate = endDate ? new Date(endDate) : undefined;

  if (!licenseId || !title) {
    return res.status(400).json({ error: 'LicenseId and title are required' });
  }

  try {
    const newManga = await prisma.mangaWork.create({
      data: {
        license: { connect: { id: licenseId } },
        title,
        authors,
        volumes,
        status,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        publisher,
        externalId
      },
    });

    res.status(201).json(newManga);
  } catch (error) {
    console.error('Error adding manga:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Ajouter un nouvel anime
router.post('/anime', async (req: Request, res: Response) => {
  const { 
    licenseId, 
    title, 
    studio, 
    episodes, 
    status, 
    fidelity, 
    relationType, 
    startDate, 
    endDate, 
    notes, 
    externalId 
  } = req.body;

  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  const parsedEndDate = endDate ? new Date(endDate) : undefined;

  if (!licenseId || !title) {
    return res.status(400).json({ error: 'LicenseId and title are required' });
  }

  try {
    const newAnime = await prisma.animeWork.create({
      data: {
        license: { connect: { id: licenseId } },
        title,
        studio,
        episodes,
        status,
        fidelity,
        relationType,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        notes,
        externalId
      },
    });

    res.status(201).json(newAnime);
  } catch (error) {
    console.error('Error adding anime:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Mettre à jour une licence
router.put('/license/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, externalId } = req.body;

  try {
    const updatedLicense = await prisma.license.update({
      where: { id },
      data: {
        title,
        externalId
      },
    });

    res.json(updatedLicense);
  } catch (error) {
    console.error('Error updating license:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE - Supprimer une licence
router.delete('/license/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedLicense = await prisma.license.delete({
      where: { id },
    });

    res.json(deletedLicense);
  } catch (error) {
    console.error('Error deleting license:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route pour la mise à jour des adaptations
router.put('/adaptation/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { episodes, fromVolume, toVolume, type } = req.body;
  
  // Journalisation pour débogage
  console.log(`Mise à jour de l'adaptation ID: ${id}, Type: ${type}`);
  console.log(`Données reçues:`, { episodes, fromVolume, toVolume });

  try {
    // Selon le type envoyé par le frontend
    if (type === 'season') {
      // Vérifier d'abord si l'ID existe
      const seasonExists = await prisma.animeSeason.findUnique({
        where: { id }
      });

      if (!seasonExists) {
        console.error(`AnimeSeason avec ID ${id} non trouvée`);
        return res.status(404).json({ 
          error: 'Saison non trouvée',
          requestedId: id,
          type: 'season'
        });
      }

      // Mettre à jour la saison
      const updated = await prisma.animeSeason.update({
        where: { id },
        data: {
          episodes: episodes !== null && episodes !== undefined ? Number(episodes) : undefined,
          coverageFromVolume: fromVolume !== null && fromVolume !== undefined ? Number(fromVolume) : null,
          coverageToVolume: toVolume !== null && toVolume !== undefined ? Number(toVolume) : null
        }
      });
      
      console.log(`Saison mise à jour avec succès:`, updated);
      return res.json(updated);
    } 
    else if (type === 'anime') {
      // Vérifier si l'adaptation d'anime existe
      const animeExists = await prisma.animeAdaptation.findUnique({
        where: { id }
      });

      if (!animeExists) {
        console.error(`AnimeAdaptation avec ID ${id} non trouvée`);
        return res.status(404).json({ 
          error: 'Adaptation non trouvée',
          requestedId: id,
          type: 'anime'
        });
      }

      // Mettre à jour l'adaptation d'anime
      const updated = await prisma.animeAdaptation.update({
        where: { id },
        data: {
          episodes: episodes !== null && episodes !== undefined ? Number(episodes) : undefined
        }
      });

      // Mettre à jour les relations manga-anime pour les volumes si nécessaire
      if ((fromVolume !== null && fromVolume !== undefined) || 
          (toVolume !== null && toVolume !== undefined)) {
        
        // Trouver toutes les relations pour cette adaptation
        const relations = await prisma.mangaToAnime.findMany({
          where: { animeAdaptationId: id }
        });

        // S'il y a des relations, mettre à jour la première
        if (relations.length > 0) {
          const relationId = relations[0].id;
          
          const updatedRelation = await prisma.mangaToAnime.update({
            where: { id: relationId },
            data: {
              coverageFromVolume: fromVolume !== null && fromVolume !== undefined ? Number(fromVolume) : undefined,
              coverageToVolume: toVolume !== null && toVolume !== undefined ? Number(toVolume) : undefined
            }
          });
          
          console.log(`Relation manga-anime mise à jour:`, updatedRelation);
        } else {
          console.log(`Aucune relation manga-anime trouvée pour l'adaptation ${id}`);
        }
      }

      console.log(`Adaptation mise à jour avec succès:`, updated);
      return res.json(updated);
    }
    else {
      console.error(`Type d'adaptation inconnu: ${type}`);
      return res.status(400).json({ 
        error: 'Type d\'adaptation inconnu', 
        receivedType: type 
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message,
      code: error.code,
      meta: error.meta 
    });
  }
});

export default router;