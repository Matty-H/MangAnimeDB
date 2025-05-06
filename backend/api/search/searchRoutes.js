//backend/api/search/searchRoutes.js
import express from 'express';
import { getSuggestions, getDetailedSearch } from './searchController.js';

const router = express.Router();

// GET - Récupérer des suggestions de titres
router.get('/suggestions', getSuggestions);

// GET - Recherche détaillée
router.get('/detailed', getDetailedSearch);

export default router;