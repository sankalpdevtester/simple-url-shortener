import { Pool } from 'pg';
import { Url } from '../models/Url';
import { db } from '../db';

interface UrlAnalytics {
  clicks: number;
  lastClicked: Date | null;
}

class UrlService {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async shortenUrl(originalUrl: string, userId: number): Promise<Url> {
    const shortenedUrl = this.generateShortUrl();
    const url = new Url(shortenedUrl, originalUrl, userId);
    await this.db.query('INSERT INTO urls (short_url, original_url, user_id) VALUES ($1, $2, $3)', [url.shortUrl, url.originalUrl, url.userId]);
    return url;
  }

  async getUrlAnalytics(shortUrl: string): Promise<UrlAnalytics> {
    const result = await this.db.query('SELECT clicks, last_clicked FROM url_analytics WHERE short_url = $1', [shortUrl]);
    if (result.rows.length === 0) {
      return { clicks: 0, lastClicked: null };
    }
    return { clicks: result.rows[0].clicks, lastClicked: result.rows[0].last_clicked };
  }

  async incrementUrlClicks(shortUrl: string): Promise<void> {
    await this.db.query('UPDATE url_analytics SET clicks = clicks + 1, last_clicked = NOW() WHERE short_url = $1', [shortUrl]);
  }

  private generateShortUrl(): string {
    // Simple short URL generation for demonstration purposes
    return Math.random().toString(36).substr(2, 6);
  }
}

export const urlService = new UrlService(db);