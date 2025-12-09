import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { embedText } from '../services/embedText.js';
import { pool } from '../services/db.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const extractTextFromPDF = async (buffer) => {
    const uint8Array = new Uint8Array(buffer);

    const pdf = await pdfjsLib.getDocument(uint8Array).promise;

    let textContent = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        const pageText = text.items.map((item) => item.str).join(" ");
        textContent += pageText + "\n";
    }

    return textContent;
};

const chunkText = (text, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadController = async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded.");

        const { userId } = req.body; // Extract userId from req.body

        if (!userId) {
            return res.status(400).send("User ID is required in the request body.");
        }

        // EXTRACT TEXT (pdfjs)
        const text = await extractTextFromPDF(req.file.buffer);
        const filename = req.file.originalname;

        // Save document
        const docResult = await pool.query(
            "INSERT INTO documents (filename, text, user_id) VALUES ($1, $2, $3) RETURNING id",
            [filename, text, userId]
        );

        const docId = docResult.rows[0].id;

        // Chunk + embed
        const chunks = chunkText(text, 1000);

        for (const chunk of chunks) {
            console.log(chunk);
            const embedding = await embedText(chunk);
            const formattedEmbedding = JSON.stringify(embedding);
            console.log(formattedEmbedding);

            await pool.query(
                "INSERT INTO chunks (doc_id, content, embedding, user_id) VALUES ($1, $2, $3, $4)",
                [docId, chunk, formattedEmbedding, userId]
            );
            await sleep(1000); // Wait for 1 second
        }

        res.status(200).send({ message: "File uploaded and processed successfully.", docId });
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).send("Error processing file.");
    }
};

export { upload, uploadController };
