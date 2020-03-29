# Technical Task

## Prerequisites

1. Redis installed and running locally (Port 6379 or update REDIS_ADDRESS value .env file)
2. Elasticsearch installed and running locally (Port 9200 or update ELASTIC_NODE value .env file)
3. Postgres server installed and running (update DB_* params in .env file to match existing db)

## Installation:

Rename .env.sample to .env and set your custom values or use defaults<br />
Make sure SENDGRID_API_KEY is replaced by a real sendgrid API key

```bash
$ yarn install
```

## Running the app
```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
