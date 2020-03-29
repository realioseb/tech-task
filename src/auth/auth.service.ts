import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common'
import { hash, compare } from 'bcrypt'
import { randomBytes } from 'crypto'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { EmailService } from '../email/email.service'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.find({ email })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const date = new Date()
    date.setHours(date.getHours() - 1)

    if (user.attempts > 4 && user.lastAttemptDate > date) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Account was blocked temporarily for 1 hour`,
          reason: 'Too many invalid attempts',
        },
        403,
      );
    }

    if (!user.isEmailValid) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Please confirm your email first',
        },
        400,
      );
    }

    const match = await compare(password, user.password)

    if (!match) {
      await this.userService.increaseAttempts(user)
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }

  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<boolean> {
    const exists = await this.userService.find({ email })

    if (exists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          field: 'email',
          error: 'Email already exists',
        },
        400,
      )
    }

    const user = new User()

    user.email = email
    user.password = await hash(password, Number(process.env.SALT_ROUNDS) || 10)
    user.firstName = firstName
    user.lastName = lastName
    user.emailValidationToken = randomBytes(48).toString('hex')

    const userCreated = await this.userService.save(user)

    this.emailService.sendEmailConfirmation(userCreated)

    return true
  }

  async login(email: string, password: string): Promise<string> {
    const user: User = await this.validateUser(email, password)

    await this.userService.resetAttempts(user)

    return this.jwtService.sign({ id: user.id })
  }

  async verifyEmail(token: string) {
    const user = await this.userService.find({ emailToken: token })

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          field: 'token',
          error: 'Token is invalid or expired',
        },
        400,
      )
    }

    return this.userService.verifyEmail(user)
  }

  async getUser(userId: string): Promise<User> {
    const cached = await this.redisService.get<User>(userId)

    if (cached) {
      return cached
    }

    const user = await this.userService.find({ id: userId })

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          field: 'authorization',
          error: 'User is not logged in',
        },
        403,
      )
    }

    this.redisService.set(userId, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    return user
  }
}
