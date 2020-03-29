import { PassportModule } from '@nestjs/passport'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UserModule } from '../user/user.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { JWT_EXPIRATION } from '../constants'
import { EmailModule } from '../email/email.module'
import { LocalStrategy } from './local.strategy'
import { RedisModule } from '../redis/redis.module'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: JWT_EXPIRATION },
      })
    }),
    EmailModule,
    RedisModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
