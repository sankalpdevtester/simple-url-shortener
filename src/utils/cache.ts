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
