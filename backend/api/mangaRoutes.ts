// backend/api/mangaRoutes.ts
import express from 'express';
import type { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Middleware pour parser le JSON
router.use(express.json());

// GET - Récupérer un manga par ID
router.get('/manga/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const manga = await prisma.mangaWork.findUnique({
      where: { id },
      include: {
        parts: true,
      },
    });
    
    if (!manga) {
      res.status(404).json({ error: 'Manga non trouvé' });
      return;
    }
    
    res.json(manga);
    return;
  } catch (error) {
    console.error('Erreur lors de la récupération du manga:', error);
    res.status(500).json({ error: 'Erreur serveur' });
    return;
  }
});

// PUT - Mettre à jour un manga
router.put('/manga/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
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
      where: { id }
    });

    if (!mangaExists) {
      res.status(404).json({ error: 'Manga non trouvé' });
      return;
    }

    // Mise à jour du manga
    const updatedManga = await prisma.mangaWork.update({
      where: { id },
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

// PUT - Mettre à jour une partie de manga
router.put('/manga-part/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { 
    mangaId,
    licenseId,
    title, 
    partNumber,
    volumes,
    startVolume,
    endVolume,
    status
  } = req.body;

  try {
    // Vérifier si la partie existe
    const partExists = await prisma.mangaPart.findUnique({
      where: { id }
    });

    if (!partExists) {
      res.status(404).json({ error: 'Partie de manga non trouvée' });
      return;
    }

    // Calculer le nombre de volumes si on a modifié les bornes
    const calculatedVolumes = (endVolume && startVolume) 
      ? endVolume - startVolume + 1 
      : volumes || partExists.volumes;

    // Mise à jour de la partie
    const updatedPart = await prisma.mangaPart.update({
      where: { id },
      data: {
        mangaId,
        licenseId,
        title,
        partNumber: partNumber || partExists.partNumber,
        volumes: calculatedVolumes,
        startVolume: startVolume || partExists.startVolume,
        endVolume: endVolume || partExists.endVolume,
        status
      }
    });

    res.json(updatedPart);
    return;
  } catch (error:any) {
    console.error('Erreur lors de la mise à jour de la partie:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
    return;
  }
});

// DELETE - Supprimer une partie de manga
router.delete('/manga-part/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Vérifier si la partie existe
    const partExists = await prisma.mangaPart.findUnique({
      where: { id }
    });

    if (!partExists) {
      res.status(404).json({ error: 'Partie de manga non trouvée' });
      return;
    }

    // Suppression de la partie
    const deletedPart = await prisma.mangaPart.delete({
      where: { id }
    });

    res.json(deletedPart);
    return;
  } catch (error:any) {
    console.error('Erreur lors de la suppression de la partie:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
    return;
  }
});

// POST - Ajouter une nouvelle partie à un manga
router.post('/manga-part', async (req: Request, res: Response): Promise<void> => {
  const { 
    mangaId,
    licenseId,
    title, 
    partNumber,
    startVolume,
    endVolume,
    status
  } = req.body;

  // Validation des données requises
  if (!mangaId || !licenseId || !title) {
    res.status(400).json({ error: 'Les champs mangaId, licenseId et title sont requis' });
    return;
  }

  try {
    // Calcul du nombre de volumes
    const volumes = endVolume - startVolume + 1;

    // Création de la partie
    const newPart = await prisma.mangaPart.create({
      data: {
        mangaId,
        licenseId,
        title,
        partNumber,
        volumes,
        startVolume,
        endVolume,
        status
      }
    });

    res.status(201).json(newPart);
    return;
  } catch (error:any) {
    console.error('Erreur lors de la création de la partie:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
    return;
  }
});

export default router;