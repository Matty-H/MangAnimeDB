// backend/api/license/licenseRoutes.js
import express from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.js';
import * as licenseController from './licenseController.js';

const router = express.Router();

// Routes publiques
router.get('/', licenseController.getAllLicenses);

// Routes protégées
router.post('/', isAuthenticated, licenseController.createLicense);
router.put('/:id', isAuthenticated, licenseController.updateLicense);
router.delete('/:id', isAuthenticated, licenseController.deleteLicense);

export default router;