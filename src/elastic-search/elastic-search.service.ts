import { Injectable, Inject } from '@nestjs/common'
import { Client } from '@elastic/elasticsearch'
import { ELASTIC_CLIENT } from '../constants'

@Injectable()
export class ElasticSearchService {
  constructor(
    @Inject(ELASTIC_CLIENT) private readonly elasticSearch: Client,
  ) {}

  index(index: string, body: any) {
    return this.elasticSearch.index({
      index,
      refresh: 'true',
      body,
    })
  }
}
