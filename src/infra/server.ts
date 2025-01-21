import 'reflect-metadata';
import { app } from './app';

import { Environment } from '../core/Enviroment';
import { PM2 } from '../core/PM2';
import { onListening, shutDownGracefully } from './setup';
import { Database } from './database/typeorm/Database';

(async () => {
	await Database.initialize();

	const server = app.listen(Environment.vars.PORT, onListening)
	PM2.onClose(() => shutDownGracefully(server));
})();
