// backend/api/animeRoutes.ts
import express from 'express';
import type { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Middleware pour parser le JSON
router.use(express.json());

// GET - Récupérer un anime par ID
router.get('/anime/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const anime = await prisma.animeAdaptation.findUnique({
      where: { id },
      include: {
        seasons: true,
      },
    });
    
    if (!anime) {
      res.status(404).json({ error: 'Anime non trouvé' })
      return;
    }
    
    res.json(anime);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'anime:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Mettre à jour un anime
router.put('/anime/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    licenseId, 
    title, 
    studio, 
    startDate, 
    endDate, 
    status,
    totalEpisodes,
    notes
  } = req.body;

  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  const parsedEndDate = endDate ? new Date(endDate) : undefined;

  try {
    // Vérifier si l'anime existe
    const animeExists = await prisma.animeAdaptation.findUnique({
      where: { id }
    });

    if (!animeExists) {
      return res.status(404).json({ error: 'Anime non trouvé' });
    }

    // Mise à jour de l'anime
    const updatedAnime = await prisma.animeAdaptation.update({
      where: { id },
      data: {
        licenseId,
        title,
        studio,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        status,
        totalEpisodes,
        notes
      },
      include: {
        seasons: true
      }
    });

    res.json(updatedAnime);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'anime:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
  }
});

// Modification de la route pour gérer correctement les episodes et fidelity
router.put('/anime-season/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
      // Récupération des données brutes de la requête pour débogage
      const rawData = req.body;
      console.log('Données brutes reçues:', rawData);
      
      // Extraire les champs avec une attention particulière aux champs problématiques
      const { 
        animeAdaptationId,
        seasonNumber,
        episodes,
        fidelity,
        coverageFromVolume,
        coverageToVolume,
        notes
      } = rawData;
      
      // Journaliser spécifiquement les valeurs problématiques
      console.log('Champs spécifiques:', {
        episodes: episodes,
        episodes_type: typeof episodes,
        fidelity: fidelity,
        fidelity_type: typeof fidelity
      });
  
      // Vérifier si la saison existe
      const seasonExists = await prisma.animeSeason.findUnique({
        where: { id }
      });
  
      if (!seasonExists) {
        return res.status(404).json({ error: 'Saison d\'anime non trouvée' });
      }
  
      // Préparation des données pour la mise à jour
      // Les champs problématiques sont traités explicitement
      const updateData: any = {};
      
      // Ne traiter que les champs fournis
      if (animeAdaptationId !== undefined) updateData.animeAdaptationId = animeAdaptationId;
      
      if (seasonNumber !== undefined) {
        updateData.seasonNumber = Number(seasonNumber);
      }
      
      // Traitement spécial pour episodes
      if (episodes !== undefined) {
        // Forcer la conversion en nombre
        updateData.episodes = Number(episodes);
        
        // Vérification que la conversion a réussi
        if (isNaN(updateData.episodes)) {
          return res.status(400).json({
            error: 'Valeur invalide pour episodes',
            received: episodes,
            type: typeof episodes
          });
        }
      }
      
      // Traitement spécial pour fidelity
      if (fidelity !== undefined) {
        // Vérifier que c'est une valeur d'enum valide
        const validFidelities = ['FAITHFUL', 'PARTIAL', 'ANIME_ORIGINAL'];
        
        if (!validFidelities.includes(String(fidelity))) {
          return res.status(400).json({
            error: 'Valeur de fidélité invalide',
            received: fidelity,
            validValues: validFidelities
          });
        }
        
        updateData.fidelity = String(fidelity);
      }
      
      if (coverageFromVolume !== undefined) {
        updateData.coverageFromVolume = coverageFromVolume === null || coverageFromVolume === '' 
          ? null 
          : Number(coverageFromVolume);
      }
      
      if (coverageToVolume !== undefined) {
        updateData.coverageToVolume = coverageToVolume === null || coverageToVolume === '' 
          ? null 
          : Number(coverageToVolume);
      }
      
      if (notes !== undefined) updateData.notes = notes;
      
      // Journaliser les données qui seront utilisées pour la mise à jour
      console.log('Données préparées pour update:', updateData);
  
      // Mise à jour de la saison
      const updatedSeason = await prisma.animeSeason.update({
        where: { id },
        data: updateData
      });
      
      console.log('Saison mise à jour:', updatedSeason);
      res.json(updatedSeason);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la saison:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

// DELETE - Supprimer une saison d'anime
router.delete('/anime-season/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Vérifier si la saison existe
    const seasonExists = await prisma.animeSeason.findUnique({
      where: { id }
    });

    if (!seasonExists) {
      return res.status(404).json({ error: 'Saison d\'anime non trouvée' });
    }

    // Suppression de la saison
    const deletedSeason = await prisma.animeSeason.delete({
      where: { id }
    });

    res.json(deletedSeason);
  } catch (error) {
    console.error('Erreur lors de la suppression de la saison:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
  }
});

// POST - Ajouter une nouvelle saison à un anime
router.post('/anime-season', async (req: Request, res: Response) => {
  const { 
    animeAdaptationId,
    seasonNumber,
    episodes,
    fidelity,
    coverageFromVolume,
    coverageToVolume,
    notes
  } = req.body;

  // Validation des données requises
  if (!animeAdaptationId) {
    return res.status(400).json({ error: 'Le champ animeAdaptationId est requis' });
  }

  try {
    // Vérifier si l'anime existe
    const animeExists = await prisma.animeAdaptation.findUnique({
      where: { id: animeAdaptationId }
    });

    if (!animeExists) {
      return res.status(404).json({ error: 'Anime non trouvé' });
    }

    // Création de la saison
    const newSeason = await prisma.animeSeason.create({
      data: {
        animeAdaptationId,
        seasonNumber,
        episodes,
        fidelity,
        coverageFromVolume,
        coverageToVolume,
        notes
      }
    });

    res.status(201).json(newSeason);
  } catch (error) {
    console.error('Erreur lors de la création de la saison:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
  }
});

export default router;