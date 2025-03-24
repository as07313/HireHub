import { createClient, RedisClientType } from 'redis';
import { logError, logInfo } from './logger';

class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType | null = null;
  private isConnecting: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async connect(): Promise<void> {
    if (this.client?.isReady) return;

    // Prevent multiple connection attempts
    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;

    this.connectionPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        logInfo(`Connecting to Redis at ${redisUrl}`);

        this.client = createClient({ url: redisUrl });

        // Set up event listeners
        this.client.on('error', (err) => {
          logError('Redis client error', err);
          this.reconnect();
        });

        this.client.on('connect', () => {
          logInfo('Redis client connected');
        });

        this.client.on('ready', () => {
          logInfo('Redis client ready');
        });

        this.client.on('end', () => {
          logInfo('Redis client connection closed');
        });

        await this.client.connect();
        
        this.isConnecting = false;
        resolve();
      } catch (error) {
        this.isConnecting = false;
        this.client = null;
        logError('Failed to connect to Redis', error);
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  private async reconnect(): Promise<void> {
    if (this.isConnecting) return;
    
    this.isConnecting = true;
    logInfo('Attempting to reconnect to Redis');
    
    try {
      if (this.client) {
        try {
          if (this.client.isOpen) {
            await this.client.disconnect();
          }
        } catch (err) {
          // Ignore disconnect errors
        }
        this.client = null;
      }
      
      setTimeout(async () => {
        this.isConnecting = false;
        await this.connect();
      }, 5000);
    } catch (error) {
      this.isConnecting = false;
      logError('Error during Redis reconnection', error);
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      if (!this.client?.isReady) await this.connect();
      return await this.client!.get(key);
    } catch (error) {
      logError(`Error getting key ${key} from Redis`, error);
      throw error;
    }
  }

  public async set(
    key: string,
    value: string,
    options?: { EX?: number }
  ): Promise<string | null> {
    try {
      if (!this.client?.isReady) await this.connect();
      
      if (options?.EX) {
        return await this.client!.set(key, value, { EX: options.EX });
      } else {
        return await this.client!.set(key, value);
      }
    } catch (error) {
      logError(`Error setting key ${key} in Redis`, error);
      throw error;
    }
  }

  public async del(key: string): Promise<number> {
    try {
      if (!this.client?.isReady) await this.connect();
      return await this.client!.del(key);
    } catch (error) {
      logError(`Error deleting key ${key} from Redis`, error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.client) {
        await this.client.disconnect();
        this.client = null;
      }
      logInfo('Redis connection closed successfully');
    } catch (error) {
      logError('Error closing Redis connection', error);
      this.client = null;
    }
  }
}

// Create and export a singleton instance
const redis = RedisClient.getInstance();

// Connect immediately for faster first use
redis.connect().catch(err => {
  logError('Initial Redis connection failed', err);
});

export default redis;