// src/utils/cacheManager.ts
import { v4 as uuidv4 } from 'uuid';
import { CacheItem } from '../models/CacheItem';

interface CacheConfig {
  ttl: number; // time to live in seconds
}

class CacheManager {
  private cache: { [key: string]: CacheItem };
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.cache = {};
    this.config = config;
  }

  public get(key: string): any {
    const item = this.cache[key];
    if (!item) return null;
    if (item.expiration < Date.now()) {
      delete this.cache[key];
      return null;
    }
    return item.value;
  }

  public set(key: string, value: any): void {
    const expiration = Date.now() + this.config.ttl * 1000;
    this.cache[key] = { value, expiration, id: uuidv4() };
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
