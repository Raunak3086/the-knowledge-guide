import { pool } from '../services/db.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const getSummary = async (req, res) => {
    try {
        const { id } = req.params;

        // Check for summary in the database
        let docResult = await pool.query('SELECT summary, text FROM documents WHERE id = $1', [id]);

        if (docResult.rows.length === 0) {
            return res.status(404).send('Document not found.');
        }

        let summary = docResult.rows[0].summary;
        const text = docResult.rows[0].text;

        // If summary exists, return it
        if (summary) {
            return res.status(200).send({ summary });
        }

        // If summary does not exist, generate it
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
        const prompt = `Summarize the following text:\n\n${text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text();

        // Save the summary to the database
        await pool.query('UPDATE documents SET summary = $1 WHERE id = $2', [summary, id]);

        res.status(200).send({ summary });
    } catch (error) {
        console.error('Error getting summary:', error);
        res.status(500).send('Error getting summary.');
    }
};

export { getSummary };



