import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ConfigModule } from '@nestjs/config'
// import { AppService } from './app.service'
import { DbModule } from './db/db.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { EmailModule } from './email/email.module'
import { RedisModule } from './redis/redis.module'
import { ElasticSearchModule } from './elastic-search/elastic-search.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
    }),
    DbModule,
    UserModule,
    AuthModule,
    EmailModule,
    RedisModule,
    ElasticSearchModule,
  ],
})
export class AppModule {}
