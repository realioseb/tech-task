import { Injectable, Inject } from '@nestjs/common'
import { RedisClient } from 'redis'
import { REDIS_PROVIDER } from '../constants'

type RedisValue = {
  expiration: number,
  value: any,
}

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_PROVIDER) private client: RedisClient
  ) {}

  set(key: string, value: any) {
    return new Promise((resolve, reject) => {
      const redisValue: RedisValue = {
        expiration: Date.now() + Number(process.env.REDIS_EXPIRATION_MS),
        value,
      }

      this.client.set(key, JSON.stringify(redisValue), (error, result) => {
        if (error) {
          reject(error)
          return
        }

        resolve(result)
      })
    })
  }

  get<T>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, result) => {
        if (error) {
          reject(error)
          return
        }
        const value: RedisValue = JSON.parse(result)

        if (!value || value.expiration < Date.now()) {
          this.client.del(key)
          resolve(null)
          return
        }

        resolve(value.value as T)
      })
    })
  }
}
