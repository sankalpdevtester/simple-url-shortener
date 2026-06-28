// src/utils/cache.ts
import { v4 as uuidv4 } from 'uuid';
import { Url } from '../models/Url';

interface CacheItem {
  id: string;
  url: string;
  expiresAt: number;
}

class Cache {
  private cache: { [key: string]: CacheItem } = {};
  private ttl: number;

  constructor(ttl: number) {
    this.ttl = ttl;
  }

  get(id: string): CacheItem | undefined {
    const item = this.cache[id];
    if (item && item.expiresAt > Date.now()) {
      return item;
    }
    delete this.cache[id];
    return undefined;
  }

  set(id: string, url: string): void {
    const expiresAt = Date.now() + this.ttl;
    this.cache[id] = { id, url, expiresAt };
  }

  delete(id: string): void {
    delete this.cache[id];
  }

  clear(): void {
    this.cache = {};
  }
}

const cache = new Cache(60 * 1000); // 1 minute TTL

export function getCache(): Cache {
  return cache;
}

export function cacheUrl(id: string, url: string): void {
  cache.set(id, url);
}

export function getUrlFromCache(id: string): string | undefined {
  const item = cache.get(id);
  return item ? item.url : undefined;
}

export function deleteUrlFromCache(id: string): void {
  cache.delete(id);
}

// Example usage:
// const cache = getCache();
// cacheUrl('123', 'https://example.com');
// const cachedUrl = getUrlFromCache('123');
// console.log(cachedUrl); // https://example.com
// deleteUrlFromCache('123');
// const cachedUrlAfterDeletion = getUrlFromCache('123');
// console.log(cachedUrlAfterDeletion); // undefined
```
In the `src/routes/shortenUrl.ts` file, you can use the cache like this:
```typescript
import express, { Request, Response } from 'express';
import { getCache, cacheUrl, getUrlFromCache, deleteUrlFromCache } from '../utils/cache';
import { UrlService } from '../services/UrlService';

const router = express.Router();
const cache = getCache();

router.post('/shorten', async (req: Request, res: Response) => {
  const { url } = req.body;
  const cachedUrl = getUrlFromCache(url);
  if (cachedUrl) {
    return res.json({ shortenedUrl: cachedUrl });
  }

  const shortenedUrl = await UrlService.shortenUrl(url);
  cacheUrl(shortenedUrl.id, shortenedUrl.url);
  res.json({ shortenedUrl: shortenedUrl.url });
});

router.delete('/shorten/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  deleteUrlFromCache(id);
  await UrlService.deleteUrl(id);
  res.status(204).send();
});
```
In the `src/components/ShortenUrl.tsx` file, you can use the cache like this:
```typescript
import React, { useState } from 'react';
import { getCache, cacheUrl, getUrlFromCache, deleteUrlFromCache } from '../utils/cache';
import { UrlService } from '../services/UrlService';

const ShortenUrl = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const cache = getCache();

  const handleShortenUrl = async () => {
    const cachedUrl = getUrlFromCache(url);
    if (cachedUrl) {
      setShortenedUrl(cachedUrl);
      return;
    }

    const shortenedUrl = await UrlService.shortenUrl(url);
    cacheUrl(shortenedUrl.id, shortenedUrl.url);
    setShortenedUrl(shortenedUrl.url);
  };

  const handleDeleteUrl = async () => {
    deleteUrlFromCache(url);
    await UrlService.deleteUrl(url);
  };

  return (
    <div>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={handleShortenUrl}>Shorten URL</button>
      <button onClick={handleDeleteUrl}>Delete URL</button>
      {shortenedUrl && <p>Shortened URL: {shortenedUrl}</p>}
    </div>
  );
};

export default ShortenUrl;