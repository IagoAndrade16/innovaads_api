import 'reflect-metadata';
import { DependencyInjection } from '../core/DependencyInjection';
import { Environment } from '../core/Enviroment';
// import { vitest } from 'vitest';

Environment.assertInitialized();
DependencyInjection.init();
// vitest.waitUntil(() => Promise.resolve(), { timeout: 10000 });
