import express, { Request, Response } from 'express';
import { ShortenUrlService } from '../services/ShortenUrlService';
import { UrlService } from '../services/UrlService';
import { dbPool } from '../db';

const shortenUrlRouter = express.Router();
const shortenUrlService = new ShortenUrlService(dbPool, new UrlService(dbPool));

shortenUrlRouter.post('/shorten', async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user?.id;
    if (!originalUrl || !userId) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const shortenedUrl = await shortenUrlService.shortenUrl({ originalUrl, userId });
    return res.json({ shortenedUrl: shortenedUrl.shortenedUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

export { shortenUrlRouter };