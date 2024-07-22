import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  postgres: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: String(process.env.POSTGRES_PASSWORD) || 'postgres',
    database: process.env.POSTGRES_DB || 'postgres',
    synchronize: true // todo: set this to false in production
  }
};
