// backend/api/endPoint.ts
import express from 'express';
import type { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import mangaRoutes from './mangaRoutes'
import animeRoutes from './animeRoutes'

const router: Router = express.Router();
const prisma = new PrismaClient();

// Middleware pour parser le JSON
router.use(express.json());

// Utiliser les routes de manga
router.use('/', mangaRoutes);
router.use('/', animeRoutes);

// AJOUT DE LA ROUTE MANQUANTE - Mettre à jour un manga via la licence
router.put('/license/:licenseId/manga/:mangaId', async (req: Request, res: Response): Promise<void> => {
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
      res.status(404).json({ error: 'Manga non trouvé' });
      return;
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
    return;
  } catch (error:any) {
    console.error('Erreur lors de la mise à jour du manga:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
    return;
  }
});

// GET - Récupérer des suggestions de titres
router.get('/suggestions', async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Server error' });
    return;
  }
});

// GET - Recherche détaillée
router.get('/detailed', async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error('Error fetching detailed search results:', error);
    res.status(500).json({ error: 'Server error' });
    return;
  }
});

// GET - Récupérer toutes les licences
router.get('/getAllLicenses', async (res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error('Error fetching licenses:', error);
    res.status(500).json({ error: 'Server error' });
    return;
  }
});

// POST - Ajouter une nouvelle licence
router.post('/license', async (req: Request, res: Response): Promise<void> => {
  const { title, externalId } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  try {
    const newLicense = await prisma.license.create({
      data: {
        title,
        externalId,
      },
    });

    res.status(201).json(newLicense);
    return;
  } catch (error) {
    console.error('Error adding license:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// POST - Ajouter un nouveau manga
router.post('/manga', async (req: Request, res: Response): Promise<void> => {
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
    res.status(400).json({ error: 'LicenseId and title are required' });
    return;
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
    return;
  } catch (error) {
    console.error('Error adding manga:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// POST - Ajouter un nouvel anime
  router.post('/anime', async (req: Request, res: Response): Promise<void> => {
    const {
      licenseId,
      title,
      studio,
      adaptationType, // Ajouté car c'est un champ requis dans le schéma
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
      res.status(400).json({ error: 'LicenseId and title are required' });
      return;
    }
    
    try {
      const newAnime = await prisma.animeAdaptation.create({
        data: {
          licenseId,
          title,
          studio,
          adaptationType, // Ce champ est requis selon votre schéma
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
      return;
    } catch (error: any) {
      console.error('Error adding anime:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message
      });
      return;
    }
  });

// PUT - Mettre à jour une licence
router.put('/license/:id', async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error('Error updating license:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// DELETE - Supprimer une licence
router.delete('/license/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedLicense = await prisma.license.delete({
      where: { id },
    });

    res.json(deletedLicense);
    return;
  } catch (error) {
    console.error('Error deleting license:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Route pour la mise à jour des adaptations
router.put('/adaptation/:id', async (req: Request, res: Response): Promise<void> => {
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
        res.status(404).json({ 
          error: 'Saison non trouvée',
          requestedId: id,
          type: 'season'
        });
        return;
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
      res.json(updated);
      return;
    } 
    else if (type === 'anime') {
      // Vérifier si l'adaptation d'anime existe
      const animeExists = await prisma.animeAdaptation.findUnique({
        where: { id }
      });

      if (!animeExists) {
        console.error(`AnimeAdaptation avec ID ${id} non trouvée`);
        res.status(404).json({ 
          error: 'Adaptation non trouvée',
          requestedId: id,
          type: 'anime'
        });
        return;
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
      res.json(updated);
      return;
    }
    else {
      console.error(`Type d'adaptation inconnu: ${type}`);
      res.status(400).json({ 
        error: 'Type d\'adaptation inconnu', 
        receivedType: type 
      });
      return;
    }
  } catch (error:any) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message,
      code: error.code,
      meta: error.meta 
    });
    return;
  }
});

export default router;