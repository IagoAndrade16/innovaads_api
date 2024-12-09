
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import { DependencyInjection } from '../core/DependencyInjection';
import { Environment } from '../core/Enviroment';
import { handleErrors } from './middlewares/handleErrors';



const app = express();

Environment.assertInitialized();
DependencyInjection.init()

app.use(cors({ origin: '*' }));
app.options('*', cors());

app.use(express.json({ limit: '30mb' }));

app.use(express.static('public'));

// app.use(rateLimiter);
// app.use(appRouter);

app.use(handleErrors as unknown as express.ErrorRequestHandler);

export { app };
