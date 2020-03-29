import { Module } from '@nestjs/common'
import { ElasticSearchService } from './elastic-search.service'
import { elasticSearchProvider } from './elastic-search.provider'

@Module({
  providers: [elasticSearchProvider, ElasticSearchService],
  exports: [ElasticSearchService],
})
export class ElasticSearchModule {}
