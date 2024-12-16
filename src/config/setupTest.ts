import 'reflect-metadata';
import { DependencyInjection } from '../core/DependencyInjection';
import { Environment } from '../core/Enviroment';

Environment.assertInitialized();
DependencyInjection.init();