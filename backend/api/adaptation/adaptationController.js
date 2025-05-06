//backend/api/adaptations/adaptationController.js
import prisma from '../../prisma/client.js';

// Mettre à jour une adaptation (saison ou anime)
export const updateAdaptation = async (req, res) => {
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
    }
    else {
      console.error(`Type d'adaptation inconnu: ${type}`);
      res.status(400).json({ 
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
};