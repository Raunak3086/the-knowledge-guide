import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.PGVECTOR_DATABASE_URL,
});

export const connectDB = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('DB connected');

    // Create the vector extension if it doesn't exist
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');

    // Check installed extensions
    const res = await client.query("SELECT extname FROM pg_extension;");
    console.log("Installed extensions:", res.rows.map(row => row.extname));

  } catch (error) {
    console.error('DB connection error:', error.stack);
  } finally {
    if (client) {
      client.release();
    }
  }
};

connectDB();
