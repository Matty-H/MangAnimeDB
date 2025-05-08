//backend/api/licenses/licenseRoutes.js
import prisma from '../../prisma/client.js';

// Récupérer toutes les licences
export const getAllLicenses = async (req, res) => {
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

    // Si aucune licence n'est trouvée, renvoyer une réponse appropriée
    if (!licenses || licenses.length === 0) {
      return res.status(404).json({ error: 'No licenses found' });
    }

    res.json(licenses);
  } catch (error) {
    console.error('Error fetching licenses:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Ajouter une nouvelle licence
export const createLicense = async (req, res) => {
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
  } catch (error) {
    console.error('Error adding license:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mettre à jour une licence
export const updateLicense = async (req, res) => {
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
};

// Supprimer une licence
export const deleteLicense = async (req, res) => {
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
};