import { config } from './config/env';

console.log(`Puerto: ${config.port}, BD: ${config.db.database}`);