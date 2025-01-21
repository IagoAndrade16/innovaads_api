import * as http from 'http';

import { PM2 } from '../core/PM2';
import { Database } from './database/typeorm/Database';



export async function onListening() {
	PM2.emitReady();
	// TaskManager.scheduleAll();

	console.log('🚀 Server is running version 1.0.0!');
}

export async function shutDownGracefully(server: http.Server) {
	server.close(async () => {
		await Database.close();
		process.exit(0);
	});
}
