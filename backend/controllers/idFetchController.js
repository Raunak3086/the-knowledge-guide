import { pool } from '../services/db.js';

const getDocIdsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).send('User ID is required.');
        }

        const docResult = await pool.query('SELECT id, filename FROM documents WHERE user_id = $1', [userId]);

        if (docResult.rows.length === 0) {
            return res.status(200).send([]); // Return empty array if no documents
        }

        const documents = docResult.rows.map(row => ({
            id: row.id,
            name: row.filename
        }));

        res.status(200).send(documents);
    } catch (error) {
        console.error('Error getting document IDs:', error);
        res.status(500).send('Error getting document IDs.');
    }
};

export { getDocIdsByUserId };
