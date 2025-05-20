// backend/api/license/licenseRoutes.js
import express from 'express';
import { authenticatedUser, checkRole } from '../../middleware/auth.middleware.js';
import * as licenseController from './licenseController.js';

const router = express.Router();

// Routes publiques
router.get('/', licenseController.getAllLicenses);

// Routes protégées
router.post('/', authenticatedUser, checkRole('admin'), licenseController.createLicense);
router.put('/:id', authenticatedUser, checkRole('admin'), licenseController.updateLicense);
router.delete('/:id', authenticatedUser, checkRole('admin'), licenseController.deleteLicense);

export default router;