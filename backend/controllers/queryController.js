import { pool } from '../services/db.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const askQuery = async (req, res) => {
    try {
        const { docId, question } = req.body;

        if (!docId || !question) {
            return res.status(400).send('Document ID and question are required.');
        }
        console.log(docId);
        // Retrieve document text from the database
        const docResult = await pool.query('SELECT text FROM documents WHERE id = $1', [docId]);

        if (docResult.rows.length === 0) {
            return res.status(404).send('Document not found.');
        }

        const text = docResult.rows[0].text;

        // Generate the answer using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
        const prompt = `think and answer this: "${question}"\n\nText:\n${text}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        res.status(200).send({ answer });
    } catch (error) {
        console.error('Error getting answer:', error);
        res.status(500).send('Error getting answer.');
    }
};

export { askQuery };
