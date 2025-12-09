import express from 'express';
import { getDocIdsByUserId } from '../controllers/idFetchController.js';

const router = express.Router();

router.get('/:userId', getDocIdsByUserId);

export default router;
