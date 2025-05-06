//backend/api/licenses/licenseRoutes.js
import express from 'express';
import { 
  getAllLicenses, 
  createLicense, 
  updateLicense, 
  deleteLicense 
} from './licenseController.js';

const router = express.Router();

// GET - Récupérer toutes les licences
router.get('/', getAllLicenses);

// POST - Ajouter une nouvelle licence
router.post('/', createLicense);

// PUT - Mettre à jour une licence
router.put('/:id', updateLicense);

// DELETE - Supprimer une licence
router.delete('/:id', deleteLicense);

export default router;