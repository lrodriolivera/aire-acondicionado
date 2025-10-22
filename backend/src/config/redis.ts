import { createClient } from 'redis';
import config from './index';
import logger from '../utils/logger';

class RedisClient {
  private client: ReturnType<typeof createClient>;
  private static instance: RedisClient;
  private isConnected: boolean = false;

  private constructor() {
    this.client = createClient({
      url: config.redis.url
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      logger.error('Redis client error:', err);
      this.isConnected = false;
    });

    this.client.on('disconnect', () => {
      logger.warn('Redis client disconnected');
      this.isConnected = false;
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async set(key: string, value: string, expiresIn?: number): Promise<void> {
    if (expiresIn) {
      await this.client.setEx(key, expiresIn, value);
    } else {
      await this.client.set(key, value);
    }
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  public async setJson(key: string, value: any, expiresIn?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), expiresIn);
  }

  public async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    return value ? JSON.parse(value) : null;
  }

  public async close(): Promise<void> {
    await this.client.quit();
    logger.info('Redis client closed');
  }
}

export default RedisClient.getInstance();
