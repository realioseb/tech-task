import { PG_CONNECTION } from '../constants'
import { Pool } from 'pg'

export const dbProvider = {
  provide: PG_CONNECTION,
  useFactory: () => {
    return new Pool({
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
    })
  },
};
