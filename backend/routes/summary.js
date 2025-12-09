import express from 'express';
import { getSummary } from '../controllers/summaryController.js';

const router = express.Router();

router.get('/:id', getSummary);

export default router;
