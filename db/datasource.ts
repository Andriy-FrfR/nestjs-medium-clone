import { DataSource } from 'typeorm';
import { extname, resolve } from 'path';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  database: process.env.DB_DATABASE_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  entities: [resolve(__dirname, `../src/**/*.entity${extname(__filename)}`)],
  migrations: [resolve(__dirname, `./migrations/**/*${extname(__filename)}`)],
});
