import { DataSource, DataSourceOptions } from 'typeorm'

const baseConfig = {
  synchronize: false
}

var dataSourceOptions: DataSourceOptions

console.log("env:", process.env.NODE_ENV)
// dev
switch(process.env.NODE_ENV) {
  case 'development':
    dataSourceOptions = Object.assign(baseConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
      migrations: ['dist/db/migrations-dev/**/*{.js,.ts}']
    }) as DataSourceOptions
    break;
  case 'test':
    dataSourceOptions = Object.assign(baseConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrations: ['dist/db/migrations-dev/**/*{.js,.ts}'],
      migrationsRun: true // run migrations before 
    }) as DataSourceOptions
    break;
  case 'production':
    dataSourceOptions = Object.assign(baseConfig, {
      type: 'postgres',
      host: "localhost",
      database: "qcampusmate", 
      port: 5432,
      username: "qcampusmate_admin", //process.env.DB_USER, // qcampusmate_admin
      password: "qcadmin123", //process.env.DB_PASSWORD // qcadmin123
      entities: ['**/*.entity.js'],
      migrations: ['dist/db/migrations-prod/**/*.js'],
      migrationsRun: true
    }) as DataSourceOptions
    break;
  default:
    throw new Error('Unknown environment!!')
}

const dataSource = new DataSource(dataSourceOptions)
export { dataSource, dataSourceOptions } 