// src/utils/cacheManager.ts
import { v4 as uuidv4 } from 'uuid';
import { CacheItem } from '../models/CacheItem';

interface CacheConfig {
  ttl: number; // time to live in seconds
}

class CacheManager {
  private cache: { [key: string]: CacheItem } = {};
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  public getCacheKey(url: string): string {
    return `url:${url}`;
  }

  public async get(url: string): Promise<string | null> {
    const cacheKey = this.getCacheKey(url);
    if (this.cache[cacheKey]) {
      const cacheItem = this.cache[cacheKey];
      if (cacheItem.expiration > Date.now()) {
        return cacheItem.value;
      } else {
        delete this.cache[cacheKey];
      }
    }
    return null;
  }

  public async set(url: string, value: string): Promise<void> {
    const cacheKey = this.getCacheKey(url);
    const expiration = Date.now() + this.config.ttl * 1000;
    this.cache[cacheKey] = {
      value,
      expiration,
      id: uuidv4(),
    };
  }

  public async delete(url: string): Promise<void> {
    const cacheKey = this.getCacheKey(url);
    delete this.cache[cacheKey];
  }

  public async clear(): Promise<void> {
    this.cache = {};
  }
}

const cacheConfig: CacheConfig = {
  ttl: 3600, // 1 hour
};

const cacheManager = new CacheManager(cacheConfig);

export { cacheManager };
``}

```typescript
// src/models/CacheItem.ts
interface CacheItem {
  value: string;
  expiration: number;
  id: string;
}

export { CacheItem };
``}

```typescript
// src/routes/shortenUrlController.ts (update to use cacheManager)
import { Request, Response } from 'express';
import { cacheManager } from '../utils/cacheManager';
import { UrlService } from '../services/UrlService';

const shortenUrlController = async (req: Request, res: Response) => {
  const { url } = req.body;
  const cachedUrl = await cacheManager.get(url);
  if (cachedUrl) {
    return res.json({ shortenedUrl: cachedUrl });
  }

  const shortenedUrl = await UrlService.shortenUrl(url);
  await cacheManager.set(url, shortenedUrl);
  return res.json({ shortenedUrl });
};

export { shortenUrlController };
``}