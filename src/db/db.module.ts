import { Module } from '@nestjs/common'
import { DbService } from './db.service'
import { dbProvider } from './db.provider'



@Module({
  providers: [dbProvider, DbService],
  exports: [dbProvider, DbService],
})
export class DbModule {}
