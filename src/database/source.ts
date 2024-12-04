import { Environment } from "../core/Enviroment";
import { DataSource } from "typeorm";

Environment.assertInitialized();

export const datasource = new DataSource({
  type: 'mysql',
	timezone: 'Z',
  port: Environment.vars.MYSQL_PORT,
  host: Environment.vars.MYSQL_HOST,
  username: Environment.vars.MYSQL_USER,
	password: Environment.vars.MYSQL_PASS,
	database: Environment.vars.MYSQL_DATABASE,
	logging: Environment.vars.DB_LOGGING,
  ssl: {},
	entities: [
		Environment.getType() === 'prod' ? '**/entities/*.js' : '**/entities/*.ts',
	],
	migrations: [
		Environment.getType() === 'prod'
			? '**/migrations/*.js'
			: '**/migrations/*.ts',
	],
	synchronize: false,
})