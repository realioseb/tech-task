import { ELASTIC_CLIENT } from '../constants'
import { Client } from '@elastic/elasticsearch'

export const elasticSearchProvider = {
  provide: ELASTIC_CLIENT,
  useFactory: () => {
    return new Client({
      node: process.env.ELASTIC_NODE
    })
  },
};
