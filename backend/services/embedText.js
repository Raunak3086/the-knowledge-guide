
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function embedText(text) {
    try {
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004',
                        // *** Explicitly set the dimension to 1536 ***
            outputDimensionality: 1536});
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error('Error embedding text:', error);
        throw error;
    }
}

export { embedText };



