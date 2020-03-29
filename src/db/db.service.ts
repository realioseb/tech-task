import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { PG_CONNECTION } from '../constants'
import { Client } from 'pg'


@Injectable()
export class DbService implements OnModuleInit {
  constructor(
    @Inject(PG_CONNECTION) private readonly conn: Client,
  ) {}

  onModuleInit() {
    return this.conn.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  }
  
  isTableExists(table: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = $1::text
          )
        `,
        [table],
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          resolve(result.rows[0]?.exists)
        }
      )
    })
  }
}
