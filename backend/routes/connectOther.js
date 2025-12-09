import express from 'express';
import { loginUser } from '../services/userService.js';
import { pool } from '../services/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        const user = await loginUser({ email, password });
        console.log(user)
        const userId = user.userId;

        console.log(userId);
        const docResult = await pool.query('SELECT id, filename FROM documents WHERE user_id = $1', [userId]);

        if (docResult.rows.length === 0) {
            return res.status(404).send([]); // Return empty array if no documents
        }

        const documents = docResult.rows.map(row => ({
            id: row.id,
            name: row.filename
        }));

        res.status(200).send(documents);
    } catch (error) {
        console.error('Error connecting and fetching documents:', error);
        res.status(500).send('Error connecting and fetching documents.');
    }
});

export default router;
