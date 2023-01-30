## Description
The QCampusmate-Mate API written in
[Nest](https://github.com/nestjs/nest) framework.

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

## Development
### First thing first
Run `npm run migration:run`, then `npm run start` or `npm run start:dev` to start up the application server for development testing. 

When `NODE_ENV` is set to `development` or `test`, the project is configured to use **sqlite3** database.


## Production
The project uses **PostgreSQL** for production.
You also need to set a PostgreSQL database on local machine to test in production mode(`npm run start:prod`)
### Setting up the DB
0. Install **PostgreSQL**
1. Connect to the **PostgreSQL** server in default user `postgres`:
```bash
psql postgres
```
2. Create the database and user. Grant all the privileges.
```sql
CREATE DATABASE qcampusmate;
CREATE USER qcampusmate_admin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE qcampusmate TO qcampusmate_admin;
ALTER DATABASE qcampusmate OWNER TO qcampusmate_admin;
```

Now you can run the following if you want to look into the database directly.
```bash
psql --host=localhost --port=5432 -U qcampusmate_admin -W qcampusmate
```

## Test Automation

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch
- Author - [nilumbra](https://kamilmysliwiec.com)

## License

