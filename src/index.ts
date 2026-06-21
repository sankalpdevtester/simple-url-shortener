import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use(express.json());

app.get('/api/shorten', async (req: Request, res: Response) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).send({ message: 'URL is required' });
    }
    const shortenedUrl = await shortenUrl(url as string);
    return res.send({ shortenedUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/api/redirect/:shortUrl', async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;
    const originalUrl = await getOriginalUrl(shortUrl);
    if (!originalUrl) {
      return res.status(404).send({ message: 'URL not found' });
    }
    return res.redirect(originalUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

async function shortenUrl(url: string) {
  const result = await pool.query('INSERT INTO urls (original_url) VALUES ($1) RETURNING *', [url]);
  return `http://localhost:3000/${result.rows[0].id}`;
}

async function getOriginalUrl(shortUrl: string) {
  const id = shortUrl.split('/').pop();
  const result = await pool.query('SELECT original_url FROM urls WHERE id = $1', [id]);
  return result.rows[0]?.original_url;
}