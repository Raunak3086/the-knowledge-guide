import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function getEmbedding(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "embedding-001"});
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error('Error getting embedding:', error);
        throw error;
    }
}

export { getEmbedding };



