// backend/api/endPoint.ts
import express from 'express';
import type { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Middleware pour parser le JSON
router.use(express.json());

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

export default router;