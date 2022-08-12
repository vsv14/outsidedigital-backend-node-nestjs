# [Тестовое задание для NodeJs разработчика](https://github.com/kisilya/test-tasks/tree/main/nodeJS)


## Deployed on HEROKU

API Docs / Swagger: click here -> [App API](https://outsidedigital-task-node.herokuapp.com/api/docs)

## Deploying environment

```bash
$ docker compose up

# list containers
$ docker ps

$ docker exec -it <node_container> sh
```

## Run migration

```bash
# generate migration
$ npm run typeorm:generate-migration ./src/migration/migration-1
  
# run migrations
$ npm run typeorm:run-migrations
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

## Tests

```bash
# e2e tests
$ npm run test:e2e
```