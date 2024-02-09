import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { replaceJsonWithBase64, reviveFromBase64Representation } from '@neshca/json-replacer-reviver'
import { ConfigService } from '@nestjs/config'
import {createClient, RedisClientType} from 'redis';

@Injectable()
export class RedisService {
  private readonly client: RedisClientType
  private isConnected = false
  constructor(private configService: ConfigService) {
    console.log('Creating Redis client...')

    const password = encodeURIComponent(this.configService.get<string>('PASSWORD_REDIS'))
    const redisPath = this.configService.get<string>('PATH_REDIS')
    const redisAddress = this.configService.get<string>('ADRESS_REDIS')

    const config = {
      url: `rediss://:${password}${redisAddress}`,
      socket: {
        tls: true,
        rejectUnauthorized: true,
        ca: [fs.readFileSync(`${redisPath}`).toString()],
      },
    }
    this.client = createClient(config)
    this.client
      .connect()
      .then(() => {
        this.isConnected = true
        console.log('Redis client connected.')
      })
      .catch((err) => {
        console.error('Redis connection error:', err)
      })
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected) {
      return null
    }

    try {
      const result = (await this.client.get(key)) ?? null;
      if (!result) {
        return null;
      }
      return JSON.parse(result, reviveFromBase64Representation);
    } catch (error) {
      console.error('cache.get', error);
      return null;
    }

  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {

      if (typeof ttl === 'number') {
        await this.client.set(
            key,
            JSON.stringify(value, replaceJsonWithBase64),
            { EX: ttl });
      } else {
        await this.client.set(
            key,
            JSON.stringify(value, replaceJsonWithBase64)
        );
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async getAllKeys(pattern) {
    let cursor = 0
    let keys = []
    do {
      const reply = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100
      });
      cursor = reply.cursor // Прямое присваивание, так как cursor уже является числом
      keys.push(...reply.keys)
    } while (cursor !== 0)

    return keys
  }

  async rename(oldKey: string, newKey: string): Promise<void> {
    if (!this.isConnected) {
      console.warn('Redis client is not connected.')
      return
    }

    try {
      await this.client.rename(oldKey, newKey)
    } catch (error) {
      if (error.message === 'ERR no such key') {
        console.warn(`Redis rename error: Key '${oldKey}' does not exist.`)
      } else {
        console.error('Redis rename error:', error)
      }
    }
  }

  async getAll(pattern: string): Promise<string[]> {
    if (!this.isConnected) {
      console.warn('Redis client is not connected.');
      return [];
    }

    try {
      const keys = await this.client.keys(pattern);
      return keys;
    } catch (error) {
      console.error('Error retrieving keys from Redis:', error);
      return [];
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.client.quit()
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      return false;
    }
  }


  async del(key: string | string[]): Promise<number> {
    return await this.client.del(key);
  }

}
