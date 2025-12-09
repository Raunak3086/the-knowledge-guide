import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload.js';
import summaryRouter from './routes/summary.js';
import { connectDB } from './services/db.js';
import { connectMongo } from './services/mongo.js';
import authRouter from './routes/auth.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import queryRouter from './routes/query.js';
import fileFetchRouter from './routes/fileFetch.js';

import idFetchRouter from './routes/idFetch.js';
import connectOtherRouter from './routes/connectOther.js';

// Added — authentication
app.use('/api/auth', authRouter);

app.use('/api/upload', uploadRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/query', queryRouter);
app.use('/api/file', fileFetchRouter);
app.use('/api/docs/connect', connectOtherRouter);
app.use('/api/docs', idFetchRouter);

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    connectDB();      // Neon
    connectMongo();   // MongoDB (Users)
});

