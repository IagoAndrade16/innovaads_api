import 'reflect-metadata';
import { app } from './app';

import { onListening, shutDownGracefully } from './setup';
import { PM2 } from '../core/PM2';

// import { Environment } from '../core/Environment';
// import { PM2 } from '../core/PM2';
// import { app } from './app';
// import { onListening, shutDownGracefully } from './setup';

(async () => {
	// await Database.initialize();

	// const server = app.listen(Environment.vars.PORT, onListening);
	const server = app.listen(3000, onListening)
	PM2.onClose(() => shutDownGracefully(server));
})();
