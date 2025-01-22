import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const myDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  logging: true,
  synchronize: true,
});

export { myDataSource };
