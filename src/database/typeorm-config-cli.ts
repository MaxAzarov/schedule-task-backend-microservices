import * as fs from 'fs';
import { DataSource } from 'typeorm';

const ormConfig = fs.readFileSync('ormconfig.json');

export const AppDataSource = new DataSource(JSON.parse(ormConfig.toString()));
