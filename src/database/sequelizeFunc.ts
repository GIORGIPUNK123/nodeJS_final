import config from './config.json';
import { Sequelize, Dialect } from 'sequelize';
export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as Dialect,
    logging: config.logging,
  }
);
