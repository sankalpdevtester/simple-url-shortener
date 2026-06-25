import express, { Request, Response } from 'express';
import { urlService } from '../services/UrlService';

const router = express.Router();

router.get('/analytics/:shortUrl', async (req: Request, res: Response) => {
  const shortUrl = req.params.shortUrl;
  const analytics = await urlService.getUrlAnalytics(shortUrl);
  res.json(analytics);
});

router.post('/analytics/:shortUrl/click', async (req: Request, res: Response) => {
  const shortUrl = req.params.shortUrl;
  await urlService.incrementUrlClicks(shortUrl);
  res.status(204).send();
});

export default router;