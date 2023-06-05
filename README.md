## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

1. Use 16.17.1 version of node.js
2. Clone repository
3. npm install
4. Copy env-example and create .env file. Fill in this env file
5. Run the migrations: npm run migrations:run
6. Install free version of ngrok
7. Run command: ngrok http 5000
8. Change env variables:
   TRELLO_WEBHOOK_CALLBACK=ngrok_url/trello/webhook/callback
   JIRA_WEBHOOK_CALLBACK=ngrok_url/jira/webhook/callback
9. npm run start:dev
