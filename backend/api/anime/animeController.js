//
import prisma from '../../prisma/client.js';

// Ajouter un nouvel anime
export const createAnime = async (req, res) => {
  const {
    licenseId,
    title,
    studio,
    adaptationType,
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
        adaptationType,
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
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

// Récupérer un anime par ID
export const getAnimeById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const anime = await prisma.animeAdaptation.findUnique({
      where: { id },
      include: {
        seasons: true,
      },
    });
    
    if (!anime) {
      res.status(404).json({ error: 'Anime non trouvé' });
      return;
    }
    
    res.json(anime);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'anime:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour un anime
export const updateAnime = async (req, res) => {
  const { id } = req.params;
  const {
    licenseId,
    title,
    studio,
    adaptationType,
    episodes,
    status,
    fidelity,
    relationType,
    startDate,
    endDate,
    notes,
    duration
  } = req.body;
  
  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  const parsedEndDate = endDate ? new Date(endDate) : undefined;
  
  try {
    // Vérifier si l'anime existe
    const animeExists = await prisma.animeAdaptation.findUnique({
      where: { id }
    });
    
    if (!animeExists) {
      res.status(404).json({ error: 'Anime non trouvé' });
      return;
    }
    
    // Construction de l'objet data avec seulement les champs fournis
    const updateData = {};
    if (licenseId !== undefined) updateData.licenseId = licenseId;
    if (title !== undefined) updateData.title = title;
    if (studio !== undefined) updateData.studio = studio;
    if (adaptationType !== undefined) updateData.adaptationType = adaptationType;
    if (episodes !== undefined) updateData.episodes = episodes;
    if (status !== undefined) updateData.status = status;
    if (fidelity !== undefined) updateData.fidelity = fidelity;
    if (relationType !== undefined) updateData.relationType = relationType;
    if (parsedStartDate !== undefined) updateData.startDate = parsedStartDate;
    if (parsedEndDate !== undefined) updateData.endDate = parsedEndDate;
    if (notes !== undefined) updateData.notes = notes;
    if (duration !== undefined) updateData.duration = duration;
    
    // Mise à jour de l'anime
    const updatedAnime = await prisma.animeAdaptation.update({
      where: { id },
      data: updateData,
      include: {
        seasons: true
      }
    });
    
    res.json(updatedAnime);
    return;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'anime:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      details: error.message
    });
    return;
  }
};

// Supprimer un anime
export const deleteAnime = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si l'anime existe
    const animeExists = await prisma.animeAdaptation.findUnique({
      where: { id },
      include: { seasons: true }
    });

    if (!animeExists) {
      res.status(404).json({ error: 'Anime non trouvé' });
      return;
    }

    // Supprimer d'abord toutes les saisons associées
    if (animeExists.seasons.length > 0) {
      await prisma.animeSeason.deleteMany({
        where: { animeAdaptationId: id }
      });
    }

    // Supprimer l'anime
    const deletedAnime = await prisma.animeAdaptation.delete({
      where: { id }
    });

    res.json(deletedAnime);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'anime:', error);
    res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
  }
};

// Mettre à jour une saison d'anime
export const updateAnimeSeason = async (req, res) => {
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
      res.status(404).json({ error: 'Saison d\'anime non trouvée' });
      return;
    }

    // Préparation des données pour la mise à jour
    // Les champs problématiques sont traités explicitement
    const updateData = {};
    
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
        res.status(400).json({
          error: 'Valeur invalide pour episodes',
          received: episodes,
          type: typeof episodes
        });
        return;
      }
    }
    
    // Traitement spécial pour fidelity
    if (fidelity !== undefined) {
      // Vérifier que c'est une valeur d'enum valide
      const validFidelities = ['FAITHFUL', 'PARTIAL', 'ANIME_ORIGINAL'];
      
      if (!validFidelities.includes(String(fidelity))) {
        res.status(400).json({
          error: 'Valeur de fidélité invalide',
          received: fidelity,
          validValues: validFidelities
        });
        return;
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
};

// Supprimer une saison d'anime
export const deleteAnimeSeason = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si la saison existe
    const seasonExists = await prisma.animeSeason.findUnique({
      where: { id }
    });

    if (!seasonExists) {
      res.status(404).json({ error: 'Saison d\'anime non trouvée' });
      return;
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
};

// Ajouter une nouvelle saison à un anime
export const createAnimeSeason = async (req, res) => {
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
    res.status(400).json({ error: 'Le champ animeAdaptationId est requis' });
    return;
  }

  try {
    // Vérifier si l'anime existe
    const animeExists = await prisma.animeAdaptation.findUnique({
      where: { id: animeAdaptationId }
    });

    if (!animeExists) {
      res.status(404).json({ error: 'Anime non trouvé' });
      return;
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
};