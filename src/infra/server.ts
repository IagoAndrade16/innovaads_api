import 'reflect-metadata';
import { app } from './app';

import { onListening, shutDownGracefully } from './setup';
import { PM2 } from '../core/PM2';
import { Environment } from '../core/Enviroment';
import { Database } from '../database/Database';

(async () => {
	await Database.initialize();

	const server = app.listen(Environment.vars.PORT, onListening)
	PM2.onClose(() => shutDownGracefully(server));
})();
