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

  public get(key: string): CacheItem | undefined {
    const item = this.cache[key];
    if (!item) return undefined;
    if (item.expiration < Date.now()) {
      delete this.cache[key];
      return undefined;
    }
    return item;
  }

  public set(key: string, value: any): void {
    const item: CacheItem = {
      id: uuidv4(),
      key,
      value,
      expiration: Date.now() + this.config.ttl * 1000,
    };
    this.cache[key] = item;
  }

  public delete(key: string): void {
    delete this.cache[key];
  }

  public clear(): void {
    this.cache = {};
  }
}

const cacheConfig: CacheConfig = {
  ttl: 60, // 1 minute
};

const cacheManager = new CacheManager(cacheConfig);

export { cacheManager };

// Example usage:
// cacheManager.set('shortUrl', 'https://example.com');
// const cachedValue = cacheManager.get('shortUrl');
// cacheManager.delete('shortUrl');
// cacheManager.clear();
```

```typescript
// src/models/CacheItem.ts
export interface CacheItem {
  id: string;
  key: string;
  value: any;
  expiration: number;
}
```

```typescript
// Update src/utils/cache.ts to use the new cache manager
// src/utils/cache.ts
import { cacheManager } from './cacheManager';

const cache = {
  get: (key: string) => cacheManager.get(key),
  set: (key: string, value: any) => cacheManager.set(key, value),
  delete: (key: string) => cacheManager.delete(key),
  clear: () => cacheManager.clear(),
};

export default cache;
```

```typescript
// Update src/routes/shortenUrlController.ts to use the cache
// src/routes/shortenUrlController.ts
import { Request, Response } from 'express';
import { cache } from '../utils/cache';
import { ShortenUrlService } from '../services/ShortenUrlService';

const shortenUrlController = {
  async shortenUrl(req: Request, res: Response) {
    const { url } = req.body;
    const cachedValue = cache.get(url);
    if (cachedValue) {
      return res.json(cachedValue);
    }
    const shortenedUrl = await ShortenUrlService.shortenUrl(url);
    cache.set(url, shortenedUrl);
    return res.json(shortenedUrl);
  },
};

export default shortenUrlController;