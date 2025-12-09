import { pool } from '../services/db.js';

const getFileText = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve document text from the database
        const docResult = await pool.query('SELECT text FROM documents WHERE id = $1', [id]);

        if (docResult.rows.length === 0) {
            return res.status(404).send('Document not found.');
        }

        const text = docResult.rows[0].text;

        res.status(200).send({ text });
    } catch (error) {
        console.error('Error getting document text:', error);
        res.status(500).send('Error getting document text.');
    }
};

export { getFileText };
