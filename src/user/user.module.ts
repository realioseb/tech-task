import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { DbModule } from '../db/db.module'
import { UserRepository } from './user.repository'
import { ElasticSearchModule } from '../elastic-search/elastic-search.module'

@Module({
  providers: [UserService, UserRepository],
  imports: [DbModule, ElasticSearchModule],
  exports: [UserService],
})
export class UserModule {}
