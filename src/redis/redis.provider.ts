import { REDIS_PROVIDER } from '../constants'
import { createClient } from 'redis'

export const redisProvider = {
  provide: REDIS_PROVIDER,
  useFactory: () => {
    return createClient({ url: process.env.REDIS_ADDRESS })
  },
};
