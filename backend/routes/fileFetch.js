import express from 'express';
import { getFileText } from '../controllers/fileFetchController.js';

const router = express.Router();

router.get('/:id', getFileText);

export default router;
