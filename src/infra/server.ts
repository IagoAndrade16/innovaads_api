import 'reflect-metadata';
import { app } from './app';

import { Environment } from '../core/Enviroment';
import { PM2 } from '../core/PM2';
import { Database } from '../database/Database';
import { onListening, shutDownGracefully } from './setup';

(async () => {
	await Database.initialize();

	const server = app.listen(Environment.vars.PORT, onListening)
	PM2.onClose(() => shutDownGracefully(server));
})();
