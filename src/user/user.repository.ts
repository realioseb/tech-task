import { Injectable, Inject } from '@nestjs/common'
import { Client } from 'pg'
import { PG_CONNECTION } from '../constants'
import { User } from './user.entity'
import { UserFindOptions } from './user.types'

@Injectable()
export class UserRepository {
  constructor(
    @Inject(PG_CONNECTION) private readonly conn: Client,
  ) {}
  
  createTable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `
          CREATE TABLE IF NOT EXISTS users (
            id uuid DEFAULT uuid_generate_v4 (),
            email varchar UNIQUE NOT NULL,
            is_email_valid boolean DEFAULT false,
            email_validation_token varchar,
            password varchar NOT NULL,
            first_name varchar NOT NULL,
            last_name varchar NOT NULL,
            attempts smallint DEFAULT 0,
            last_attempt_date timestamp
          )
        `,
        (error) => {
          if (error) {
            reject(error)
            return
          }

          resolve(true)
        }
      )
    })
  }

  insert(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `
          INSERT INTO users (email, password, email_validation_token, first_name, last_name)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
        [user.email, user.password, user.emailValidationToken, user.firstName, user.lastName],
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          const userCreated = this.rowToUser(result.rows[0])

          resolve(userCreated)
        }
      )
    })
  }

  findOne(options: UserFindOptions): Promise<User> {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `
          SELECT * FROM public.users u
          WHERE ($1::uuid is null OR u.id = $1::uuid)
          AND ($2::text is null OR u.email = $2::text)
          AND ($3::text is null OR u.email_validation_token = $3::text)
          LIMIT 1
        `,
        [options.id, options.email, options.emailToken],
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          const user = this.rowToUser(result.rows[0])

          resolve(user)
        }
      )
    })
  }

  verify(userId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `
          UPDATE public.users 
          SET email_validation_token = NULL, is_email_valid = true 
          WHERE $1::uuid = id 
          RETURNING * 
        `,
        [userId],
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          const user = this.rowToUser(result.rows[0])

          resolve(user)
        }
      )
    })
  }

  updateAttempts(userId: string, attempts: number): Promise<User> {
    return new Promise((resolve, reject) => {
      const date = attempts === 0 ? null : new Date()

      this.conn.query(
        `
          UPDATE public.users 
          SET attempts = $2, last_attempt_date = $3 
          WHERE $1::uuid = id 
          RETURNING * 
        `,
        [userId, attempts, date],
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          const user = this.rowToUser(result.rows[0])

          resolve(user)
        }
      )
    })
  }

  private rowToUser(row: any): User {
    if (!row) {
      return null
    }

    const user = new User()

    user.id = row.id
    user.firstName = row.first_name
    user.lastName = row.last_name
    user.email = row.email
    user.isEmailValid = row.is_email_valid
    user.emailValidationToken = row.email_validation_token
    user.password = row.password
    user.attempts = row.attempts
    user.lastAttemptDate = row.last_attempt_date

    return user
  }
}
