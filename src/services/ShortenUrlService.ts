import { Pool } from 'pg';
import { Url } from '../models/Url';
import { UrlService } from './UrlService';

interface ShortenUrlOptions {
  originalUrl: string;
  userId: number;
}

class ShortenUrlService {
  private dbPool: Pool;
  private urlService: UrlService;

  constructor(dbPool: Pool, urlService: UrlService) {
    this.dbPool = dbPool;
    this.urlService = urlService;
  }

  async shortenUrl(options: ShortenUrlOptions): Promise<Url> {
    const { originalUrl, userId } = options;
    const shortenedUrl = await this.generateShortUrl();
    const url = new Url({
      originalUrl,
      shortenedUrl,
      userId,
    });

    try {
      await this.urlService.createUrl(url);
      return url;
    } catch (error) {
      throw new Error(`Failed to shorten URL: ${error.message}`);
    }
  }

  private async generateShortUrl(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortenedUrl = '';
    for (let i = 0; i < 6; i++) {
      shortenedUrl += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return shortenedUrl;
  }
}

export { ShortenUrlService };